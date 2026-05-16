<!-- README-AI-SIGNATURE:20260516000000 -->
# Maaz Mustafa Portfolio

Personal portfolio built with modern web tooling to showcase projects, skills, and experience.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma&logoColor=white)

## Highlights

- Next.js App Router architecture with TypeScript strict mode
- Tailwind CSS v4 design system with reusable UI components
- Prisma + PostgreSQL integration for structured data
- Authentication with NextAuth.js
- Rich UI interactions and animations

## Project Structure

```text
src/
├── app/
├── components/
├── hooks/
├── lib/
├── styles/
└── types/

prisma/
├── migrations/
└── schema.prisma
```

## Getting Started

```bash
git clone https://github.com/MoaazMustafa/portfolio.git
cd portfolio
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` — Start dev server (Turbopack)
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Lint and auto-fix
- `npm run lint:check` — Lint without auto-fix
- `npm run format` — Format code
- `npm run format:check` — Check formatting
- `npm run type-check` — Run TypeScript checks
- `npm run db:generate` — Generate Prisma client

## Contributing

Pull requests are welcome. Please run lint, format, and type-check locally before submitting changes.

## License

Licensed under the [MIT License](LICENSE).
