# Maaz Mustafa - Portfolio & Admin Dashboard

A comprehensive portfolio platform built with the latest web technologies. This project features a high-performance public frontend and a powerful admin dashboard for managing content, projects, and media.

![Next.js 15](https://img.shields.io/badge/Next.js_15-black?style=flat&logo=next.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-blue?style=flat&logo=react&logoColor=white)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_fv4-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat&logo=postgresql&logoColor=white)

## ✨ Key Features

### 🎨 Modern Frontend

- **Glassmorphism Design**: Sleek, modern UI with depth and transparency effects.
- **Fluid Animations**: Powered by Framer Motion and GSAP for immersive interactions.
- **Theme System**: Full Dark/Light mode support with custom color themes.
- **Responsive**: Mobile-first design optimized for all devices.

### 🛠️ Powerful Admin Dashboard

- **Project Management**: CRUD operations for portfolio projects with rich text editing.
- **Tech Stack Management**: Manage technologies and categorize them.
- **Blog System**: Built-in Markdown editor for creating and publishing posts.
- **User Management**: Role-based access control and invitation system.
- **Media Library**: Integrated Cloudinary media manager for uploading and organizing assets.
- **Settings**: Customizable dashboard preferences and profile settings.

### 🔒 Security & Performance

- **Secure Authentication**: NextAuth.js (v5 beta compatible) integration with Google OAuth.
- **Access Control**: Whitelist-based email access for the dashboard.
- **Server Actions**: Type-safe data mutations using Next.js Server Actions.
- **Image Optimization**: Cloudinary integration for automatic image resizing and format delivery.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public facing pages (Home, Gallery, etc.)
│   ├── dashboard/         # Protected Admin Dashboard
│   │   ├── projects/      # Project management
│   │   ├── posts/         # Blog post management
│   │   ├── media/         # Media library
│   │   ├── users/         # User management
│   │   └── settings/      # Admin settings
│   ├── api/               # API endpoint handlers
│   └── auth/              # Authentication pages
├── components/            # React Components
│   ├── dashboard/         # Dashboard-specific components
│   ├── sections/          # Landing page sections (Hero, About, etc.)
│   ├── ui/                # Reusable UI components (shadcn/ui based)
│   └── ...
├── lib/                   # Core Logic & Utilities
│   ├── actions/           # Server Actions (Data mutations)
│   ├── validations/       # Zod schemas for form validation
│   └── ...
└── prisma/                # Database Schema & Migrations
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL Database
- Cloudinary Account
- Google Cloud Console Project (for OAuth)

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/MoaazMustafa/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment:**
   Copy the example environment file and fill in your credentials.

   ```bash
   cp .env.example .env.local
   ```

   _See `.env.example` for required variables._

4. **Initialize Database:**

   ```bash
   npm run db:generate   # Generate Prisma client
   npm run db:push       # Push schema to database
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📜 Scripts

- `npm run dev`: Start development server with Turbopack.
- `npm run build`: Build for production.
- `npm run start`: Start production server.
- `npm run type-check`: Run TypeScript validation.
- `npm run lint`: Lint code with ESLint.
- `npm run format`: Format code with Prettier.
- `npm run db:studio`: Open Prisma Studio to view database data.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

## 📄 License

This project is licensed under the MIT License.


<!-- ACTIVITY:START -->
## 📋 Recent Activity

| Date | Commit | Message | Author |
|------|--------|---------|--------|
| 2026-03-29 | [`6e41487`](https://github.com/MoaazMustafa/portfolio/commit/6e414872625c8846d4afd438e57582f7fbf8beb2) | feat: add TechStack component to showcase technology expertise | @MoaazMustafa |
| 2026-03-29 | [`3ffb063`](https://github.com/MoaazMustafa/portfolio/commit/3ffb063ff921636f901d458eaacd781c009604e4) | feat: enhance layout with parallax background and update scroll behavior | @MoaazMustafa |
| 2026-03-29 | [`28434b7`](https://github.com/MoaazMustafa/portfolio/commit/28434b7241d35ed30e632eb88f4824399b771f75) | refactor: replace CardContainer with div for BentoCard component | @MoaazMustafa |
| 2026-03-29 | [`d4712ab`](https://github.com/MoaazMustafa/portfolio/commit/d4712abf2815cd24222bdcf6a0295d015e811819) | Merge branch 'main' of https://github.com/MoaazMustafa/portfolio | @MoaazMustafa |
| 2026-03-29 | [`2e46e6a`](https://github.com/MoaazMustafa/portfolio/commit/2e46e6a753013574fc1956c42b3f96b675199ff4) | fix: correct preloader check logic in SmoothScrollProvider | @MoaazMustafa |
| 2026-03-29 | [`1c50dea`](https://github.com/MoaazMustafa/portfolio/commit/1c50deadbc51aa0f0cccc96e39c9f0ee3df8e6b5) | feat: implement smooth scrolling with Lenis and add parallax effect support | @MoaazMustafa |

*Last updated: 2026-03-30 02:54 UTC*
<!-- ACTIVITY:END -->
