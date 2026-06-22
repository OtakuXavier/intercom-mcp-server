import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const conversationTools: Tool[] = [
  {
    name: "conversation_list",
    description: "List all conversations with optional pagination.",
    inputSchema: {
      type: "object",
      properties: {
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
        starting_after: {
          type: "string",
          description: "Cursor for pagination (from previous response).",
        },
      },
      required: [],
    },
  },
  {
    name: "conversation_create",
    description: "Create a new conversation initiated by a user or lead.",
    inputSchema: {
      type: "object",
      properties: {
        from: {
          type: "object",
          description: "The contact initiating the conversation.",
          properties: {
            type: {
              type: "string",
              enum: ["user", "lead"],
              description: "Whether the sender is a user or lead.",
            },
            id: {
              type: "string",
              description: "The Intercom ID of the contact.",
            },
          },
          required: ["type", "id"],
        },
        body: {
          type: "string",
          description: "The message body (no HTML).",
        },
        subject: {
          type: "string",
          description: "Optional subject line for the conversation.",
        },
        attachment_urls: {
          type: "array",
          items: { type: "string" },
          description: "Optional list of attachment URLs.",
        },
        created_at: {
          type: "number",
          description: "Optional Unix timestamp for when the conversation was created.",
        },
      },
      required: ["from", "body"],
    },
  },
  {
    name: "conversation_get",
    description: "Retrieve a specific conversation by ID.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation to retrieve.",
        },
        display_as: {
          type: "string",
          enum: ["plaintext"],
          description: "Optional format for the conversation body.",
        },
      },
      required: ["conversation_id"],
    },
  },
  {
    name: "conversation_update",
    description: "Update a conversation's read status or custom attributes.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation to update.",
        },
        read: {
          type: "boolean",
          description: "Mark the conversation as read or unread.",
        },
        custom_attributes: {
          type: "object",
          description: "Custom attributes to update on the conversation.",
          additionalProperties: true,
        },
      },
      required: ["conversation_id"],
    },
  },
  {
    name: "search_conversations",
    description: "Search conversations using a query filter.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "object",
          description:
            "Search query. Either a single filter {field, operator, value} or a compound filter {operator: 'AND'|'OR', filters: [...]}.",
          additionalProperties: true,
        },
        pagination: {
          type: "object",
          description: "Optional pagination parameters.",
          properties: {
            per_page: { type: "number" },
            starting_after: { type: "string" },
          },
        },
      },
      required: ["query"],
    },
  },
  {
    name: "conversation_reply",
    description: "Reply to a conversation as an admin, user, or contact.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation to reply to.",
        },
        message_type: {
          type: "string",
          enum: ["comment", "note"],
          description: "The type of reply — a comment or an internal note.",
        },
        type: {
          type: "string",
          enum: ["admin", "user", "contact"],
          description: "Who is sending the reply.",
        },
        body: {
          type: "string",
          description: "The reply message body.",
        },
        admin_id: {
          type: "number",
          description: "Required when type is 'admin'. The admin's Intercom ID.",
        },
        created_at: {
          type: "number",
          description: "Optional Unix timestamp for the reply.",
        },
        attachment_urls: {
          type: "array",
          items: { type: "string" },
          description: "Optional list of attachment URLs.",
        },
      },
      required: ["conversation_id", "message_type", "type", "body"],
    },
  },
  {
    name: "conversation_manage",
    description:
      "Manage a conversation state: close, open, snooze, or assign it.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation to manage.",
        },
        message_type: {
          type: "string",
          enum: ["close", "open", "snoozed", "assignment"],
          description: "The action to perform on the conversation.",
        },
        admin_id: {
          type: "string",
          description: "The Intercom ID of the admin performing the action.",
        },
        snoozed_until: {
          type: "number",
          description:
            "Required when message_type is 'snoozed'. Unix timestamp for when to unsnooze.",
        },
        assignee_id: {
          type: "string",
          description:
            "Required when message_type is 'assignment'. The ID of the admin or team to assign to.",
        },
        type: {
          type: "string",
          enum: ["admin", "team"],
          description:
            "Required when message_type is 'assignment'. Whether assignee is an admin or team.",
        },
        body: {
          type: "string",
          description: "Optional message body to include with the action.",
        },
      },
      required: ["conversation_id", "message_type", "admin_id"],
    },
  },
  {
    name: "conversation_run_assignment_rules",
    description: "Run assignment rules on a conversation.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation.",
        },
      },
      required: ["conversation_id"],
    },
  },
  {
    name: "conversation_attach_contact",
    description: "Attach a contact to a conversation.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation.",
        },
        customer: {
          type: "object",
          description:
            "The contact to attach. Provide one of: intercom_user_id, user_id, or email.",
          additionalProperties: true,
        },
        admin_id: {
          type: "string",
          description: "Optional admin ID performing the attachment.",
        },
      },
      required: ["conversation_id", "customer"],
    },
  },
  {
    name: "conversation_detach_contact",
    description: "Detach a contact from a conversation.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation.",
        },
        contact_id: {
          type: "string",
          description: "The Intercom ID of the contact to detach.",
        },
      },
      required: ["conversation_id", "contact_id"],
    },
  },
  {
    name: "conversation_redact",
    description: "Redact a conversation part or source.",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["conversation_part", "source"],
          description: "Whether to redact a conversation part or a source.",
        },
        conversation_id: {
          type: "string",
          description: "The ID of the conversation.",
        },
        conversation_part_id: {
          type: "string",
          description:
            "Required when type is 'conversation_part'. The ID of the part to redact.",
        },
        source_id: {
          type: "string",
          description:
            "Required when type is 'source'. The ID of the source to redact.",
        },
      },
      required: ["type", "conversation_id"],
    },
  },
  {
    name: "conversation_convert_to_ticket",
    description: "Convert a conversation into a ticket.",
    inputSchema: {
      type: "object",
      properties: {
        conversation_id: {
          type: "string",
          description: "The ID of the conversation to convert.",
        },
        ticket_type_id: {
          type: "number",
          description: "The ID of the ticket type to create.",
        },
        attributes: {
          type: "object",
          description: "Optional ticket attributes to set on creation.",
          additionalProperties: true,
        },
      },
      required: ["conversation_id", "ticket_type_id"],
    },
  },
];

export async function handleConversationTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "conversation_list":
      return intercomRequest("GET", "/conversations", undefined, {
        per_page: input.per_page as number | undefined,
        starting_after: input.starting_after as string | undefined,
      });

    case "conversation_create": {
      const body: Record<string, unknown> = {
        from: input.from,
        body: input.body,
      };
      if (input.subject !== undefined) body.subject = input.subject;
      if (input.attachment_urls !== undefined)
        body.attachment_urls = input.attachment_urls;
      if (input.created_at !== undefined) body.created_at = input.created_at;
      return intercomRequest("POST", "/conversations", body);
    }

    case "conversation_get":
      return intercomRequest(
        "GET",
        `/conversations/${input.conversation_id}`,
        undefined,
        {
          display_as: input.display_as as string | undefined,
        }
      );

    case "conversation_update": {
      const body: Record<string, unknown> = {};
      if (input.read !== undefined) body.read = input.read;
      if (input.custom_attributes !== undefined)
        body.custom_attributes = input.custom_attributes;
      return intercomRequest(
        "PUT",
        `/conversations/${input.conversation_id}`,
        body
      );
    }

    case "search_conversations": {
      const body: Record<string, unknown> = { query: input.query };
      if (input.pagination !== undefined) body.pagination = input.pagination;
      return intercomRequest("POST", "/conversations/search", body);
    }

    case "conversation_reply": {
      const body: Record<string, unknown> = {
        message_type: input.message_type,
        type: input.type,
        body: input.body,
      };
      if (input.admin_id !== undefined) body.admin_id = input.admin_id;
      if (input.created_at !== undefined) body.created_at = input.created_at;
      if (input.attachment_urls !== undefined)
        body.attachment_urls = input.attachment_urls;
      return intercomRequest(
        "POST",
        `/conversations/${input.conversation_id}/reply`,
        body
      );
    }

    case "conversation_manage": {
      const body: Record<string, unknown> = {
        message_type: input.message_type,
        admin_id: input.admin_id,
      };
      if (input.snoozed_until !== undefined)
        body.snoozed_until = input.snoozed_until;
      if (input.assignee_id !== undefined) body.assignee_id = input.assignee_id;
      if (input.type !== undefined) body.type = input.type;
      if (input.body !== undefined) body.body = input.body;
      return intercomRequest(
        "POST",
        `/conversations/${input.conversation_id}/parts`,
        body
      );
    }

    case "conversation_run_assignment_rules":
      return intercomRequest(
        "POST",
        `/conversations/${input.conversation_id}/run_assignment_rules`
      );

    case "conversation_attach_contact": {
      const body: Record<string, unknown> = {
        customer: input.customer,
      };
      if (input.admin_id !== undefined) body.admin_id = input.admin_id;
      return intercomRequest(
        "POST",
        `/conversations/${input.conversation_id}/customers`,
        body
      );
    }

    case "conversation_detach_contact":
      return intercomRequest(
        "DELETE",
        `/conversations/${input.conversation_id}/customers/${input.contact_id}`
      );

    case "conversation_redact": {
      const body: Record<string, unknown> = {
        type: input.type,
        conversation_id: input.conversation_id,
      };
      if (input.conversation_part_id !== undefined)
        body.conversation_part_id = input.conversation_part_id;
      if (input.source_id !== undefined) body.source_id = input.source_id;
      return intercomRequest("POST", "/conversations/redact", body);
    }

    case "conversation_convert_to_ticket": {
      const body: Record<string, unknown> = {
        ticket_type_id: input.ticket_type_id,
      };
      if (input.attributes !== undefined) body.attributes = input.attributes;
      return intercomRequest(
        "POST",
        `/conversations/${input.conversation_id}/convert`,
        body
      );
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
