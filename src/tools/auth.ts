import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { startOAuthCallbackServer, clearToken, getStoredToken, CALLBACK_PORT } from "../auth.js";

export const authTools: Tool[] = [
  {
    name: "auth_start",
    description:
      "Start the Intercom OAuth login flow. Returns a URL the user must open in their browser. " +
      "After they authorize, the token is stored automatically and all Intercom tools become usable. " +
      "Requires INTERCOM_CLIENT_ID and INTERCOM_CLIENT_SECRET env vars.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "auth_status",
    description: "Check whether a valid Intercom access token is currently stored.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "auth_logout",
    description: "Remove the stored Intercom access token.",
    inputSchema: { type: "object", properties: {}, required: [] },
  },
];

export async function handleAuthTool(name: string, _input: Record<string, unknown>): Promise<unknown> {
  switch (name) {
    case "auth_start": {
      const authUrl = startOAuthCallbackServer();
      return {
        message:
          `Open this URL in your browser to authorize Intercom:\n\n${authUrl}\n\n` +
          `A local callback server is listening on http://localhost:${CALLBACK_PORT}. ` +
          `After you approve access, the token is stored automatically and you can use all Intercom tools.`,
        auth_url: authUrl,
      };
    }

    case "auth_status": {
      const token = process.env.INTERCOM_ACCESS_TOKEN;
      if (token) return { authenticated: true, source: "INTERCOM_ACCESS_TOKEN env var" };
      const stored = getStoredToken();
      if (stored) return { authenticated: true, source: "~/.intercom-mcp/token.json" };
      return {
        authenticated: false,
        message:
          "No token found. Run auth_start to log in via OAuth, or set the " +
          "INTERCOM_ACCESS_TOKEN environment variable.",
      };
    }

    case "auth_logout": {
      clearToken();
      return { message: "Stored token removed. Run auth_start to re-authenticate." };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
