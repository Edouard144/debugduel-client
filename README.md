# BugCombat

A real-time coding duel platform where users can challenge each other to solve coding problems head-to-head. AI judges submissions on correctness, cleanliness, efficiency, and security.

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **UI:** [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Editor:** [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

```bash
bun install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your Google Client ID:

```bash
cp .env.example .env
```

### Development

```bash
bun run dev
```

### Build

```bash
bun run build
```

### Preview

```bash
bun run preview
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run preview` | Preview production build |
| `bun run lint` | Run ESLint |
| `bun run format` | Format code with Prettier |

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── TopNav.tsx       # Navigation bar
│   ├── Footer.tsx       # Site footer
│   └── LoadingSpinner.tsx
├── hooks/               # Custom React hooks
│   ├── use-debounce.ts
│   ├── use-keyboard.ts
│   ├── use-local-storage.ts
│   └── use-mobile.tsx
├── lib/                 # Utilities and helpers
│   ├── auth.ts          # Auth store & API client
│   └── utils.ts         # cn() utility
├── routes/              # TanStack Router file-based routes
│   ├── index.tsx        # Landing page
│   ├── login.tsx        # Sign in
│   ├── register.tsx     # Create account
│   ├── dashboard.tsx    # Dashboard & leaderboard
│   ├── duel.$code.tsx   # Duel arena
│   └── results.$code.tsx # Duel results
├── router.tsx           # Router configuration
├── start.ts             # App entry point
└── styles.css           # Global styles
```

## API

Backend: `https://debugduel-backend.onrender.com`

See full API docs at `/api/docs/` on the backend.

## License

MIT
