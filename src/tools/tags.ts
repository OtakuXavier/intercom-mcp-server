import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const tagTools: Tool[] = [
  {
    name: "tag_list",
    description: "List all tags in the workspace.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "tag_get",
    description: "Retrieve a specific tag by ID.",
    inputSchema: {
      type: "object",
      properties: {
        tag_id: { type: "string", description: "The unique identifier of the tag." },
      },
      required: ["tag_id"],
    },
  },
  {
    name: "tag_create_or_update",
    description: "Create a new tag or update an existing tag's name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The name of the tag." },
        id: { type: "string", description: "The ID of an existing tag to update." },
      },
      required: ["name"],
    },
  },
  {
    name: "tag_delete",
    description: "Delete a tag by ID.",
    inputSchema: {
      type: "object",
      properties: {
        tag_id: { type: "string", description: "The unique identifier of the tag to delete." },
      },
      required: ["tag_id"],
    },
  },
  {
    name: "tag_companies",
    description: "Tag or untag companies. Pass a companies array of objects with company_id or id. Set untag: true on an item to remove the tag from that company.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The name of the tag to apply." },
        companies: {
          type: "array",
          description: "Array of company objects to tag. Each object should have company_id or id, and optionally untag: true to remove the tag.",
          items: {
            type: "object",
            properties: {
              company_id: { type: "string", description: "The company_id of the company." },
              id: { type: "string", description: "The id of the company." },
              untag: { type: "boolean", description: "Set to true to remove the tag from this company." },
            },
          },
        },
      },
      required: ["name", "companies"],
    },
  },
  {
    name: "tag_conversation",
    description: "Add a tag to a conversation.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: { type: "string", description: "The unique identifier of the conversation." },
        id: { type: "string", description: "The ID of the tag to add." },
        admin_id: { type: "string", description: "The ID of the admin performing the action." },
      },
      required: ["conversation_id", "id", "admin_id"],
    },
  },
  {
    name: "tag_detach_conversation",
    description: "Remove a tag from a conversation.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: { type: "string", description: "The unique identifier of the conversation." },
        tag_id: { type: "string", description: "The ID of the tag to remove." },
        admin_id: { type: "string", description: "The ID of the admin performing the action." },
      },
      required: ["conversation_id", "tag_id", "admin_id"],
    },
  },
  {
    name: "tag_ticket",
    description: "Add a tag to a ticket.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_id: { type: "string", description: "The unique identifier of the ticket." },
        id: { type: "string", description: "The ID of the tag to add." },
        admin_id: { type: "string", description: "The ID of the admin performing the action." },
      },
      required: ["ticket_id", "id", "admin_id"],
    },
  },
  {
    name: "tag_detach_ticket",
    description: "Remove a tag from a ticket.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_id: { type: "string", description: "The unique identifier of the ticket." },
        tag_id: { type: "string", description: "The ID of the tag to remove." },
        admin_id: { type: "string", description: "The ID of the admin performing the action." },
      },
      required: ["ticket_id", "tag_id", "admin_id"],
    },
  },
];

export async function handleTagTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "tag_list":
      return intercomRequest("GET", "/tags");

    case "tag_get":
      return intercomRequest("GET", `/tags/${input.tag_id}`);

    case "tag_create_or_update": {
      const body: Record<string, unknown> = { name: input.name };
      if (input.id !== undefined) body.id = input.id;
      return intercomRequest("POST", "/tags", body);
    }

    case "tag_delete":
      return intercomRequest("DELETE", `/tags/${input.tag_id}`);

    case "tag_companies": {
      const body: Record<string, unknown> = {
        name: input.name,
        companies: input.companies,
      };
      return intercomRequest("POST", "/tags", body);
    }

    case "tag_conversation":
      return intercomRequest("POST", `/conversations/${input.conversation_id}/tags`, {
        id: input.id,
        admin_id: input.admin_id,
      });

    case "tag_detach_conversation":
      return intercomRequest(
        "DELETE",
        `/conversations/${input.conversation_id}/tags/${input.tag_id}`,
        { admin_id: input.admin_id }
      );

    case "tag_ticket":
      return intercomRequest("POST", `/tickets/${input.ticket_id}/tags`, {
        id: input.id,
        admin_id: input.admin_id,
      });

    case "tag_detach_ticket":
      return intercomRequest(
        "DELETE",
        `/tickets/${input.ticket_id}/tags/${input.tag_id}`,
        { admin_id: input.admin_id }
      );

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
