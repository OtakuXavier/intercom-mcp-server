import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const dataAttributeTools: Tool[] = [
  {
    name: "data_attribute_list",
    description: "List data attributes for contacts, companies, or conversations.",
    inputSchema: {
      type: "object",
      properties: {
        model: {
          type: "string",
          enum: ["contact", "company", "conversation"],
          description: "Filter by the model the data attributes belong to.",
        },
        include_archived: {
          type: "boolean",
          description: "Whether to include archived attributes in the results.",
        },
      },
      required: [],
    },
  },
  {
    name: "data_attribute_create",
    description: "Create a new custom data attribute for contacts or companies.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the data attribute.",
        },
        model: {
          type: "string",
          enum: ["contact", "company"],
          description: "The model the attribute belongs to.",
        },
        data_type: {
          type: "string",
          enum: ["string", "integer", "float", "boolean", "datetime", "date"],
          description: "The data type of the attribute.",
        },
        description: {
          type: "string",
          description: "A description of the attribute.",
        },
        options: {
          type: "array",
          items: { type: "string" },
          description: "Allowed values for the attribute (for string types).",
        },
        messenger_writable: {
          type: "boolean",
          description: "Whether the attribute can be updated by contacts via the Messenger.",
        },
      },
      required: ["name", "model", "data_type"],
    },
  },
  {
    name: "data_attribute_update",
    description: "Update an existing data attribute by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        data_attribute_id: {
          type: "string",
          description: "The ID of the data attribute to update.",
        },
        archived: {
          type: "boolean",
          description: "Whether to archive or unarchive the attribute.",
        },
        description: {
          type: "string",
          description: "A description of the attribute.",
        },
        options: {
          type: "array",
          items: { type: "string" },
          description: "Allowed values for the attribute (for string types).",
        },
        messenger_writable: {
          type: "boolean",
          description: "Whether the attribute can be updated by contacts via the Messenger.",
        },
      },
      required: ["data_attribute_id"],
    },
  },
];

export async function handleDataAttributeTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "data_attribute_list":
      return intercomRequest("GET", "/data_attributes", undefined, {
        model: input.model as string | undefined,
        include_archived: input.include_archived as boolean | undefined,
      });

    case "data_attribute_create": {
      const body: Record<string, unknown> = {
        name: input.name,
        model: input.model,
        data_type: input.data_type,
      };
      if (input.description !== undefined) body.description = input.description;
      if (input.options !== undefined) body.options = input.options;
      if (input.messenger_writable !== undefined) body.messenger_writable = input.messenger_writable;
      return intercomRequest("POST", "/data_attributes", body);
    }

    case "data_attribute_update": {
      const body: Record<string, unknown> = {};
      if (input.archived !== undefined) body.archived = input.archived;
      if (input.description !== undefined) body.description = input.description;
      if (input.options !== undefined) body.options = input.options;
      if (input.messenger_writable !== undefined) body.messenger_writable = input.messenger_writable;
      return intercomRequest("PUT", `/data_attributes/${input.data_attribute_id}`, body);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
