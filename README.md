# intercom-mcp-server

MCP server for the [Intercom REST API](https://developers.intercom.com/docs) (v2.11).

**102 tools** covering every Intercom resource:

| Module | Tools |
|--------|-------|
| Admins | 5 |
| Articles | 6 |
| Companies | 12 |
| Contacts | 17 |
| Conversations | 12 |
| Data Attributes | 3 |
| Data Events | 3 |
| Help Center | 7 |
| Messages | 1 |
| News | 8 |
| Segments | 3 |
| Tags | 9 |
| Teams | 2 |
| Tickets | 11 |
| Visitors | 3 |

## Setup

The server has three modes, in priority order:

---

### Option A: Proxy mode (no credentials needed)

If you already use the official Intercom MCP (`mcp.intercom.com`) via `mcp-remote` in Claude Code, this server will automatically proxy through that existing authenticated session. No tokens, no developer app required — just a regular Intercom workspace account.

Add **both** to `~/.claude.json`:

```json
{
  "mcpServers": {
    "intercom": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.intercom.com/mcp"]
    },
    "intercom-local": {
      "command": "node",
      "args": ["/path/to/intercom-mcp-server/dist/index.js"]
    }
  }
}
```

When `intercom-local` starts with no token set, it detects this and connects to `mcp.intercom.com` as a sub-process, reusing the `mcp-remote` session that is already authenticated. `mcp-remote` will prompt for browser login on first use.

---

### Option B: Direct access token

If you have a workspace access token (from Intercom Settings → Developers → Access tokens):

```json
{
  "mcpServers": {
    "intercom-local": {
      "command": "node",
      "args": ["/path/to/intercom-mcp-server/dist/index.js"],
      "env": {
        "INTERCOM_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

---

### Option C: OAuth app

If you have an Intercom developer account and want to register your own OAuth app, set `INTERCOM_CLIENT_ID` and `INTERCOM_CLIENT_SECRET`, then call the `auth_start` tool. It opens a local callback server, redirects your browser through Intercom's OAuth consent screen, and stores the token at `~/.intercom-mcp/token.json`.

---

### Build from source

```bash
git clone <repo>
cd intercom-mcp-server
npm install   # also runs tsc
```

## Tools reference

### Auth (OAuth)
- `auth_start` — Begin OAuth login; returns a browser URL to open
- `auth_status` — Check if a token is stored and which source it came from
- `auth_logout` — Remove the stored token

### Admins
- `admin_identify` — Get the current authenticated admin
- `admin_list` — List all admins
- `admin_get` — Get a specific admin
- `admin_set_away` — Set away mode for an admin
- `admin_list_activity_logs` — List admin activity logs

### Articles
- `article_list` — List all articles
- `article_create` — Create an article
- `article_get` — Get an article
- `article_update` — Update an article
- `article_delete` — Delete an article
- `article_search` — Search articles by phrase

### Companies
- `company_list` — List/filter companies
- `company_create_or_update` — Create or update a company
- `company_get` — Get a company by Intercom ID
- `company_update` — Update a company
- `company_delete` — Delete a company
- `company_list_all` — List all companies (paginated POST)
- `company_scroll` — Scroll through all companies
- `company_list_contacts` — List contacts for a company
- `company_list_segments` — List segments for a company
- `attach_contact_to_company` — Attach a contact to a company
- `list_contact_companies` — List companies for a contact
- `detach_contact_from_company` — Detach a contact from a company

### Contacts
- `contact_list` — List all contacts
- `contact_create` — Create a contact
- `contact_get` — Get a contact
- `contact_update` — Update a contact
- `contact_delete` — Delete a contact
- `contact_archive` / `contact_unarchive` — Archive/unarchive a contact
- `merge_contacts` — Merge two contacts
- `search_contacts` — Search contacts with filters
- `contact_list_notes` / `contact_create_note` — Notes
- `contact_list_tags` / `contact_attach_tag` / `contact_detach_tag` — Tags
- `contact_list_subscriptions` / `contact_attach_subscription` / `contact_detach_subscription` — Subscriptions

### Conversations
- `conversation_list` — List conversations
- `conversation_create` — Start a conversation
- `conversation_get` — Get a conversation
- `conversation_update` — Update a conversation
- `search_conversations` — Search conversations
- `conversation_reply` — Reply to a conversation
- `conversation_manage` — Close, open, snooze, or assign a conversation
- `conversation_run_assignment_rules` — Run assignment rules
- `conversation_attach_contact` / `conversation_detach_contact` — Manage contacts
- `conversation_redact` — Redact a part or source
- `conversation_convert_to_ticket` — Convert to a ticket

### Data Attributes
- `data_attribute_list` — List data attributes
- `data_attribute_create` — Create a data attribute
- `data_attribute_update` — Update a data attribute

### Data Events
- `data_event_list` — List events for a user
- `data_event_create` — Track an event
- `data_event_summaries` — Submit event summaries

### Help Center
- `help_center_list` / `help_center_get` — Help centers
- `collection_list` / `collection_create` / `collection_get` / `collection_update` / `collection_delete` — Collections

### Messages
- `create_message` — Send an email or in-app message

### News
- `news_list_items` / `news_create_item` / `news_get_item` / `news_update_item` / `news_delete_item` — News items
- `news_list_newsfeeds` / `news_get_newsfeed` / `news_list_newsfeed_items` — Newsfeeds

### Segments
- `segment_list` — List segments
- `segment_get` — Get a segment
- `segment_list_for_contact` — List segments for a contact

### Tags
- `tag_list` / `tag_get` / `tag_create_or_update` / `tag_delete` — Tag CRUD
- `tag_companies` — Tag companies
- `tag_conversation` / `tag_detach_conversation` — Tag conversations
- `tag_ticket` / `tag_detach_ticket` — Tag tickets

### Teams
- `team_list` — List teams
- `team_get` — Get a team

### Tickets
- `ticket_create` / `ticket_get` / `ticket_update` / `ticket_search` / `ticket_reply` — Tickets
- `ticket_type_list` / `ticket_type_create` / `ticket_type_get` / `ticket_type_update` — Ticket types
- `ticket_type_attribute_create` / `ticket_type_attribute_update` — Ticket type attributes

### Visitors
- `visitor_get` — Get a visitor
- `visitor_update` — Update a visitor
- `visitor_convert` — Convert a visitor to lead or user
