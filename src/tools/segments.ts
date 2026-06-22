import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const segmentTools: Tool[] = [
  {
    name: "segment_list",
    description: "List all segments in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        include_count: {
          type: "boolean",
          description: "Whether to include the contact count for each segment.",
        },
      },
      required: [],
    },
  },
  {
    name: "segment_get",
    description: "Retrieve a specific segment by ID.",
    inputSchema: {
      type: "object",
      properties: {
        segment_id: {
          type: "string",
          description: "The unique identifier for the segment.",
        },
      },
      required: ["segment_id"],
    },
  },
  {
    name: "segment_list_for_contact",
    description: "List all segments that a specific contact belongs to.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: {
          type: "string",
          description: "The unique identifier for the contact.",
        },
      },
      required: ["contact_id"],
    },
  },
];

export async function handleSegmentTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "segment_list":
      return intercomRequest("GET", "/segments", undefined, {
        include_count: input.include_count as boolean | undefined,
      });

    case "segment_get":
      return intercomRequest("GET", `/segments/${input.segment_id}`);

    case "segment_list_for_contact":
      return intercomRequest("GET", `/contacts/${input.contact_id}/segments`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
