import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const contactTools: Tool[] = [
  {
    name: "contact_list",
    description: "List all contacts in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        page: { type: "number", description: "Page number." },
        per_page: { type: "number", description: "Number of results per page." },
        starting_after: { type: "string", description: "Cursor for pagination (from previous response)." },
      },
      required: [],
    },
  },
  {
    name: "contact_create",
    description: "Create a new contact (user or lead). At least one of email, external_id, or role is recommended.",
    inputSchema: {
      type: "object",
      properties: {
        role: { type: "string", enum: ["user", "lead"], description: "The role of the contact." },
        email: { type: "string", description: "The email address of the contact." },
        external_id: { type: "string", description: "A unique identifier for the contact in your own system." },
        phone: { type: "string", description: "The phone number of the contact." },
        name: { type: "string", description: "The full name of the contact." },
        avatar: { type: "string", description: "URL of the contact's avatar image." },
        signed_up_at: { type: "number", description: "Unix timestamp when the contact signed up." },
        last_seen_at: { type: "number", description: "Unix timestamp when the contact was last seen." },
        owner_id: { type: "number", description: "The ID of the admin who owns the contact." },
        unsubscribed_from_emails: { type: "boolean", description: "Whether the contact is unsubscribed from emails." },
        custom_attributes: { type: "object", description: "Custom attributes for the contact." },
      },
      required: [],
    },
  },
  {
    name: "contact_get",
    description: "Retrieve a specific contact by ID.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_update",
    description: "Update an existing contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        role: { type: "string", enum: ["user", "lead"], description: "The role of the contact." },
        email: { type: "string", description: "The email address of the contact." },
        external_id: { type: "string", description: "A unique identifier for the contact in your own system." },
        phone: { type: "string", description: "The phone number of the contact." },
        name: { type: "string", description: "The full name of the contact." },
        avatar: { type: "string", description: "URL of the contact's avatar image." },
        signed_up_at: { type: "number", description: "Unix timestamp when the contact signed up." },
        last_seen_at: { type: "number", description: "Unix timestamp when the contact was last seen." },
        owner_id: { type: "number", description: "The ID of the admin who owns the contact." },
        unsubscribed_from_emails: { type: "boolean", description: "Whether the contact is unsubscribed from emails." },
        custom_attributes: { type: "object", description: "Custom attributes for the contact." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_delete",
    description: "Delete a contact by ID.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact to delete." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_archive",
    description: "Archive a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact to archive." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_unarchive",
    description: "Unarchive a previously archived contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact to unarchive." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "merge_contacts",
    description: "Merge a lead contact into a user contact.",
    inputSchema: {
      type: "object",
      properties: {
        from: { type: "string", description: "The contact ID of the lead to merge from." },
        into: { type: "string", description: "The contact ID of the user to merge into." },
      },
      required: ["from", "into"],
    },
  },
  {
    name: "search_contacts",
    description: "Search contacts using a filter query. Supports single filters ({field, operator, value}) and compound filters ({operator: 'AND'|'OR', filters: [...]}).",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "object",
          description: "Filter query. Either a single filter object {field, operator, value} or a compound filter {operator: 'AND'|'OR', filters: [...]}.",
        },
        pagination: {
          type: "object",
          description: "Pagination options.",
          properties: {
            per_page: { type: "number", description: "Number of results per page." },
            starting_after: { type: "string", description: "Cursor for pagination." },
          },
        },
      },
      required: ["query"],
    },
  },
  {
    name: "contact_list_notes",
    description: "List all notes for a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        page: { type: "number", description: "Page number." },
        per_page: { type: "number", description: "Number of results per page." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_create_note",
    description: "Create a note on a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        body: { type: "string", description: "The text content of the note." },
        admin_id: { type: "number", description: "The ID of the admin creating the note." },
      },
      required: ["contact_id", "body"],
    },
  },
  {
    name: "contact_list_tags",
    description: "List all tags attached to a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_attach_tag",
    description: "Attach a tag to a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        id: { type: "string", description: "The ID of the tag to attach." },
      },
      required: ["contact_id", "id"],
    },
  },
  {
    name: "contact_detach_tag",
    description: "Remove a tag from a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        tag_id: { type: "string", description: "The ID of the tag to remove." },
      },
      required: ["contact_id", "tag_id"],
    },
  },
  {
    name: "contact_list_subscriptions",
    description: "List all subscription types for a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "contact_attach_subscription",
    description: "Attach a subscription type to a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        id: { type: "string", description: "The ID of the subscription type to attach." },
        consent_type: { type: "string", enum: ["opt_in", "opt_out"], description: "The consent type for the subscription." },
      },
      required: ["contact_id", "id", "consent_type"],
    },
  },
  {
    name: "contact_detach_subscription",
    description: "Remove a subscription type from a contact.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: { type: "string", description: "The unique identifier of the contact." },
        subscription_id: { type: "string", description: "The ID of the subscription to remove." },
      },
      required: ["contact_id", "subscription_id"],
    },
  },
];

export async function handleContactTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "contact_list":
      return intercomRequest("GET", "/contacts", undefined, {
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
        starting_after: input.starting_after as string | undefined,
      });

    case "contact_create": {
      const body: Record<string, unknown> = {};
      if (input.role !== undefined) body.role = input.role;
      if (input.email !== undefined) body.email = input.email;
      if (input.external_id !== undefined) body.external_id = input.external_id;
      if (input.phone !== undefined) body.phone = input.phone;
      if (input.name !== undefined) body.name = input.name;
      if (input.avatar !== undefined) body.avatar = input.avatar;
      if (input.signed_up_at !== undefined) body.signed_up_at = input.signed_up_at;
      if (input.last_seen_at !== undefined) body.last_seen_at = input.last_seen_at;
      if (input.owner_id !== undefined) body.owner_id = input.owner_id;
      if (input.unsubscribed_from_emails !== undefined) body.unsubscribed_from_emails = input.unsubscribed_from_emails;
      if (input.custom_attributes !== undefined) body.custom_attributes = input.custom_attributes;
      return intercomRequest("POST", "/contacts", body);
    }

    case "contact_get":
      return intercomRequest("GET", `/contacts/${input.contact_id}`);

    case "contact_update": {
      const body: Record<string, unknown> = {};
      if (input.role !== undefined) body.role = input.role;
      if (input.email !== undefined) body.email = input.email;
      if (input.external_id !== undefined) body.external_id = input.external_id;
      if (input.phone !== undefined) body.phone = input.phone;
      if (input.name !== undefined) body.name = input.name;
      if (input.avatar !== undefined) body.avatar = input.avatar;
      if (input.signed_up_at !== undefined) body.signed_up_at = input.signed_up_at;
      if (input.last_seen_at !== undefined) body.last_seen_at = input.last_seen_at;
      if (input.owner_id !== undefined) body.owner_id = input.owner_id;
      if (input.unsubscribed_from_emails !== undefined) body.unsubscribed_from_emails = input.unsubscribed_from_emails;
      if (input.custom_attributes !== undefined) body.custom_attributes = input.custom_attributes;
      return intercomRequest("PUT", `/contacts/${input.contact_id}`, body);
    }

    case "contact_delete":
      return intercomRequest("DELETE", `/contacts/${input.contact_id}`);

    case "contact_archive":
      return intercomRequest("POST", `/contacts/${input.contact_id}/archive`);

    case "contact_unarchive":
      return intercomRequest("POST", `/contacts/${input.contact_id}/unarchive`);

    case "merge_contacts":
      return intercomRequest("POST", "/contacts/merge", {
        from: input.from,
        into: input.into,
      });

    case "search_contacts": {
      const body: Record<string, unknown> = {
        query: input.query,
      };
      if (input.pagination !== undefined) body.pagination = input.pagination;
      return intercomRequest("POST", "/contacts/search", body);
    }

    case "contact_list_notes":
      return intercomRequest("GET", `/contacts/${input.contact_id}/notes`, undefined, {
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "contact_create_note": {
      const body: Record<string, unknown> = { body: input.body };
      if (input.admin_id !== undefined) body.admin_id = input.admin_id;
      return intercomRequest("POST", `/contacts/${input.contact_id}/notes`, body);
    }

    case "contact_list_tags":
      return intercomRequest("GET", `/contacts/${input.contact_id}/tags`);

    case "contact_attach_tag":
      return intercomRequest("POST", `/contacts/${input.contact_id}/tags`, { id: input.id });

    case "contact_detach_tag":
      return intercomRequest("DELETE", `/contacts/${input.contact_id}/tags/${input.tag_id}`);

    case "contact_list_subscriptions":
      return intercomRequest("GET", `/contacts/${input.contact_id}/subscriptions`);

    case "contact_attach_subscription":
      return intercomRequest("POST", `/contacts/${input.contact_id}/subscriptions`, {
        id: input.id,
        consent_type: input.consent_type,
      });

    case "contact_detach_subscription":
      return intercomRequest("DELETE", `/contacts/${input.contact_id}/subscriptions/${input.subscription_id}`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
