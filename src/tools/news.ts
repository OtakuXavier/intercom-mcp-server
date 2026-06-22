import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const newsTools: Tool[] = [
  {
    name: "news_list_items",
    description: "List all news items in the workspace.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "news_create_item",
    description: "Create a new news item.",
    inputSchema: {
      type: "object",
      properties: {
        title: {
          type: "string",
          description: "The title of the news item.",
        },
        sender_id: {
          type: "number",
          description: "The ID of the admin who is the sender of the news item.",
        },
        body: {
          type: "string",
          description: "The HTML body content of the news item.",
        },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "The state of the news item.",
        },
        deliver_silently: {
          type: "boolean",
          description: "If true, the news item will not trigger a notification.",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Labels to categorize the news item.",
        },
        reactions: {
          type: "array",
          items: { type: "string" },
          description: "Emoji reactions to enable on the news item.",
        },
        newsfeed_assignments: {
          type: "array",
          items: { type: "object", additionalProperties: true },
          description: "Newsfeed assignments for the news item.",
        },
      },
      required: ["title", "sender_id"],
    },
  },
  {
    name: "news_get_item",
    description: "Retrieve a specific news item by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        news_item_id: {
          type: "string",
          description: "The ID of the news item.",
        },
      },
      required: ["news_item_id"],
    },
  },
  {
    name: "news_update_item",
    description: "Update an existing news item.",
    inputSchema: {
      type: "object",
      properties: {
        news_item_id: {
          type: "string",
          description: "The ID of the news item to update.",
        },
        title: {
          type: "string",
          description: "The title of the news item.",
        },
        sender_id: {
          type: "number",
          description: "The ID of the admin who is the sender of the news item.",
        },
        body: {
          type: "string",
          description: "The HTML body content of the news item.",
        },
        state: {
          type: "string",
          enum: ["draft", "live"],
          description: "The state of the news item.",
        },
        deliver_silently: {
          type: "boolean",
          description: "If true, the news item will not trigger a notification.",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Labels to categorize the news item.",
        },
        reactions: {
          type: "array",
          items: { type: "string" },
          description: "Emoji reactions to enable on the news item.",
        },
        newsfeed_assignments: {
          type: "array",
          items: { type: "object", additionalProperties: true },
          description: "Newsfeed assignments for the news item.",
        },
      },
      required: ["news_item_id"],
    },
  },
  {
    name: "news_delete_item",
    description: "Delete a news item by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        news_item_id: {
          type: "string",
          description: "The ID of the news item to delete.",
        },
      },
      required: ["news_item_id"],
    },
  },
  {
    name: "news_list_newsfeeds",
    description: "List all newsfeeds in the workspace.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "news_get_newsfeed",
    description: "Retrieve a specific newsfeed by its ID.",
    inputSchema: {
      type: "object",
      properties: {
        newsfeed_id: {
          type: "string",
          description: "The ID of the newsfeed.",
        },
      },
      required: ["newsfeed_id"],
    },
  },
  {
    name: "news_list_newsfeed_items",
    description: "List all news items in a specific newsfeed.",
    inputSchema: {
      type: "object",
      properties: {
        newsfeed_id: {
          type: "string",
          description: "The ID of the newsfeed.",
        },
      },
      required: ["newsfeed_id"],
    },
  },
];

export async function handleNewsTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "news_list_items":
      return intercomRequest("GET", "/news/news_items");

    case "news_create_item": {
      const body: Record<string, unknown> = {
        title: input.title,
        sender_id: input.sender_id,
      };
      if (input.body !== undefined) body.body = input.body;
      if (input.state !== undefined) body.state = input.state;
      if (input.deliver_silently !== undefined) body.deliver_silently = input.deliver_silently;
      if (input.labels !== undefined) body.labels = input.labels;
      if (input.reactions !== undefined) body.reactions = input.reactions;
      if (input.newsfeed_assignments !== undefined) body.newsfeed_assignments = input.newsfeed_assignments;
      return intercomRequest("POST", "/news/news_items", body);
    }

    case "news_get_item":
      return intercomRequest("GET", `/news/news_items/${input.news_item_id}`);

    case "news_update_item": {
      const body: Record<string, unknown> = {};
      if (input.title !== undefined) body.title = input.title;
      if (input.sender_id !== undefined) body.sender_id = input.sender_id;
      if (input.body !== undefined) body.body = input.body;
      if (input.state !== undefined) body.state = input.state;
      if (input.deliver_silently !== undefined) body.deliver_silently = input.deliver_silently;
      if (input.labels !== undefined) body.labels = input.labels;
      if (input.reactions !== undefined) body.reactions = input.reactions;
      if (input.newsfeed_assignments !== undefined) body.newsfeed_assignments = input.newsfeed_assignments;
      return intercomRequest("PUT", `/news/news_items/${input.news_item_id}`, body);
    }

    case "news_delete_item":
      return intercomRequest("DELETE", `/news/news_items/${input.news_item_id}`);

    case "news_list_newsfeeds":
      return intercomRequest("GET", "/news/newsfeeds");

    case "news_get_newsfeed":
      return intercomRequest("GET", `/news/newsfeeds/${input.newsfeed_id}`);

    case "news_list_newsfeed_items":
      return intercomRequest("GET", `/news/newsfeeds/${input.newsfeed_id}/items`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
