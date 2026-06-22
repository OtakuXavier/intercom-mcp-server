import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const companyTools: Tool[] = [
  {
    name: "company_list",
    description: "List companies, optionally filtered by name, company_id, tag, or segment.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Filter by company name.",
        },
        company_id: {
          type: "string",
          description: "Filter by your external company ID.",
        },
        tag_id: {
          type: "string",
          description: "Filter by tag ID.",
        },
        segment_id: {
          type: "string",
          description: "Filter by segment ID.",
        },
        page: {
          type: "number",
          description: "Page number for pagination.",
        },
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
      },
      required: [],
    },
  },
  {
    name: "company_create_or_update",
    description: "Create or update a company. If a company with the given company_id exists it will be updated; otherwise a new one is created.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "The name of the company.",
        },
        company_id: {
          type: "string",
          description: "Your external ID for the company.",
        },
        plan: {
          type: "string",
          description: "The name of the plan the company is on.",
        },
        size: {
          type: "number",
          description: "The number of employees in the company.",
        },
        website: {
          type: "string",
          description: "The URL of the company's website.",
        },
        industry: {
          type: "string",
          description: "The industry the company operates in.",
        },
        custom_attributes: {
          type: "object",
          description: "Custom attributes for the company.",
          additionalProperties: true,
        },
        remote_created_at: {
          type: "number",
          description: "Unix timestamp of when the company was created remotely.",
        },
        monthly_spend: {
          type: "number",
          description: "Monthly spend of the company.",
        },
      },
      required: [],
    },
  },
  {
    name: "company_get",
    description: "Retrieve a specific company by its Intercom internal ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The Intercom internal ID of the company.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "company_update",
    description: "Update an existing company by its Intercom internal ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The Intercom internal ID of the company.",
        },
        name: {
          type: "string",
          description: "The name of the company.",
        },
        company_id: {
          type: "string",
          description: "Your external ID for the company.",
        },
        plan: {
          type: "string",
          description: "The name of the plan the company is on.",
        },
        size: {
          type: "number",
          description: "The number of employees in the company.",
        },
        website: {
          type: "string",
          description: "The URL of the company's website.",
        },
        industry: {
          type: "string",
          description: "The industry the company operates in.",
        },
        custom_attributes: {
          type: "object",
          description: "Custom attributes for the company.",
          additionalProperties: true,
        },
        remote_created_at: {
          type: "number",
          description: "Unix timestamp of when the company was created remotely.",
        },
        monthly_spend: {
          type: "number",
          description: "Monthly spend of the company.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "company_delete",
    description: "Delete a company by its Intercom internal ID.",
    inputSchema: {
      type: "object",
      properties: {
        id: {
          type: "string",
          description: "The Intercom internal ID of the company to delete.",
        },
      },
      required: ["id"],
    },
  },
  {
    name: "company_list_all",
    description: "List all companies using a POST request with optional pagination and ordering.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "Page number for pagination.",
        },
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
        order: {
          type: "string",
          enum: ["asc", "desc"],
          description: "Sort order for results.",
        },
      },
      required: [],
    },
  },
  {
    name: "company_scroll",
    description: "Scroll through all companies using a cursor-based pagination approach.",
    inputSchema: {
      type: "object",
      properties: {
        scroll_param: {
          type: "string",
          description: "The scroll cursor returned from a previous scroll request.",
        },
      },
      required: [],
    },
  },
  {
    name: "company_list_contacts",
    description: "List contacts (users/leads) that belong to a specific company.",
    inputSchema: {
      type: "object",
      properties: {
        company_id: {
          type: "string",
          description: "The Intercom internal ID of the company.",
        },
        page: {
          type: "number",
          description: "Page number for pagination.",
        },
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
      },
      required: ["company_id"],
    },
  },
  {
    name: "company_list_segments",
    description: "List segments that a specific company belongs to.",
    inputSchema: {
      type: "object",
      properties: {
        company_id: {
          type: "string",
          description: "The Intercom internal ID of the company.",
        },
      },
      required: ["company_id"],
    },
  },
  {
    name: "attach_contact_to_company",
    description: "Attach a contact to a company.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: {
          type: "string",
          description: "The Intercom internal ID of the contact.",
        },
        id: {
          type: "string",
          description: "The Intercom internal ID of the company to attach the contact to.",
        },
      },
      required: ["contact_id", "id"],
    },
  },
  {
    name: "list_contact_companies",
    description: "List all companies that a contact belongs to.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: {
          type: "string",
          description: "The Intercom internal ID of the contact.",
        },
        page: {
          type: "number",
          description: "Page number for pagination.",
        },
        per_page: {
          type: "number",
          description: "Number of results per page.",
        },
      },
      required: ["contact_id"],
    },
  },
  {
    name: "detach_contact_from_company",
    description: "Detach a contact from a company.",
    inputSchema: {
      type: "object",
      properties: {
        contact_id: {
          type: "string",
          description: "The Intercom internal ID of the contact.",
        },
        company_id: {
          type: "string",
          description: "The Intercom internal ID of the company.",
        },
      },
      required: ["contact_id", "company_id"],
    },
  },
];

export async function handleCompanyTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "company_list":
      return intercomRequest("GET", "/companies", undefined, {
        name: input.name as string | undefined,
        company_id: input.company_id as string | undefined,
        tag_id: input.tag_id as string | undefined,
        segment_id: input.segment_id as string | undefined,
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "company_create_or_update": {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.company_id !== undefined) body.company_id = input.company_id;
      if (input.plan !== undefined) body.plan = input.plan;
      if (input.size !== undefined) body.size = input.size;
      if (input.website !== undefined) body.website = input.website;
      if (input.industry !== undefined) body.industry = input.industry;
      if (input.custom_attributes !== undefined) body.custom_attributes = input.custom_attributes;
      if (input.remote_created_at !== undefined) body.remote_created_at = input.remote_created_at;
      if (input.monthly_spend !== undefined) body.monthly_spend = input.monthly_spend;
      return intercomRequest("POST", "/companies", body);
    }

    case "company_get":
      return intercomRequest("GET", `/companies/${input.id}`);

    case "company_update": {
      const body: Record<string, unknown> = {};
      if (input.name !== undefined) body.name = input.name;
      if (input.company_id !== undefined) body.company_id = input.company_id;
      if (input.plan !== undefined) body.plan = input.plan;
      if (input.size !== undefined) body.size = input.size;
      if (input.website !== undefined) body.website = input.website;
      if (input.industry !== undefined) body.industry = input.industry;
      if (input.custom_attributes !== undefined) body.custom_attributes = input.custom_attributes;
      if (input.remote_created_at !== undefined) body.remote_created_at = input.remote_created_at;
      if (input.monthly_spend !== undefined) body.monthly_spend = input.monthly_spend;
      return intercomRequest("PUT", `/companies/${input.id}`, body);
    }

    case "company_delete":
      return intercomRequest("DELETE", `/companies/${input.id}`);

    case "company_list_all": {
      const body: Record<string, unknown> = {};
      if (input.page !== undefined) body.page = input.page;
      if (input.per_page !== undefined) body.per_page = input.per_page;
      if (input.order !== undefined) body.order = input.order;
      return intercomRequest("POST", "/companies/list", body);
    }

    case "company_scroll":
      return intercomRequest("GET", "/companies/scroll", undefined, {
        scroll_param: input.scroll_param as string | undefined,
      });

    case "company_list_contacts":
      return intercomRequest(
        "GET",
        `/companies/${input.company_id}/contacts`,
        undefined,
        {
          page: input.page as number | undefined,
          per_page: input.per_page as number | undefined,
        }
      );

    case "company_list_segments":
      return intercomRequest("GET", `/companies/${input.company_id}/segments`);

    case "attach_contact_to_company":
      return intercomRequest("POST", `/contacts/${input.contact_id}/companies`, {
        id: input.id,
      });

    case "list_contact_companies":
      return intercomRequest(
        "GET",
        `/contacts/${input.contact_id}/companies`,
        undefined,
        {
          page: input.page as number | undefined,
          per_page: input.per_page as number | undefined,
        }
      );

    case "detach_contact_from_company":
      return intercomRequest(
        "DELETE",
        `/contacts/${input.contact_id}/companies/${input.company_id}`
      );

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
