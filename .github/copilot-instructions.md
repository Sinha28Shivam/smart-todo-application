# Smart Todo Application - AI Coding Agent Instructions

## Architecture Overview

**Full-stack AI-powered task management** with Next.js frontend, Fastify backend, MongoDB storage, and Ollama (LLaMA 3.2) for AI suggestions.

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS → `http://localhost:3000`
- **Backend**: Fastify + JWT auth → `http://localhost:5000`
- **Database**: MongoDB via Mongoose
- **AI Service**: Ollama running in Docker → `http://localhost:11434`

### Data Flow
1. Frontend sends JWT-authenticated requests to backend
2. Backend validates JWT, processes business logic
3. Task CRUD operations interact with MongoDB
4. AI priority/status suggestions route through backend to Ollama
5. AI provides **suggestions only** - never auto-modifies tasks

## Key Conventions

### Backend (Fastify)
- **Route registration pattern**: See [server.js](backend/src/server.js) - all routes use Fastify plugins with `prefix` option
- **Authentication**: Custom `fastify.authenticate` decorator in [app.js](backend/src/app.js#L20) - JWT verified via preHandler hook
- **Controllers return directly**: No explicit `reply.send()` needed unless setting status codes
- **Module system**: ESM (`"type": "module"` in package.json) - use `.js` extensions in imports

Example controller pattern from [task.controller.js](backend/src/controllers/task.controller.js#L22-L24):
```javascript
export async function getAllTasks(request){
    return await Task.find({ userId: request.user.id }); // Implicit reply.send()
}
```

### Frontend (Next.js App Router)
- **All components are client-side**: Use `"use client"` directive (no SSR currently)
- **API wrapper**: [api.js](frontend/src/services/api.js) handles JWT injection, 401 auto-logout
- **Auth utilities**: [auth.js](frontend/src/utils/auth.js) manages localStorage tokens
- **Never call `fetch()` directly** - always use `ApiRequest()` from [api.js](frontend/src/services/api.js)

### Accessibility (WCAG 2.1 AA)
- **Semantic HTML**: Use `<main>`, `<section>`, `<article>` over generic divs
- **ARIA live regions**: Announce dynamic updates with `aria-live="polite"` (see [dashboard/page.jsx](frontend/src/app/dashboard/page.jsx#L58-L62))
- **Button state**: Use `aria-pressed` for toggle buttons (filters)
- **Icons need labels**: All Lucide icons must have `aria-label` or `aria-hidden="true"` if decorative
- Full guidelines in [ACCESSIBILITY.md](ACCESSIBILITY.md)

### AI Integration
- **Prompt structure**: See [ai.controller.js](backend/src/controllers/ai.controller.js#L5-L7) - always request JSON format
- **Response parsing**: Extract JSON from Ollama's text response using regex: `/\{[\s\S]*\}/`
- **Error handling**: AI failures return 500 with `{ success: false }` - frontend should degrade gracefully
- **Model**: `llama3.2:3b` running at `http://localhost:11434/api/generate`

## Development Workflows

### Running the Application
```bash
# Backend (from /backend)
npm run dev  # Starts nodemon on src/server.js

# Frontend (from /frontend)  
npm run dev  # Next.js on port 3000

# AI Service (Docker must be running)
# Ollama should be running: docker run -d -p 11434:11434 ollama/ollama
```

### Environment Variables
Backend requires `.env` in `/backend`:
```
PORT=5000
MONGO_URI=mongodb://...
JWT_SECRET=your_secret_key
```

### Database Schema
- **Task model** ([task.model.js](backend/src/models/task.model.js)):
  - Status: `"pending" | "in-progress" | "completed"`
  - Priority: `"low" | "medium" | "high"`
  - Always includes `userId` reference for multi-tenancy

### Common Patterns

**Creating authenticated routes**:
```javascript
// In route file
export async function myRoutes(fastify){
    fastify.addHook("preHandler", fastify.authenticate); // Applies to all routes
    fastify.get('/endpoint', myController);
}
```

**Task filtering** ([task.controller.js](backend/src/controllers/task.controller.js#L53-L76)):
- Query params: `?status=pending&priority=high&sortBy=dueDate&from=2026-01-01&to=2026-12-31`
- Always validate against `ALLOWED_STATUS` and `ALLOWED_PRIORITY` constants
- Date range uses MongoDB `$gte`/`$lte` operators

**Frontend state management**:
- Use `useState` + `useEffect` for data fetching
- Include live region updates for screen reader announcements
- Example: [dashboard/page.jsx](frontend/src/app/dashboard/page.jsx#L16-L18) - `setAnnouncement()` for status changes

## File Organization

- **Backend controllers**: One export per operation (createTask, updateTask, etc.)
- **Frontend services**: [task.service.js](frontend/src/services/task.service.js) wraps all task APIs
- **Reusable components**: [StateCard.jsx](frontend/src/components/StateCard.jsx), [FilterBar.jsx](frontend/src/components/FilterBar.jsx)
- **Route structure**: App router pages in `src/app/[route]/page.jsx`

## Testing & Validation
- No automated tests currently configured
- Manual accessibility testing documented in [ACCESSIBILITY_TESTING.md](ACCESSIBILITY_TESTING.md)
- Validate AI responses: Always check for JSON format in Ollama output before parsing

## Important Notes
- JWT tokens stored in localStorage (client-side only)
- CORS configured to allow all origins (`origin: '*'`) - tighten for production
- AI suggestions are advisory - user must explicitly apply them
- Task deletion requires confirmation prompt
- All dates stored as ISO strings, parsed to Date objects in MongoDB
