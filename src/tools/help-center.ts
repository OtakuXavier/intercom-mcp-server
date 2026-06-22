import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const helpCenterTools: Tool[] = [
  {
    name: "help_center_list",
    description: "List all help centers in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number." },
        per_page: { type: "number", description: "Number of results per page." },
      },
      required: [],
    },
  },
  {
    name: "help_center_get",
    description: "Retrieve a specific help center by ID.",
    inputSchema: {
      type: "object",
      properties: {
        help_center_id: { type: "string", description: "The unique identifier of the help center." },
      },
      required: ["help_center_id"],
    },
  },
  {
    name: "collection_list",
    description: "List all collections in the help center.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number." },
        per_page: { type: "number", description: "Number of results per page." },
      },
      required: [],
    },
  },
  {
    name: "collection_create",
    description: "Create a new help center collection.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "The name of the collection." },
        description: { type: "string", description: "A description of the collection." },
        parent_id: { type: "number", description: "The ID of the parent collection (for nested collections)." },
        help_center_id: { type: "number", description: "The ID of the help center this collection belongs to." },
        translated_content: {
          type: "object",
          description: "Translated content for the collection, keyed by locale.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "collection_get",
    description: "Retrieve a specific help center collection by ID.",
    inputSchema: {
      type: "object",
      properties: {
        collection_id: { type: "string", description: "The unique identifier of the collection." },
      },
      required: ["collection_id"],
    },
  },
  {
    name: "collection_update",
    description: "Update an existing help center collection.",
    inputSchema: {
      type: "object",
      properties: {
        collection_id: { type: "string", description: "The unique identifier of the collection." },
        name: { type: "string", description: "The name of the collection." },
        description: { type: "string", description: "A description of the collection." },
        parent_id: { type: "number", description: "The ID of the parent collection (for nested collections)." },
        translated_content: {
          type: "object",
          description: "Translated content for the collection, keyed by locale.",
        },
      },
      required: ["collection_id"],
    },
  },
  {
    name: "collection_delete",
    description: "Delete a help center collection by ID.",
    inputSchema: {
      type: "object",
      properties: {
        collection_id: { type: "string", description: "The unique identifier of the collection to delete." },
      },
      required: ["collection_id"],
    },
  },
];

export async function handleHelpCenterTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "help_center_list":
      return intercomRequest("GET", "/help_center/help_centers", undefined, {
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "help_center_get":
      return intercomRequest("GET", `/help_center/help_centers/${input.help_center_id}`);

    case "collection_list":
      return intercomRequest("GET", "/help_center/collections", undefined, {
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "collection_create": {
      const body: Record<string, unknown> = { name: input.name };
      if (input.description !== undefined) body.description = input.description;
      if (input.parent_id !== undefined) body.parent_id = input.parent_id;
      if (input.help_center_id !== undefined) body.help_center_id = input.help_center_id;
      if (input.translated_content !== undefined) body.translated_content = input.translated_content;
      return intercomRequest("POST", "/help_center/collections", body);
    }

    case "collection_get":
      return intercomRequest("GET", `/help_center/collections/${input.collection_id}`);

    case "collection_update": {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.description !== undefined) body.description = input.description;
      if (input.parent_id !== undefined) body.parent_id = input.parent_id;
      if (input.translated_content !== undefined) body.translated_content = input.translated_content;
      return intercomRequest("PUT", `/help_center/collections/${input.collection_id}`, body);
    }

    case "collection_delete":
      return intercomRequest("DELETE", `/help_center/collections/${input.collection_id}`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
