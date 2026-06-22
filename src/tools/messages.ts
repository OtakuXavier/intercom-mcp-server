import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const messageTools: Tool[] = [
  {
    name: "create_message",
    description:
      "Create and send a message (email or in-app) from an admin to a contact, user, or lead.",
    inputSchema: {
      type: "object",
      properties: {
        message_type: {
          type: "string",
          enum: ["email", "inapp"],
          description: "The type of message to send: 'email' or 'inapp'.",
        },
        body: {
          type: "string",
          description: "The body content of the message.",
        },
        from: {
          type: "object",
          description: "The admin sending the message.",
          properties: {
            type: {
              type: "string",
              enum: ["admin"],
              description: "Must be 'admin'.",
            },
            id: {
              type: "number",
              description: "The ID of the admin sending the message.",
            },
          },
          required: ["type", "id"],
        },
        to: {
          type: "object",
          description: "The recipient of the message.",
          properties: {
            type: {
              type: "string",
              enum: ["user", "lead", "contact"],
              description: "The type of the recipient.",
            },
            id: {
              type: "string",
              description: "The Intercom ID of the recipient.",
            },
          },
          required: ["type", "id"],
        },
        subject: {
          type: "string",
          description: "The subject line of the email. Required when message_type is 'email'.",
        },
        template: {
          type: "string",
          enum: ["plain", "personal"],
          description: "The template style for an email message.",
        },
      },
      required: ["message_type", "body", "from", "to"],
    },
  },
];

export async function handleMessageTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "create_message": {
      const body: Record<string, unknown> = {
        message_type: input.message_type,
        body: input.body,
        from: input.from,
        to: input.to,
      };
      if (input.subject !== undefined) body.subject = input.subject;
      if (input.template !== undefined) body.template = input.template;
      return intercomRequest("POST", "/messages", body);
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
