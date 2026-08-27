# EventFlow

**Plan less. Organize better. Celebrate more.**

EventFlow is a modern, minimal event management application built to help you plan and manage events with ease. Track tasks, organize work by category, monitor progress, and switch between events — all in a clean, responsive interface with light and dark modes.

![EventFlow preview](https://violet-plans-pro.lovable.app)

## Features

- **Dashboard Overview** — See your current event, overall completion progress, and today's tasks at a glance.
- **Task Management** — Add, edit, complete, and delete tasks for any event.
- **Categories** — Group tasks into Venue, Catering, Guests, Marketing, Logistics, and Budget.
- **Progress Tracking** — Visual progress rings and completion stats keep you motivated.
- **Event Management** — Create and switch between multiple events, each with its own task list.
- **Dark Mode** — Toggle between a calming light theme and a soft dark theme.
- **Responsive Design** — Sidebar navigation on desktop, bottom navigation on mobile.

## Tech Stack

- [TanStack Start](https://tanstack.com/start) — Full-stack React framework
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Tailwind CSS](https://tailwindcss.com/) — Styling
- [Lucide React](https://lucide.dev/) — Icons

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (recommended via [nvm](https://github.com/nvm-sh/nvm))
- A package manager such as `npm` or `bun`

### Installation

```bash
git clone <repository-url>
cd eventflow
npm install
npm run dev
```

The app will be available at `http://localhost:8080`.

## Project Structure

```text
src/
├── components/eventflow/   # App-specific UI components
├── lib/eventflow/          # State management, types, and helpers
├── routes/                 # TanStack Start routes
├── styles.css              # Global theme and Tailwind setup
└── ...
```

## Design

EventFlow uses a calming purple-and-white palette with rounded cards, subtle shadows, and generous whitespace. The dark theme switches to a deep charcoal background with soft purple accents. All color tokens live in `src/styles.css` and are shared by Tailwind utilities.

## License

This project is built with [Lovable](https://lovable.dev). The code is yours to use, modify, and deploy as you see fit.
