import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const visitorTools: Tool[] = [
  {
    name: "visitor_get",
    description: "Retrieve a visitor by their user_id.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The user_id of the visitor to retrieve.",
        },
      },
      required: ["user_id"],
    },
  },
  {
    name: "visitor_update",
    description: "Update a visitor's name or custom attributes.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The unique identifier for the visitor.",
        },
        name: {
          type: "string",
          description: "The name to set for the visitor.",
        },
        custom_attributes: {
          type: "object",
          description: "A key-value map of custom attributes to update on the visitor.",
          additionalProperties: true,
        },
      },
      required: ["id"],
    },
  },
  {
    name: "visitor_convert",
    description: "Convert a visitor into a lead or user.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["lead", "user"],
          description: "The type of contact to convert the visitor into.",
        },
        visitor: {
          type: "object",
          description: "Object identifying the visitor to convert. Must include either 'id' or 'user_id'.",
          properties: {
            id: {
              type: "string",
              description: "The visitor's Intercom ID.",
            },
            user_id: {
              type: "string",
              description: "The visitor's user_id.",
            },
          },
          additionalProperties: false,
        },
        user: {
          type: "object",
          description: "Object identifying the target user or lead. Must include 'id', 'email', or 'user_id'.",
          properties: {
            id: {
              type: "string",
              description: "The user's Intercom ID.",
            },
            email: {
              type: "string",
              description: "The user's email address.",
            },
            user_id: {
              type: "string",
              description: "The user's user_id.",
            },
          },
          additionalProperties: false,
        },
      },
      required: ["type", "visitor", "user"],
    },
  },
];

export async function handleVisitorTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "visitor_get":
      return intercomRequest("GET", "/visitors", undefined, {
        user_id: input.user_id as string,
      });

    case "visitor_update": {
      const body: Record<string, unknown> = { id: input.id };
      if (input.name !== undefined) body.name = input.name;
      if (input.custom_attributes !== undefined) body.custom_attributes = input.custom_attributes;
      return intercomRequest("PUT", "/visitors", body);
    }

    case "visitor_convert":
      return intercomRequest("POST", "/visitors/convert", {
        type: input.type,
        visitor: input.visitor,
        user: input.user,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
