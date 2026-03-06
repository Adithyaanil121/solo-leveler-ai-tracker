# Solo Leveler - Frontend

This is the frontend web application for **Solo Leveler**, a Gamified Personal Development tracker inspired by the *Solo Leveling* aesthetic. It provides a sleek, dynamic, and interactive user experience to help users track their skills, check their percentiles, and get AI-driven career coaching.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [React 19](https://react.dev/) / TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with custom CSS properties for dynamic glassmorphism and premium UI effects
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **AI Integration**: [@google/genai](https://www.npmjs.com/package/@google/genai) for the AI Career Coach integration
- **Data Visualization**: [Recharts](https://recharts.org/) & D3

## Folder Structure

```text
frontend/
├── public/             # Static assets (fonts, imagery, etc.)
├── src/
│   ├── app/            # Next.js app directory (Route handlers, page layouts, /api/coach)
│   ├── features/       # Feature-specific modules (onboarding, skills, coach widget)
│   └── shared/         # Shared global state, utilities, hooks, and UI components
├── .env                # Local environment variables
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+) and npm installed.

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Environment Variables**
   Create a `.env` file in this directory with the following content:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Development Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Starts the built production server.
- `npm run lint`: Runs ESLint for code formatting and analysis.
