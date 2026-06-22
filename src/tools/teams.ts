import { Tool } from "@modelcontextprotocol/sdk/types.js";
import { intercomRequest } from "../client.js";

export const teamTools: Tool[] = [
  {
    name: "team_list",
    description: "List all teams in the workspace.",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "team_get",
    description: "Retrieve a specific team by ID.",
    inputSchema: {
      type: "object",
      properties: {
        team_id: {
          type: "string",
          description: "The unique identifier for the team.",
        },
      },
      required: ["team_id"],
    },
  },
];

export async function handleTeamTool(
  name: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "team_list":
      return intercomRequest("GET", "/teams");

    case "team_get":
      return intercomRequest("GET", `/teams/${input.team_id}`);

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
