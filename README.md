# Solo Leveler

## Overview

**Solo Leveler** is a modern web application inspired by the *Solo Leveling* aesthetic, designed to help users track and level up their personal skills and achievements. The project combines a sleek, dynamic UI with a robust frontend built using Next.js, React, and Tailwind CSS, delivering a premium, glassmorphism‑styled experience.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Development](#development)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Dynamic Skill Cards** – Visualize skill progress with animated progress bars, level badges, and detailed subskills.
- **AI Career Coach** – True LLM integration powered by Google's Gemini API (`gemini-2.5-flash`). Have dynamic conversations, receive personalized competency evaluations, career path suggestions, and practice tasks based on industry trends.
- **Percentile Tracking** – Calculate your skill mastery and view how you compare to the top and average practitioners in your field. Auto-recalculates upon skill addition or deletion.
- **Add‑Skill Modal** – Seamlessly add new skills with AI‑assisted initial difficulty and mastery estimates.
- **Glassmorphism UI** – Modern, premium look with subtle micro‑animations and smooth hover effects powered by Framer Motion.
- **Responsive Design** – Optimized for desktop and mobile viewports.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16 + React 19 (TypeScript) |
| **Styling** | Tailwind CSS v4, Vanilla CSS Custom Properties |
| **Animations** | Framer Motion |
| **State Management** | Zustand |
| **AI Integration** | `@google/genai` (Gemini API) |
| **Build** | Turbopack (`npm run dev`) |

---

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/solo-leveler.git
   cd solo-leveler
   ```
2. **Setup environment variables**
   Create a `.env` file inside the `frontend/` directory and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```
4. **Start the development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

---

## Development

- **Running locally** – Use `npm run dev` in the `frontend` folder.
- **Building for production** –
  ```bash
  npm run build
  ```
  The application will be compiled into the `.next/` directory.
- **Deploying** – You can start the production server with:
  ```bash
  npm run start
  ```
- **Linting** – Run standard checks via:
  ```bash
  npm run lint
  ```

---

## Usage

1. Open the app in your browser.
2. Complete the onboarding to define your age and vocation (these help the AI Coach tailor its advice).
3. Click **"+ Add Skill"** to create a new skill entry. The app provides AI‑generated difficulty and mastery stats based on your prompt description.
4. Interact with the **AI Career Analyst** widget on the right sidebar. Ask it to explain your ratings, suggest what you should learn next based on market trends, or generate practice tasks!
5. Delete skills by clicking a skill card to expand it and hitting the trash icon; percentiles will instantly recalculate.

---

## Project Structure

```text
solo-leveler/
├─ AGENTS.md            # Agent instructions & 3-layer architecture guide
├─ CLAUDE.md            # Alias for Agent instructions
├─ GEMINI.md            # Alias for Agent instructions
├─ directives/          # Layer 1: SOPs and Markdown instructions for agents
├─ execution/           # Layer 3: Deterministic Python scripts/tools for agents
├─ .tmp/                # Intermediate files and temporary data processing
├─ docs/                # Project documentation and architecture details
│  └─ architecture.md   # Architectural structure and logic flow
└─ frontend/            # Web application interface (Next.js)
   ├─ .env              # Environment variables and API keys
   ├─ package.json
   ├─ public/           # Static assets
   └─ src/
      ├─ app/           # Next.js App Router (pages and API routes)
      │  ├─ api/coach/  # Gemini AI backend API route
      │  └─ layout.tsx, page.tsx
      ├─ features/      # Feature-based component modules (coach, skills, charts)
      └─ shared/        # Shared logic, store (Zustand), types
```

### Application Flow
1. **User Interface** 
2. **Next.js App Router**
3. **State Management (Zustand)**
4. **Feature Modules**
5. **AI Career Coach API**
6. **Gemini AI Response**

For an extended look, please check the [Architecture Overview](docs/architecture.md).

---

## AI Agent Architecture

This project incorporates a 3-layer architecture designed for autonomous AI operations alongside the frontend application:
- **Layer 1: Directive (What to do)** - Located in `directives/`. Defines goals, inputs, tools to use, and edge cases in natural language Markdown.
- **Layer 2: Orchestration (Decision making)** - Powered by LLMs (Claude/Gemini) that act upon instructions spanning `AGENTS.md`. Reads directives and plans execution steps.
- **Layer 3: Execution (Doing the work)** - Located in `execution/`. Small, deterministic scripts (usually Python) to perform API calls, file modification, and run background tasks reliably.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome-feature`).
3. Commit your changes with clear messages.
4. Open a Pull Request describing the changes.

Make sure your code adheres to the existing style guidelines and passes linting.

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
