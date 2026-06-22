# Installation & Configuration Guide

This guide covers how to install and configure the Intercom MCP server in **Claude (desktop app)** and **Claude Code (CLI)**.

---

## Prerequisites

- **Node.js 18+** — check with `node --version`
- **An Intercom workspace account** — no developer token required for proxy mode

---

## Step 1: Build the server

```bash
git clone https://github.com/OtakuXavier/intercom-mcp-server.git
cd intercom-mcp-server
npm install
```

`npm install` automatically runs `tsc` and produces `dist/index.js`.

Note the full path to this directory — you'll need it in the config below.  
Example: `/Users/yourname/intercom-mcp-server`

---

## Step 2: Choose your authentication mode

| Mode | What you need | How it works |
|------|--------------|--------------|
| **Proxy** (recommended) | Just an Intercom workspace login | Piggybacks on `mcp.intercom.com` via `mcp-remote` |
| **Access token** | A token from Intercom Settings | Calls `api.intercom.io` directly (102 tools) |
| **OAuth app** | A registered Intercom developer app | Browser-based consent flow, token saved locally |

For most users, **proxy mode** is the right choice — skip ahead to Step 3.

---

## Step 3: Configure Claude (desktop app)

Open the Claude desktop config file:

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

### Proxy mode (no token needed)

Add **both** entries to `mcpServers`. The `intercom` entry handles authentication via your browser; `intercom-local` proxies through it automatically when no token is found.

```json
{
  "mcpServers": {
    "intercom": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.intercom.com/mcp"]
    },
    "intercom-local": {
      "command": "node",
      "args": ["/FULL/PATH/TO/intercom-mcp-server/dist/index.js"]
    }
  }
}
```

### Access token mode

```json
{
  "mcpServers": {
    "intercom-local": {
      "command": "node",
      "args": ["/FULL/PATH/TO/intercom-mcp-server/dist/index.js"],
      "env": {
        "INTERCOM_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

Get your token from: **Intercom Settings → Developers → Access tokens** (workspace admin required).

### OAuth app mode

```json
{
  "mcpServers": {
    "intercom-local": {
      "command": "node",
      "args": ["/FULL/PATH/TO/intercom-mcp-server/dist/index.js"],
      "env": {
        "INTERCOM_CLIENT_ID": "your_client_id",
        "INTERCOM_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

Then ask Claude: *"Call auth_start"* — it will return a URL to open in your browser. After you approve, the token is stored at `~/.intercom-mcp/token.json` and all tools become available.

**After editing the config, restart Claude desktop.**

---

## Step 4: Configure Claude Code (CLI)

Add to `~/.claude.json` (global) or `.claude/settings.json` (per-project):

### Proxy mode

```json
{
  "mcpServers": {
    "intercom": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.intercom.com/mcp"]
    },
    "intercom-local": {
      "command": "node",
      "args": ["/FULL/PATH/TO/intercom-mcp-server/dist/index.js"]
    }
  }
}
```

Or use the Claude Code CLI:

```bash
claude mcp add intercom -- npx -y mcp-remote https://mcp.intercom.com/mcp
claude mcp add intercom-local -- node /FULL/PATH/TO/intercom-mcp-server/dist/index.js
```

### Access token mode

```bash
claude mcp add intercom-local -e INTERCOM_ACCESS_TOKEN=your_token_here -- \
  node /FULL/PATH/TO/intercom-mcp-server/dist/index.js
```

---

## Step 5: Verify it's working

In Claude (desktop or Code), ask:

> *"Call auth_status on the intercom-local server"*

Expected response in proxy mode:
```
{ "authenticated": false, "message": "No token found. Run auth_start..." }
```
This is correct — proxy mode doesn't use a stored token; it routes through `mcp.intercom.com` which has its own session.

Or ask directly:
> *"List my Intercom conversations"*

The server will proxy the request through `mcp.intercom.com`. On first use, `mcp-remote` will print a browser login URL to the terminal — open it, log in with your Intercom workspace account, and you're done.

---

## How the three modes work

```
Proxy mode (no token):
  Claude → intercom-local → spawns mcp-remote → mcp.intercom.com → Intercom API

Native mode (token set):
  Claude → intercom-local → api.intercom.io  (102 tools, direct)

OAuth mode (client_id/secret):
  1. Call auth_start → open browser URL → approve
  2. Token saved to ~/.intercom-mcp/token.json
  3. Same as native mode from then on
```

---

## Updating

```bash
cd intercom-mcp-server
git pull
npm install   # rebuilds dist/
```

Restart Claude desktop or reload the MCP server in Claude Code after updating.

---

## Troubleshooting

**"Proxy mode: connected to mcp.intercom.com (0 tools)"**  
The `mcp-remote` session may have expired. Open a terminal, run:
```bash
npx -y mcp-remote https://mcp.intercom.com/mcp
```
It will print a browser login URL. Complete the login, then restart Claude.

**"Cannot find module" or "dist/index.js not found"**  
Run `npm install` in the repo directory to rebuild.

**Tools not appearing in Claude**  
Check the server name in `mcpServers` matches what you're asking about. In Claude desktop, check **Settings → Developer → MCP Servers** to see connection status.
