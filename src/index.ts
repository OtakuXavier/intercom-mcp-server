#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Tool } from "@modelcontextprotocol/sdk/types.js";

import { authTools, handleAuthTool } from "./tools/auth.js";
import { adminTools, handleAdminTool } from "./tools/admins.js";
import { articleTools, handleArticleTool } from "./tools/articles.js";
import { companyTools, handleCompanyTool } from "./tools/companies.js";
import { contactTools, handleContactTool } from "./tools/contacts.js";
import { conversationTools, handleConversationTool } from "./tools/conversations.js";
import { dataAttributeTools, handleDataAttributeTool } from "./tools/data-attributes.js";
import { dataEventTools, handleDataEventTool } from "./tools/data-events.js";
import { helpCenterTools, handleHelpCenterTool } from "./tools/help-center.js";
import { messageTools, handleMessageTool } from "./tools/messages.js";
import { newsTools, handleNewsTool } from "./tools/news.js";
import { segmentTools, handleSegmentTool } from "./tools/segments.js";
import { tagTools, handleTagTool } from "./tools/tags.js";
import { teamTools, handleTeamTool } from "./tools/teams.js";
import { ticketTools, handleTicketTool } from "./tools/tickets.js";
import { visitorTools, handleVisitorTool } from "./tools/visitors.js";
import { initProxyClient, callProxyTool } from "./proxy.js";
import { getStoredToken } from "./auth.js";

const nativeTools: Tool[] = [
  ...authTools,
  ...adminTools,
  ...articleTools,
  ...companyTools,
  ...contactTools,
  ...conversationTools,
  ...dataAttributeTools,
  ...dataEventTools,
  ...helpCenterTools,
  ...messageTools,
  ...newsTools,
  ...segmentTools,
  ...tagTools,
  ...teamTools,
  ...ticketTools,
  ...visitorTools,
];

function isAuthenticated(): boolean {
  return Boolean(process.env.INTERCOM_ACCESS_TOKEN) || Boolean(getStoredToken());
}

async function main() {
  const useProxy = !isAuthenticated();

  let proxyTools: Tool[] = [];
  if (useProxy) {
    process.stderr.write(
      "No INTERCOM_ACCESS_TOKEN or stored OAuth token found — starting in proxy mode.\n" +
      "Proxying through mcp.intercom.com (uses your existing mcp-remote session).\n"
    );
    proxyTools = await initProxyClient();
  } else {
    process.stderr.write("Token found — starting in native mode (api.intercom.io).\n");
  }

  const server = new Server(
    { name: "intercom-mcp-server", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // In proxy mode: expose the proxy's tools plus auth tools.
  // In native mode: expose all native tools.
  const exposedTools: Tool[] = useProxy
    ? [...authTools, ...proxyTools]
    : nativeTools;

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: exposedTools,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const input = (args ?? {}) as Record<string, unknown>;

    try {
      // Auth tools are always handled natively
      if (name.startsWith("auth_")) {
        const result = await handleAuthTool(name, input);
        return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
      }

      // Proxy mode: forward to mcp.intercom.com
      if (useProxy) {
        return await callProxyTool(name, input);
      }

      // Native mode: dispatch to local handlers
      let result: unknown;
      if (name.startsWith("admin_")) result = await handleAdminTool(name, input);
      else if (name.startsWith("article_")) result = await handleArticleTool(name, input);
      else if (name.startsWith("company_") || name === "attach_contact_to_company" || name === "list_contact_companies" || name === "detach_contact_from_company") result = await handleCompanyTool(name, input);
      else if (name.startsWith("contact_") || name === "merge_contacts" || name === "search_contacts") result = await handleContactTool(name, input);
      else if (name.startsWith("conversation_") || name === "search_conversations") result = await handleConversationTool(name, input);
      else if (name.startsWith("data_attribute_")) result = await handleDataAttributeTool(name, input);
      else if (name.startsWith("data_event_")) result = await handleDataEventTool(name, input);
      else if (name.startsWith("help_center_") || name.startsWith("collection_")) result = await handleHelpCenterTool(name, input);
      else if (name === "create_message") result = await handleMessageTool(name, input);
      else if (name.startsWith("news_")) result = await handleNewsTool(name, input);
      else if (name.startsWith("segment_")) result = await handleSegmentTool(name, input);
      else if (name.startsWith("tag_")) result = await handleTagTool(name, input);
      else if (name.startsWith("team_")) result = await handleTeamTool(name, input);
      else if (name.startsWith("ticket_") || name.startsWith("ticket_type_")) result = await handleTicketTool(name, input);
      else if (name.startsWith("visitor_")) result = await handleVisitorTool(name, input);
      else throw new Error(`Unknown tool: ${name}`);

      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write("Intercom MCP server running on stdio\n");
}

main().catch((err) => {
  process.stderr.write(`Fatal error: ${err}\n`);
  process.exit(1);
});
