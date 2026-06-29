# DuelApp

A real-time coding duel platform where users can challenge each other to solve coding problems head-to-head.

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **UI:** [React](https://react.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Routing:** [TanStack Router](https://tanstack.com/router)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed

### Installation

```bash
bun install
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
│   ├── ui/          # shadcn/ui components
│   └── TopNav.tsx   # Navigation bar
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── routes/          # TanStack Router file-based routes
├── router.tsx       # Router configuration
├── start.ts         # App entry point
└── styles.css       # Global styles
```

## License

MIT
