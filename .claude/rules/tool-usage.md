# Tool Usage Guidelines

Efficient tool selection for common tasks.

## Code Intelligence

| Task                        | Tool             | Why                                         |
| --------------------------- | ---------------- | ------------------------------------------- |
| Find TypeScript type errors | `typescript-lsp` | Real-time diagnostics without running build |
| Find PHP errors/issues      | `php-lsp`        | Static analysis without running tests       |
| Check function signatures   | LSP tools        | Faster than reading entire files            |

## Laravel & Backend

| Task                        | Tool                                      | Why                             |
| --------------------------- | ----------------------------------------- | ------------------------------- |
| Query database              | `laravel-boost` → `database-query`        | Read-only, safe exploration     |
| Debug PHP code              | `laravel-boost` → `tinker`                | Execute PHP in app context      |
| Check routes                | `laravel-boost` → `list-routes`           | Faster than reading route files |
| Find artisan commands       | `laravel-boost` → `list-artisan-commands` | See available options           |
| Search Laravel/package docs | `laravel-boost` → `search-docs`           | Version-specific documentation  |
| Get absolute URLs           | `laravel-boost` → `get-absolute-url`      | Correct scheme/domain/port      |

## Documentation & Context

| Task                   | Tool                    | Why                                |
| ---------------------- | ----------------------- | ---------------------------------- |
| Look up library docs   | `context7`              | External documentation lookup      |
| Understand feature set | `feature-analyst` agent | Maps complete feature architecture |

## Git & GitHub

| Task                | Tool                    | Why                          |
| ------------------- | ----------------------- | ---------------------------- |
| Create commits      | `/commit` skill         | Follows project conventions  |
| Commit + push + PR  | `/commit-push-pr` skill | Full workflow in one command |
| Clean gone branches | `/clean_gone` skill     | Removes stale local branches |
| GitHub operations   | `github` plugin         | PR reviews, issues, etc.     |

## Frontend

| Task                 | Tool                             | Why                                   |
| -------------------- | -------------------------------- | ------------------------------------- |
| Build UI components  | `/frontend-design` skill         | Production-grade, high design quality |
| Check browser errors | `laravel-boost` → `browser-logs` | Debug frontend issues                 |

## Browser Automation

| Task               | Tool                                  | Why                                  |
| ------------------ | ------------------------------------- | ------------------------------------ |
| Navigate to URL    | `browsermcp` → `browser_navigate`     | Direct browser control               |
| Take screenshot    | `browsermcp` → `browser_screenshot`   | Visual verification                  |
| Click elements     | `browsermcp` → `browser_click`        | Interact with page                   |
| Type into fields   | `browsermcp` → `browser_type`         | Form filling                         |
| Get page snapshot  | `browsermcp` → `browser_snapshot`     | Accessibility tree for element refs  |
| Check console logs | `browsermcp` → `browser_console_logs` | Debug JS errors                      |

Use `browser_snapshot` first to get element references, then interact with `browser_click`/`browser_type`.

## Feature Development

| Task                        | Tool                    | Why                                             |
| --------------------------- | ----------------------- | ----------------------------------------------- |
| Guided feature dev          | `/feature-dev` skill    | Structured approach with codebase understanding |
| Understand existing feature | `feature-analyst` agent | Maps files, flows, patterns before changes      |

## General Principles

1. **LSP before grep** - Use language servers for type/error checking instead of searching
2. **Boost before bash** - Use Laravel Boost tools instead of artisan commands when available
3. **Skills for workflows** - Use slash commands for multi-step operations
4. **Agents for exploration** - Use specialized agents for understanding codebase
5. **Docs before guessing** - Search docs with `context7` or `search-docs` before implementing
