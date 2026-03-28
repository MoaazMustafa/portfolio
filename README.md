<!-- README-AI-SIGNATURE:cb7d792524805157 -->
```markdown
# Portfolio

A personal portfolio project built with TypeScript and Next.js.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)

## Key Features

- Built with **TypeScript** for type safety.
- Utilizes **Next.js** for server-side rendering and static site generation.
- Integrated with **Prisma** for database management.
- Supports **Tailwind CSS** for styling.
- Includes **ESLint** and **Prettier** for code quality and formatting.

## Project Structure

```
portfolio/
├── .github/                  # GitHub configurations
├── prisma/                   # Prisma database schema and migrations
├── public/                   # Static assets
├── src/                      # Source code
│   ├── app/                  # Application logic
│   ├── components/           # React components
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # Utility functions
│   ├── styles/               # Global styles
│   └── types/                # Type definitions
├── .env.example              # Environment variable template
├── package.json              # Project metadata and dependencies
└── README.md                 # Project documentation
```

## Getting Started

To get started with this project, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/MoaazMustafa/portfolio.git
   cd portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your values.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Scripts

This project includes the following scripts:

- `dev`: Starts the development server.
- `build`: Builds the application for production.
- `start`: Starts the production server.
- `lint`: Lints the codebase using ESLint.
- `lint:check`: Checks for linting errors without fixing.
- `format`: Formats the code using Prettier.
- `format:check`: Checks code formatting without making changes.
- `type-check`: Checks TypeScript types without emitting output.
- `postinstall`: Generates Prisma client after installation.

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
```
