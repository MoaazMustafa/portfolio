# Maaz Mustafa - Portfolio

A modern, performant portfolio website built with Next.js 15, TypeScript, and Tailwind CSS v4. Features glassmorphism effects, dark mode support, and responsive design optimized for all devices.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/MoaazMustafa/portfolio.git
cd portfolio
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your database connection string:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/portfolio"
```

4. Set up the database:

```bash
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
```

5. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with theme & fonts
│   ├── page.tsx           # Home page
│   ├── about/             # About page
│   ├── experience/        # Experience page
│   ├── projects/          # Projects page
│   └── contact/           # Contact page
├── components/            # Reusable components
│   ├── navbar.tsx         # Navigation component
│   ├── preloader.tsx      # Loading animation
│   ├── theme-toggle.tsx   # Dark mode toggle
│   ├── disable-devtools.tsx # Production devtools protection
│   ├── sections/          # Page sections
│   │   ├── hero.tsx       # Hero section
│   │   └── coming-soon.tsx # Coming soon placeholder
│   └── ui/                # Base UI components
│       ├── glass-surface.tsx  # Glassmorphism effect (mobile-optimized)
│       ├── button.tsx     # Button component
│       ├── badge.tsx      # Badge component
│       └── Spark.tsx      # Particle effects
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities & configurations
│   ├── utils.ts          # Helper functions (cn, etc.)
│   ├── metadata.ts       # SEO metadata
│   └── prisma.ts         # Prisma client instance
├── styles/               # Global styles
│   └── globals.css       # Tailwind v4 + theme variables
├── types/                # TypeScript definitions
└── prisma/               # Database schema
    └── schema.prisma     # Prisma schema file
```

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and apply database migration
- `npm run db:studio` - Open Prisma Studio for database management

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router & Turbopack
- **Language:** TypeScript with strict mode
- **Styling:** Tailwind CSS v4 (with inline theming)
- **Database:** PostgreSQL with Prisma ORM
- **UI Components:** shadcn/ui (Radix UI primitives)
- **Icons:** Lucide React
- **Fonts:** Geist Sans & Geist Mono
- **Linting:** ESLint (flat config) with Next.js, React, a11y rules
- **Formatting:** Prettier with Tailwind plugin
- **Git Hooks:** Husky + lint-staged for pre-commit quality checks

## ✨ Features

- 🎨 **Glassmorphism UI** - Mobile-optimized SVG-based glass effects
- 🌓 **Dark Mode** - System preference with manual toggle
- 📱 **Fully Responsive** - Optimized for all screen sizes
- ⚡ **Performance** - Built with Turbopack for faster builds
- 🔒 **Production Security** - Devtools disabled in production builds
- 🎯 **SEO Optimized** - Comprehensive metadata configuration
- ♿ **Accessible** - WCAG compliant with proper ARIA labels
- 🗄️ **Database Ready** - Prisma ORM with PostgreSQL support

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a modern font family optimized for interfaces.

## 📚 Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Next.js features and API
- [Tailwind CSS v4](https://tailwindcss.com/blog/tailwindcss-v4-alpha) - Latest Tailwind features
- [Prisma Documentation](https://www.prisma.io/docs) - Database toolkit
- [shadcn/ui](https://ui.shadcn.com) - Re-usable component library

## 🚀 Deployment

This portfolio is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Add your environment variables in project settings
4. Deploy!

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Maaz Mustafa**

- GitHub: [@MoaazMustafa](https://github.com/MoaazMustafa)
- Portfolio: [Your Portfolio URL]
