# AI_RULES.md

## Project Overview

Project Name: Tetra Frontend V2  
Stack:
- React (Vite)
- JavaScript (No TypeScript)
- Tailwind CSS

Architecture Goal:
- Clean and simple structure
- Maintainable and predictable codebase
- Minimal side effects during development

---

## Folder Structure

```
src/
  api/
  assets/
  components/
  context/
  layouts/
  pages/
```

### Rules:

- `api/` → All API calls and request logic
- `assets/` → Static files (images, icons, etc.)
- `components/` → Reusable UI components
- `context/` → Global state (only when necessary)
- `layouts/` → Layout wrappers (AuthLayout, MainLayout)
- `pages/` → Route-based components

- Do NOT create new top-level folders
- Keep structure flat and predictable

---

## Routing Rules (CRITICAL)

- React Router must be used
- Nested routing is required
- Layout routing must be used

Example:

```
/login
/register
/home
/profile
```

- Protected routes must be implemented
- If user is not authenticated → redirect to login

---

## Auth Rules (CRITICAL)

- Tokens must be stored in localStorage
- Refresh token flow must be implemented
- Access token must be attached to every request

- On 401 response:
  - Try refresh token
  - If refresh fails → logout user

---

## API Layer Rules (CRITICAL)

Structure:

```
api/
  auth.api.js
  post.api.js
```

- Use native fetch (NOT axios)
- All API logic must be inside `api/`
- Do NOT write fetch inside components

- Create reusable request helper if needed

---

## API Integration Rules

Backend response format:

{
  "Success": boolean,
  "StatusCode": number,
  "Message": string,
  "Data": any,
  "Errors": array
}

### Rules:

- Always check `Success` before using `Data`
- If `Success === false` → handle error
- If `Errors` not empty → handle properly
- Do NOT assume `Data` exists

---

## Component Rules

- Split UI into small components
- Avoid large JSX blocks
- Single responsibility per component
- Max ~200 lines per component

---

## UI Stability Rules (CRITICAL)

- Do NOT modify UI when changing functionality
- Do NOT touch styles unless explicitly required
- Do NOT refactor UI structure without instruction
- Visual output must remain identical unless requested

---

## Task Execution Rules (CRITICAL)

- Execute ONLY the given task
- Do NOT modify unrelated files
- Do NOT refactor existing code unless required
- Do NOT add extra features
- Apply minimal changes only

---

## State Management Rules

- Use `useState` for local state
- Use `context/` only when necessary
- Avoid unnecessary global state
- Keep state close to usage

---

## Form Handling Rules

- Use react-hook-form for forms
- Avoid manual useState-heavy form logic
- Validation must be handled inside form logic

---

## Responsive Design Rules (CRITICAL)

- All UI components must be fully responsive
- Mobile-first approach must be followed
- Layout must adapt to different screen sizes (mobile, tablet, desktop)
- Tailwind responsive utilities must be used (sm, md, lg, xl)
- No fixed widths that break responsiveness
- Overflow and layout breaking issues must be avoided
- Components must be tested across common screen sizes

--
## UI/UX Rules

- Use Tailwind classes inline
- Do NOT extract styles unless necessary

---

## Loading Rules (CRITICAL)

- Skeleton loading must be used
- Every async UI must have loading state
- Infinite scroll must be implemented
- Do NOT use "Load More" button

---

## Error Handling UI

- Use Toast notifications
- Errors must be visible to user

---

## Navigation Rules

- Use `Link` for navigation
- Avoid manual URL changes

---

## Code Splitting Rules

- Lazy loading must be used
- Pages must be loaded dynamically

---

## Env Rules

- API base URL must be stored in `.env`
- Do NOT hardcode URLs

---

## Naming Conventions

- Components: PascalCase
- Variables: camelCase
- Functions: camelCase
- Files: kebab-case

---

## JavaScript Rules

- TypeScript is NOT allowed
- Use plain JavaScript only

---

## Code Style Rules

- Code must be clean and readable
- Avoid deep nesting
- Avoid magic numbers
- Avoid unnecessary console logs

---

## AI Behavior Rules (CRITICAL)

- Do ONLY what is requested
- Do NOT refactor unless asked
- Do NOT modify UI or structure
- Do NOT introduce new abstractions
- Follow minimal change principle

---

## Output Rules

- Return only necessary code
- Do NOT include explanations unless requested
- Always include file path:

// src/components/example-component.jsx

---

