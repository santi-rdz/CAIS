- When implementing a new feature in the frontend: 1. Check for existing components first
  • Before creating anything new, search in the ui (or shared components) directory.
  • If a component already solves the problem (fully or partially), reuse it.
  • Prefer composition over duplication. 2. Avoid code duplication
  • Do not rewrite similar logic or UI that already exists.
  • Extract reusable pieces into shared components if needed. 3. Create modular structure
  • If no suitable component exists, create new components in the appropriate folders.
  • Separate concerns clearly:
  • UI components (presentation)
  • Hooks / logic
  • Services / API calls 4. Keep components small and focused
  • Each component should have a single responsibility.
  • Avoid large, monolithic components. 5. Follow project conventions
  • Respect existing folder structure, naming, and patterns.
  • Keep consistency with the current codebase. 6. Scalability over quick fixes
  • Do not implement quick, hardcoded solutions.
  • Think about reusability and future features. 7. Clean code principles
  • Use clear naming
  • Avoid deeply nested logic
  • Keep functions short and readable
- When implementing responsive design use the desktop first approach, NOT MOBILE FIRST
