import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const ticketTools: Tool[] = [
  {
    name: "ticket_create",
    description: "Create a new ticket.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_type_id: {
          type: "number",
          description: "The ID of the ticket type to create.",
        },
        contacts: {
          type: "array",
          description: "List of contacts associated with the ticket.",
          items: {
            type: "object",
            properties: {
              id: { type: "string", description: "The Intercom contact ID." },
            },
            required: ["id"],
          },
        },
        company_id: {
          type: "string",
          description: "Optional ID of the company associated with the ticket.",
        },
        created_at: {
          type: "number",
          description: "Optional Unix timestamp for when the ticket was created.",
        },
        ticket_attributes: {
          type: "object",
          description:
            "Optional ticket attributes. May include _default_title_, _default_description_, and custom fields.",
          additionalProperties: true,
        },
      },
      required: ["ticket_type_id", "contacts"],
    },
  },
  {
    name: "ticket_get",
    description: "Retrieve a specific ticket by ID.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_id: {
          type: "string",
          description: "The ID of the ticket to retrieve.",
        },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "ticket_update",
    description: "Update a ticket's attributes, state, or assignment.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_id: {
          type: "string",
          description: "The ID of the ticket to update.",
        },
        ticket_attributes: {
          type: "object",
          description: "Ticket attributes to update.",
          additionalProperties: true,
        },
        state: {
          type: "string",
          enum: ["in_progress", "waiting_on_customer", "resolved"],
          description: "The new state for the ticket.",
        },
        open: {
          type: "boolean",
          description: "Whether the ticket is open.",
        },
        is_shared: {
          type: "boolean",
          description: "Whether the ticket is shared with the contact.",
        },
        snoozed_until: {
          type: "number",
          description: "Unix timestamp for when to unsnooze the ticket.",
        },
        assignment: {
          type: "object",
          description: "Assignment details for the ticket.",
          properties: {
            admin_id: {
              type: "string",
              description: "The admin ID performing the assignment.",
            },
            assignee_id: {
              type: "string",
              description: "The ID of the admin or team to assign to.",
            },
          },
        },
      },
      required: ["ticket_id"],
    },
  },
  {
    name: "ticket_search",
    description: "Search tickets using a query filter.",
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
          additionalProperties: true,
        },
      },
      required: ["query"],
    },
  },
  {
    name: "ticket_reply",
    description: "Reply to a ticket as an admin.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_id: {
          type: "string",
          description: "The ID of the ticket to reply to.",
        },
        message_type: {
          type: "string",
          enum: ["comment", "note", "quick_reply"],
          description: "The type of reply.",
        },
        type: {
          type: "string",
          enum: ["admin"],
          description: "Must be 'admin'.",
        },
        admin_id: {
          type: "number",
          description: "The Intercom ID of the admin sending the reply.",
        },
        body: {
          type: "string",
          description: "The reply message body.",
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
        reply_options: {
          type: "array",
          description: "Optional quick reply options.",
          items: {
            type: "object",
            properties: {
              text: { type: "string" },
              uuid: { type: "string" },
            },
          },
        },
        cross_post: {
          type: "boolean",
          description: "Whether to cross-post the reply.",
        },
      },
      required: ["ticket_id", "message_type", "type", "admin_id", "body"],
    },
  },
  {
    name: "ticket_type_list",
    description: "List all ticket types.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "ticket_type_create",
    description: "Create a new ticket type.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the ticket type.",
        },
        description: {
          type: "string",
          description: "A description of the ticket type.",
        },
        category: {
          type: "string",
          enum: ["Customer", "Back-office", "Tracker"],
          description: "The category of the ticket type.",
        },
        icon: {
          type: "string",
          description: "An emoji icon for the ticket type.",
        },
        is_internal: {
          type: "boolean",
          description: "Whether the ticket type is internal only.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "ticket_type_get",
    description: "Retrieve a specific ticket type by ID.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_type_id: {
          type: "string",
          description: "The ID of the ticket type to retrieve.",
        },
      },
      required: ["ticket_type_id"],
    },
  },
  {
    name: "ticket_type_update",
    description: "Update an existing ticket type.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_type_id: {
          type: "string",
          description: "The ID of the ticket type to update.",
        },
        name: {
          type: "string",
          description: "The name of the ticket type.",
        },
        description: {
          type: "string",
          description: "A description of the ticket type.",
        },
        category: {
          type: "string",
          enum: ["Customer", "Back-office", "Tracker"],
          description: "The category of the ticket type.",
        },
        icon: {
          type: "string",
          description: "An emoji icon for the ticket type.",
        },
        archived: {
          type: "boolean",
          description: "Whether to archive the ticket type.",
        },
        is_internal: {
          type: "boolean",
          description: "Whether the ticket type is internal only.",
        },
      },
      required: ["ticket_type_id"],
    },
  },
  {
    name: "ticket_type_attribute_create",
    description: "Create a new attribute for a ticket type.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_type_id: {
          type: "string",
          description: "The ID of the ticket type.",
        },
        name: {
          type: "string",
          description: "The name of the attribute.",
        },
        description: {
          type: "string",
          description: "A description of the attribute.",
        },
        data_type: {
          type: "string",
          enum: ["string", "list", "integer", "decimal", "boolean", "datetime", "files"],
          description: "The data type of the attribute.",
        },
        required_to_create: {
          type: "boolean",
          description: "Whether the attribute is required when creating a ticket.",
        },
        required_to_create_for_contacts: {
          type: "boolean",
          description: "Whether the attribute is required for contacts when creating a ticket.",
        },
        visible_on_create: {
          type: "boolean",
          description: "Whether the attribute is visible during ticket creation.",
        },
        visible_to_contacts: {
          type: "boolean",
          description: "Whether the attribute is visible to contacts.",
        },
        multiline: {
          type: "boolean",
          description: "Whether the attribute supports multiline text.",
        },
        list_items: {
          type: "string",
          description: "Comma-separated list of valid values (for list type attributes).",
        },
        allow_multiple_values: {
          type: "boolean",
          description: "Whether multiple values can be selected (for list type).",
        },
      },
      required: ["ticket_type_id", "name", "description", "data_type"],
    },
  },
  {
    name: "ticket_type_attribute_update",
    description: "Update an existing attribute on a ticket type.",
    inputSchema: {
      type: "object",
      properties: {
        ticket_type_id: {
          type: "string",
          description: "The ID of the ticket type.",
        },
        attribute_id: {
          type: "string",
          description: "The ID of the attribute to update.",
        },
        name: {
          type: "string",
          description: "The name of the attribute.",
        },
        description: {
          type: "string",
          description: "A description of the attribute.",
        },
        data_type: {
          type: "string",
          enum: ["string", "list", "integer", "decimal", "boolean", "datetime", "files"],
          description: "The data type of the attribute.",
        },
        required_to_create: {
          type: "boolean",
          description: "Whether the attribute is required when creating a ticket.",
        },
        required_to_create_for_contacts: {
          type: "boolean",
          description: "Whether the attribute is required for contacts when creating a ticket.",
        },
        visible_on_create: {
          type: "boolean",
          description: "Whether the attribute is visible during ticket creation.",
        },
        visible_to_contacts: {
          type: "boolean",
          description: "Whether the attribute is visible to contacts.",
        },
        multiline: {
          type: "boolean",
          description: "Whether the attribute supports multiline text.",
        },
        list_items: {
          type: "string",
          description: "Comma-separated list of valid values (for list type attributes).",
        },
        allow_multiple_values: {
          type: "boolean",
          description: "Whether multiple values can be selected (for list type).",
        },
        archived: {
          type: "boolean",
          description: "Whether to archive the attribute.",
        },
      },
      required: ["ticket_type_id", "attribute_id"],
    },
  },
];

export async function handleTicketTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "ticket_create": {
      const body: Record<string, unknown> = {
        ticket_type_id: input.ticket_type_id,
        contacts: input.contacts,
      };
      if (input.company_id !== undefined) body.company_id = input.company_id;
      if (input.created_at !== undefined) body.created_at = input.created_at;
      if (input.ticket_attributes !== undefined)
        body.ticket_attributes = input.ticket_attributes;
      return intercomRequest("POST", "/tickets", body);
    }

    case "ticket_get":
      return intercomRequest("GET", `/tickets/${input.ticket_id}`);

    case "ticket_update": {
      const body: Record<string, unknown> = {};
      if (input.ticket_attributes !== undefined)
        body.ticket_attributes = input.ticket_attributes;
      if (input.state !== undefined) body.state = input.state;
      if (input.open !== undefined) body.open = input.open;
      if (input.is_shared !== undefined) body.is_shared = input.is_shared;
      if (input.snoozed_until !== undefined)
        body.snoozed_until = input.snoozed_until;
      if (input.assignment !== undefined) body.assignment = input.assignment;
      return intercomRequest("PUT", `/tickets/${input.ticket_id}`, body);
    }

    case "ticket_search": {
      const body: Record<string, unknown> = { query: input.query };
      if (input.pagination !== undefined) body.pagination = input.pagination;
      return intercomRequest("POST", "/tickets/search", body);
    }

    case "ticket_reply": {
      const body: Record<string, unknown> = {
        message_type: input.message_type,
        type: input.type,
        admin_id: input.admin_id,
        body: input.body,
      };
      if (input.created_at !== undefined) body.created_at = input.created_at;
      if (input.attachment_urls !== undefined)
        body.attachment_urls = input.attachment_urls;
      if (input.reply_options !== undefined)
        body.reply_options = input.reply_options;
      if (input.cross_post !== undefined) body.cross_post = input.cross_post;
      return intercomRequest(
        "POST",
        `/tickets/${input.ticket_id}/reply`,
        body
      );
    }

    case "ticket_type_list":
      return intercomRequest("GET", "/ticket_types");

    case "ticket_type_create": {
      const body: Record<string, unknown> = { name: input.name };
      if (input.description !== undefined) body.description = input.description;
      if (input.category !== undefined) body.category = input.category;
      if (input.icon !== undefined) body.icon = input.icon;
      if (input.is_internal !== undefined) body.is_internal = input.is_internal;
      return intercomRequest("POST", "/ticket_types", body);
    }

    case "ticket_type_get":
      return intercomRequest(
        "GET",
        `/ticket_types/${input.ticket_type_id}`
      );

    case "ticket_type_update": {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.description !== undefined) body.description = input.description;
      if (input.category !== undefined) body.category = input.category;
      if (input.icon !== undefined) body.icon = input.icon;
      if (input.archived !== undefined) body.archived = input.archived;
      if (input.is_internal !== undefined) body.is_internal = input.is_internal;
      return intercomRequest(
        "PUT",
        `/ticket_types/${input.ticket_type_id}`,
        body
      );
    }

    case "ticket_type_attribute_create": {
      const body: Record<string, unknown> = {
        name: input.name,
        description: input.description,
        data_type: input.data_type,
      };
      if (input.required_to_create !== undefined)
        body.required_to_create = input.required_to_create;
      if (input.required_to_create_for_contacts !== undefined)
        body.required_to_create_for_contacts =
          input.required_to_create_for_contacts;
      if (input.visible_on_create !== undefined)
        body.visible_on_create = input.visible_on_create;
      if (input.visible_to_contacts !== undefined)
        body.visible_to_contacts = input.visible_to_contacts;
      if (input.multiline !== undefined) body.multiline = input.multiline;
      if (input.list_items !== undefined) body.list_items = input.list_items;
      if (input.allow_multiple_values !== undefined)
        body.allow_multiple_values = input.allow_multiple_values;
      return intercomRequest(
        "POST",
        `/ticket_types/${input.ticket_type_id}/attributes`,
        body
      );
    }

    case "ticket_type_attribute_update": {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.description !== undefined) body.description = input.description;
      if (input.data_type !== undefined) body.data_type = input.data_type;
      if (input.required_to_create !== undefined)
        body.required_to_create = input.required_to_create;
      if (input.required_to_create_for_contacts !== undefined)
        body.required_to_create_for_contacts =
          input.required_to_create_for_contacts;
      if (input.visible_on_create !== undefined)
        body.visible_on_create = input.visible_on_create;
      if (input.visible_to_contacts !== undefined)
        body.visible_to_contacts = input.visible_to_contacts;
      if (input.multiline !== undefined) body.multiline = input.multiline;
      if (input.list_items !== undefined) body.list_items = input.list_items;
      if (input.allow_multiple_values !== undefined)
        body.allow_multiple_values = input.allow_multiple_values;
      if (input.archived !== undefined) body.archived = input.archived;
      return intercomRequest(
        "PUT",
        `/ticket_types/${input.ticket_type_id}/attributes/${input.attribute_id}`,
        body
      );
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
