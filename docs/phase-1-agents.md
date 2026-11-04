# Reusable Phase 1 agents

Project-scoped definitions live in `.codex/agents/`. These files save reusable role instructions, not the transcripts or runtime state of previous subagents. Each TOML file has a name, description, and developer instructions. Models and permissions inherit from the parent session.

| Agent name | Responsibility |
| --- | --- |
| `project_lead` | Scope, planning, delegation, handoffs, final review |
| `content_researcher` | Genuine source copy, metadata, images, provenance |
| `ui_ux_designer` | Visual direction, responsive layout and interaction specifications |
| `nextjs_developer` | Next.js implementation, reusable components, content adapter |
| `qa_tester` | Playwright checks, screenshot review, defects and verification |

Example request:

> Use the Phase 1 agents to refine the homepage. Have content_researcher verify source content and ui_ux_designer review the design, then have nextjs_developer implement the agreed changes and qa_tester verify them. Coordinate as project_lead and stay within the homepage scope.

For a narrow task:

> Use qa_tester to review the homepage at mobile and desktop widths and report defects without changing application code.

The main chat may fulfill the lead role. Stage the specialists within the runtime's concurrency limit rather than launching every role simultaneously. Saving these files does not start any agents or change the current runtime's available tools. If an already-open client does not discover a new definition, start a new chat in this project and refer to its agent name.

All roles preserve the client's live site as the content source of truth and use Study 05 only as visual inspiration. Homepage-only review remains the current scope until the user requests inner pages. Phase 1 excludes CMS integration and requires explicit approval for production publishing.

Format reference: [Official custom-agent documentation](https://learn.chatgpt.com/docs/agent-configuration/subagents#custom-agents).
