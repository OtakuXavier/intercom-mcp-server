import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const articleTools: Tool[] = [
  {
    name: "article_list",
    description: "List all articles in the workspace.",
    inputSchema: {
      type: "object",
      properties: {
        page: {
          type: "number",
          description: "The page of results to fetch.",
        },
        per_page: {
          type: "number",
          description: "The number of results per page.",
        },
      },
      required: [],
    },
  },
  {
    name: "article_create",
    description: "Create a new article.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the article.",
        },
        author_id: {
          type: "number",
          description: "The ID of the admin who authored the article.",
        },
        description: {
          type: "string",
          description: "A summary of the article.",
        },
        body: {
          type: "string",
          description: "The HTML content body of the article.",
        },
        state: {
          type: "string",
          enum: ["published", "draft"],
          description: "The state of the article.",
        },
        parent_id: {
          type: "number",
          description: "The ID of the parent collection or section.",
        },
        parent_type: {
          type: "string",
          enum: ["collection", "section"],
          description: "The type of the parent resource.",
        },
      },
      required: ["title", "author_id"],
    },
  },
  {
    name: "article_get",
    description: "Retrieve a specific article by ID.",
    inputSchema: {
      type: "object",
      properties: {
        article_id: {
          type: "string",
          description: "The unique identifier for the article.",
        },
      },
      required: ["article_id"],
    },
  },
  {
    name: "article_update",
    description: "Update an existing article.",
    inputSchema: {
      type: "object",
      properties: {
        article_id: {
          type: "string",
          description: "The unique identifier for the article.",
        },
        title: {
          type: "string",
          description: "The title of the article.",
        },
        author_id: {
          type: "number",
          description: "The ID of the admin who authored the article.",
        },
        description: {
          type: "string",
          description: "A summary of the article.",
        },
        body: {
          type: "string",
          description: "The HTML content body of the article.",
        },
        state: {
          type: "string",
          enum: ["published", "draft"],
          description: "The state of the article.",
        },
        parent_id: {
          type: "number",
          description: "The ID of the parent collection or section.",
        },
        parent_type: {
          type: "string",
          enum: ["collection", "section"],
          description: "The type of the parent resource.",
        },
      },
      required: ["article_id"],
    },
  },
  {
    name: "article_delete",
    description: "Delete an article by ID.",
    inputSchema: {
      type: "object",
      properties: {
        article_id: {
          type: "string",
          description: "The unique identifier for the article to delete.",
        },
      },
      required: ["article_id"],
    },
  },
  {
    name: "article_search",
    description: "Search articles by phrase and optional filters.",
    inputSchema: {
      type: "object",
      properties: {
        phrase: {
          type: "string",
          description: "The phrase to search for in article content and titles.",
        },
        state: {
          type: "string",
          enum: ["published", "draft", "all"],
          description: "Filter results by article state.",
        },
        help_center_id: {
          type: "number",
          description: "Filter results by help center ID.",
        },
        highlight: {
          type: "boolean",
          description: "Whether to include highlighted excerpts in the response.",
        },
      },
      required: [],
    },
  },
];

export async function handleArticleTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "article_list":
      return intercomRequest("GET", "/articles", undefined, {
        page: input.page as number | undefined,
        per_page: input.per_page as number | undefined,
      });

    case "article_create": {
      const body: Record<string, unknown> = {
        title: input.title,
        author_id: input.author_id,
      };
      if (input.description !== undefined) body.description = input.description;
      if (input.body !== undefined) body.body = input.body;
      if (input.state !== undefined) body.state = input.state;
      if (input.parent_id !== undefined) body.parent_id = input.parent_id;
      if (input.parent_type !== undefined) body.parent_type = input.parent_type;
      return intercomRequest("POST", "/articles", body);
    }

    case "article_get":
      return intercomRequest("GET", `/articles/${input.article_id}`);

    case "article_update": {
      const body: Record<string, unknown> = {};
      if (input.title !== undefined) body.title = input.title;
      if (input.author_id !== undefined) body.author_id = input.author_id;
      if (input.description !== undefined) body.description = input.description;
      if (input.body !== undefined) body.body = input.body;
      if (input.state !== undefined) body.state = input.state;
      if (input.parent_id !== undefined) body.parent_id = input.parent_id;
      if (input.parent_type !== undefined) body.parent_type = input.parent_type;
      return intercomRequest("PUT", `/articles/${input.article_id}`, body);
    }

    case "article_delete":
      return intercomRequest("DELETE", `/articles/${input.article_id}`);

    case "article_search":
      return intercomRequest("GET", "/articles/search", undefined, {
        phrase: input.phrase as string | undefined,
        state: input.state as string | undefined,
        help_center_id: input.help_center_id as number | undefined,
        highlight: input.highlight as boolean | undefined,
      });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
