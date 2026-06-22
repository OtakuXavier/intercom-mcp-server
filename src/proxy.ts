import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import type { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";

let proxyClient: Client | null = null;

export async function initProxyClient(): Promise<Tool[]> {
  const transport = new StdioClientTransport({
    command: "npx",
    args: ["-y", "mcp-remote", "https://mcp.intercom.com/mcp"],
    stderr: "inherit",
  });

  proxyClient = new Client(
    { name: "intercom-mcp-proxy", version: "1.0.0" },
    { capabilities: {} }
  );

  await proxyClient.connect(transport);

  const { tools } = await proxyClient.listTools();
  process.stderr.write(`Proxy mode: connected to mcp.intercom.com (${tools.length} tools)\n`);
  return tools;
}

export async function callProxyTool(
  name: string,
  args: Record<string, unknown>
): Promise<CallToolResult> {
  if (!proxyClient) throw new Error("Proxy client not initialized");
  return (await proxyClient.callTool({ name, arguments: args })) as CallToolResult;
}
