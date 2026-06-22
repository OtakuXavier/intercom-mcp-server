import { createServer } from "http";
import type { Server as HttpServer } from "http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, unlinkSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const TOKEN_DIR = join(homedir(), ".intercom-mcp");
const TOKEN_FILE = join(TOKEN_DIR, "token.json");

export const CALLBACK_PORT = Number(process.env.INTERCOM_OAUTH_PORT ?? 3456);
const REDIRECT_URI = `http://localhost:${CALLBACK_PORT}/callback`;

interface StoredToken {
  access_token: string;
  stored_at: number;
}

export function getStoredToken(): string | null {
  if (!existsSync(TOKEN_FILE)) return null;
  try {
    const data = JSON.parse(readFileSync(TOKEN_FILE, "utf-8")) as StoredToken;
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export function storeToken(access_token: string): void {
  mkdirSync(TOKEN_DIR, { recursive: true });
  writeFileSync(TOKEN_FILE, JSON.stringify({ access_token, stored_at: Date.now() }, null, 2));
}

export function clearToken(): void {
  if (existsSync(TOKEN_FILE)) unlinkSync(TOKEN_FILE);
}

export function getToken(): string {
  const envToken = process.env.INTERCOM_ACCESS_TOKEN;
  if (envToken) return envToken;

  const stored = getStoredToken();
  if (stored) return stored;

  throw new Error(
    "Not authenticated. Call the auth_start tool to begin OAuth login, " +
    "or set the INTERCOM_ACCESS_TOKEN environment variable directly."
  );
}

function getClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.INTERCOM_CLIENT_ID;
  const clientSecret = process.env.INTERCOM_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error(
      "INTERCOM_CLIENT_ID and INTERCOM_CLIENT_SECRET environment variables must be set to use OAuth. " +
      "Register an app at https://app.intercom.com/a/apps/_/developer-hub to obtain them."
    );
  }
  return { clientId, clientSecret };
}

// Stored so we can close it after callback
let callbackServer: HttpServer | null = null;

export function startOAuthCallbackServer(): string {
  const { clientId } = getClientCredentials();

  // Close any previous server
  if (callbackServer) {
    callbackServer.close();
    callbackServer = null;
  }

  const state = Math.random().toString(36).slice(2, 10);
  const authUrl =
    `https://app.intercom.com/oauth?` +
    new URLSearchParams({
      client_id: clientId,
      redirect_uri: REDIRECT_URI,
      response_type: "code",
      state,
    }).toString();

  callbackServer = createServer((req, res) => {
    if (!req.url?.startsWith("/callback")) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    const params = new URL(req.url, `http://localhost:${CALLBACK_PORT}`).searchParams;
    const code = params.get("code");
    const error = params.get("error");

    if (error) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(htmlPage("Authentication failed", `<p style="color:red">Error: ${error}</p>`));
      callbackServer?.close();
      callbackServer = null;
      return;
    }

    if (!code) {
      res.writeHead(400, { "Content-Type": "text/html" });
      res.end(htmlPage("Bad request", "<p>Missing code parameter.</p>"));
      return;
    }

    exchangeCodeForToken(code)
      .then(() => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlPage(
          "Authentication successful",
          "<p>You can close this tab and return to Claude. Your Intercom account is now connected.</p>"
        ));
        callbackServer?.close();
        callbackServer = null;
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : String(err);
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(htmlPage("Token exchange failed", `<p style="color:red">${msg}</p>`));
      });
  });

  callbackServer.listen(CALLBACK_PORT, () => {
    process.stderr.write(`Intercom OAuth callback server listening on http://localhost:${CALLBACK_PORT}\n`);
  });

  return authUrl;
}

async function exchangeCodeForToken(code: string): Promise<void> {
  const { clientId, clientSecret } = getClientCredentials();

  const res = await fetch("https://api.intercom.io/auth/eagle/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }).toString(),
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${text}`);
  }

  const data = JSON.parse(text) as { access_token?: string; token?: string };
  const token = data.access_token ?? data.token;
  if (!token) {
    throw new Error(`No access_token in response: ${text}`);
  }

  storeToken(token);
  process.stderr.write("Intercom OAuth token stored successfully.\n");
}

function htmlPage(title: string, body: string): string {
  return `<!DOCTYPE html><html><head><title>${title}</title>
  <style>body{font-family:sans-serif;max-width:480px;margin:80px auto;padding:0 16px}h1{color:#333}</style>
  </head><body><h1>${title}</h1>${body}</body></html>`;
}
