# Claude Code Writeup

## What I delegated vs. what I wrote myself

<!-- A few sentences. Be specific — "I had Claude scaffold the express CRUD routes, then I rewrote the validation layer by hand because the version Claude generated didn't match our schema." -->
What I delegated to Claude + Cursor:

I used Claude + Cursor primarily as accelerators — tools to speed up exploration, boilerplate generation, and debugging. Specifically:

1. Architecture comprehension  
They helped me quickly understand the project’s monorepo structure and how the frontend and backend packages interacted.

2. Sample code generation  
I relied on them for examples of POST, PATCH, and GET routes since I hadn’t worked with the newer patterns in Next.js 13+ or Express recently. My recent backend experience has been in FastAPI/Flask.

3. Debugging explanations  
They were useful for interpreting warnings and errors (Next.js hydration issues, ESLint rules, Sequelize errors, etc.) so I could reason about root causes faster.

4. Express architectural patterns for newer frameworks
I used them to explore common patterns like centralized error handling, performance‑tracking middleware, and request validation flows - similar to what I have done for React+FastAPI+Python based Apps in AWS.

What I did myself:

This is the work I personally designed, debugged, and completed:

1. Got the entire project running locally  
Resolved multiple version mismatches, Node upgrades, and dependency issues to bring both the Next.js frontend and Express backend online.

2. Designed the Express backend  
Defined all requirements, implemented the initial GET routes, and built the backend structure.

3. Implemented validation + UI enhancements  
Added Zod validation for all user input, then integrated ShadCN UI to build a modern, responsive user table.

4. Upgraded Tailwind + ShadCN  
Migrated the project to Tailwind v4 and updated ShadCN components, fixing PostCSS and config issues along the way.

5. Built the core business logic  
I handled all business logic — Server side sorting, pagination, CRUD flows, validation, error handling, and backend integration — while using AI for repetitive scaffolding 


## Where Claude led me wrong

<!-- A few sentences. Hallucinated APIs, wrong library versions, plausible-but-incorrect SQL, a fix that masked the real bug, etc. How did you catch it? -->

1. Incorrect assumptions about data structures
Problem: I had passed { success, data } directly into User.create(), so Sequelize received no actual fields and threw null‑constraint errors.
Claude’s solution: Suggested User.create(userData) (passing { success, data }) without understanding the safeParse() return shape.
My fix: Referred Sequelize documentation and used User.create(userData.data) so Sequelize receives real fields.

2. Hallucinated fixes for ts-node / nodemon
Problem: API failed with ts-node: command not found.
Claude’s solution: Reinstall node_modules, delete lock files, reinstall globally, clear caches.
My fix: Installed ts-node (version 10.9.2) inside the API workspace after referring to official documentation.

3. Incorrect Library version recommendations for Tailwind + ShadCN
Problem: My tailwind version was very old (3.2.4) and I had the latest ShadCN version installed. Due to different version
mismatches I was getting a lot of compilation issues and my frontend was not loading correctly.
Claude's solution: It kept recommending different version upgrades for ShadCN and re-install steps, same type of redundant fixes as ts-node.
My fix: I referred to the official documentations for both tailwind and ShadCN to understand their compatible versions. I tried two paths here: A. Keep the Tailwin version to 3.2.4 and downgrade ShadCN which did not work. B. I upgraded both Tailwind and ShadCN to their latest versions. 
Path B worked for me, but I alsi had to upgrade the Tailwind PostCSS version.

3. Wrong Tailwind/PostCSS migration steps
Problem: PostCSS loader crashed due to outdated Tailwind v3 plugin suggestions.
Claude’s solution: Recommended tailwindcss/nesting and other v3-era plugins.
My fix: Updated to Tailwind v4’s correct PostCSS config using @tailwindcss/postcss.

4. Incorrect Shadcn usage patterns
Problem: DOM warnings: <button> cannot appear as a descendant of <button>.
Claude’s solution: Examples with asChild, even after prompting the same error again. It would not correctly point the error even from given stack trace.
My fix: I had to manually go track both UI actions and Console warning simultaneously, inspecting the element layout to understand which component is throwing error. I rewrote triggers using render={} for all ActionButtons:

5. Misleading advice about Next.js hydration
Problem: Table flashed old columns for 2 seconds before updating.
Claude’s solution: Move localStorage reads into useEffect (causes hydration mismatch).
My fix: Used a lazy initializer inside useState to load visibility on first render.


## What I have learned from using AI for projects:

1. AI tools are excellent for exploration, boilerplate, and debugging explanations, but they often hallucinate details when dealing with framework‑specific, version‑specific, or monorepo‑specific setups.
2. I learned to treat AI output as a starting point, not a final answer.
3. I validated every suggestion against: Official docs, actual error logs, my project’s architecture and my own debugging experience
4. We can use AI as a good thinking partner, especially when working with new frameworks - but official documentations are always the best resource to learn best practices.
