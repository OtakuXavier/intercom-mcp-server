import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const adminTools: Tool[] = [
  {
    name: "admin_identify",
    description: "Retrieve the currently authenticated admin.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "admin_list",
    description: "List all admins in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        display_avatar: {
          type: "boolean",
          description: "Whether to include the avatar URL in the response.",
        },
      },
      required: [],
    },
  },
  {
    name: "admin_get",
    description: "Retrieve a specific admin by ID.",
    inputSchema: {
      type: "object",
      properties: {
        admin_id: {
          type: "string",
          description: "The unique identifier for the admin.",
        },
      },
      required: ["admin_id"],
    },
  },
  {
    name: "admin_set_away",
    description: "Set an admin's away mode and optional reassignment setting.",
    inputSchema: {
      type: "object",
      properties: {
        admin_id: {
          type: "string",
          description: "The unique identifier for the admin.",
        },
        away_mode_enabled: {
          type: "boolean",
          description: "Whether away mode should be enabled for the admin.",
        },
        away_mode_reassign: {
          type: "boolean",
          description: "Whether conversations should be reassigned while the admin is away.",
        },
      },
      required: ["admin_id", "away_mode_enabled", "away_mode_reassign"],
    },
  },
  {
    name: "admin_list_activity_logs",
    description: "List activity logs for all admins, filtered by date range.",
    inputSchema: {
      type: "object",
      properties: {
        created_at_after: {
          type: "number",
          description: "Unix timestamp — return logs created after this time.",
        },
        created_at_before: {
          type: "number",
          description: "Unix timestamp — return logs created before this time.",
        },
      },
      required: ["created_at_after"],
    },
  },
];

export async function handleAdminTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "admin_identify":
      return intercomRequest("GET", "/me");

    case "admin_list":
      return intercomRequest("GET", "/admins", undefined, {
        display_avatar: input.display_avatar as boolean | undefined,
      });

    case "admin_get":
      return intercomRequest("GET", `/admins/${input.admin_id}`);

    case "admin_set_away":
      return intercomRequest("PUT", `/admins/${input.admin_id}/away`, {
        away_mode_enabled: input.away_mode_enabled,
        away_mode_reassign: input.away_mode_reassign,
      });

    case "admin_list_activity_logs":
      return intercomRequest("GET", "/admins/activity_logs", undefined, {
        created_at_after: input.created_at_after as number,
        created_at_before: input.created_at_before as number | undefined,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
