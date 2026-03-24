# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run setup       # Install deps, generate Prisma client, run migrations
npm run dev         # Start dev server (Turbopack)
npm run build       # Build for production
npm run lint        # Run ESLint
npm test            # Run tests with Vitest
npm run db:reset    # Force reset database
```

Set `ANTHROPIC_API_KEY` in `.env` — without it the app uses a `MockLanguageModel` for demo purposes.

## Architecture

UIGen is an AI-powered React component generator with live preview. Users describe components in natural language; Claude generates them into a **virtual file system** (in-memory, no disk writes) and a live iframe preview updates in real time.

### Request flow

1. User sends message → `ChatInterface` POSTs to `/api/chat/route.ts`
2. API route calls Claude via Vercel AI SDK `streamText` with two tools: `str_replace_editor` and `file_manager`
3. Claude creates/edits virtual files via tool calls; on completion the project is persisted to SQLite as JSON
4. Tool results update `FileSystemProvider` state → `PreviewFrame` detects changes → re-renders iframe
5. `jsx-transformer.ts` converts JSX to executable HTML using Babel standalone + an import map

### Key modules

| Module | Location |
|--------|----------|
| Chat state | `src/lib/contexts/chat-context.tsx` (wraps Vercel AI SDK `useChat`) |
| File system state | `src/lib/contexts/file-system-context.tsx` + `src/lib/file-system.ts` |
| Claude tools | `src/lib/tools/str-replace.ts`, `src/lib/tools/file-manager.ts` |
| JSX → iframe | `src/lib/transform/jsx-transformer.ts` |
| System prompt | `src/lib/prompts/generation.tsx` — instructs Claude to use `/App.jsx` as entry point |
| Auth (JWT) | `src/lib/auth.ts`, `src/actions/` |
| Language model | `src/lib/provider.ts` — returns Anthropic model or `MockLanguageModel` |

### Layout

`MainContent` (`src/app/main-content.tsx`) renders two resizable panels: **Chat** (left, ~35%) and **Preview/Code** (right, ~65%). The code view splits further into a `FileTree` (30%) and Monaco `CodeEditor` (70%).

### Data persistence

- Always consult `prisma/schema.prisma` as the authoritative reference for the database structure.
- Database: SQLite via Prisma (`prisma/dev.db`)
- Schema: `User` (id, email, password) and `Project` (id, name, userId, messages JSON, data JSON)
- Auth: httpOnly JWT cookie, 7-day expiry
- Anonymous users get a session-scoped virtual FS with no DB persistence
