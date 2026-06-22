import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const dataEventTools: Tool[] = [
  {
    name: "data_event_list",
    description:
      "List data events for a user. Requires a user identifier via the `filter` parameter.",
    inputSchema: {
      type: "object",
      properties: {
        filter: {
          type: "string",
          description: "The user identifier to filter events by (e.g. user ID or email).",
        },
        type: {
          type: "string",
          enum: ["user"],
          description: "Must be 'user'.",
        },
        summary: {
          type: "boolean",
          description: "If true, return a summary of events rather than individual occurrences.",
        },
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
      },
      required: ["filter", "type"],
    },
  },
  {
    name: "data_event_create",
    description:
      "Create (track) a data event for a contact. At least one of id, user_id, or email is required to identify the contact.",
    inputSchema: {
      type: "object",
      properties: {
        event_name: {
          type: "string",
          description: "The name of the event.",
        },
        created_at: {
          type: "number",
          description: "Unix timestamp of when the event occurred.",
        },
        id: {
          type: "string",
          description: "The Intercom internal contact ID.",
        },
        user_id: {
          type: "string",
          description: "Your external user ID for the contact.",
        },
        email: {
          type: "string",
          description: "The email address of the contact.",
        },
        metadata: {
          type: "object",
          description: "Optional metadata to attach to the event.",
          additionalProperties: true,
        },
      },
      required: ["event_name", "created_at"],
    },
  },
  {
    name: "data_event_summaries",
    description: "Create event summaries for a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The external user ID of the contact.",
        },
        event_summaries: {
          type: "array",
          description: "Array of event summary objects.",
          items: {
            type: "object",
            properties: {
              event_name: {
                type: "string",
                description: "The name of the event.",
              },
              total: {
                type: "number",
                description: "Total number of times the event occurred.",
              },
              first: {
                type: "number",
                description: "Unix timestamp of the first occurrence.",
              },
              last: {
                type: "number",
                description: "Unix timestamp of the most recent occurrence.",
              },
            },
            required: ["event_name", "total", "first", "last"],
          },
        },
      },
      required: ["user_id", "event_summaries"],
    },
  },
];

export async function handleDataEventTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "data_event_list":
      return intercomRequest("GET", "/events", undefined, {
        filter: input.filter as string,
        type: input.type as string,
        summary: input.summary as boolean | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "data_event_create": {
      const body: Record<string, unknown> = {
        event_name: input.event_name,
        created_at: input.created_at,
      };
      if (input.id !== undefined) body.id = input.id;
      if (input.user_id !== undefined) body.user_id = input.user_id;
      if (input.email !== undefined) body.email = input.email;
      if (input.metadata !== undefined) body.metadata = input.metadata;
      return intercomRequest("POST", "/events", body);
    }

    case "data_event_summaries":
      return intercomRequest("POST", "/events/summaries", {
        user_id: input.user_id,
        event_summaries: input.event_summaries,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
