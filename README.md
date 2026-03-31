<!-- README-AI-SIGNATURE:20260331024807 -->
# portfolio

Welcome to the portfolio repository of Moaaz Mustafa. This project showcases a personal portfolio built with TypeScript and Next.js, designed to highlight skills, projects, and experiences in a visually appealing manner. The application is structured to be easily maintainable and scalable, leveraging modern web technologies.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

## ✨ Key Features

### 🎨 Modern Design
- Utilizes Tailwind CSS for responsive and customizable styling.
- Incorporates animations using GSAP and Framer Motion for a dynamic user experience.

### 🔒 Secure Authentication
- Implements NextAuth.js for secure user authentication.
- Supports Google OAuth for easy sign-in options.

### 📊 Data Management
- Uses Prisma as an ORM for seamless database interactions.
- Configured for PostgreSQL, ensuring robust data handling.

## 🏗️ Project Structure

```
portfolio/
├── .github/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── Resume.pdf
├── src/
│   ├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   └── styles/
├── .env.example
├── package.json
└── README.md
```

## 🚀 Getting Started

To get started with the portfolio project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/MoaazMustafa/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.

4. Run the development server:
   ```
   npm run dev
   ```

## 📜 Scripts

The following scripts are available for managing the project:

- **Development**: `npm run dev` - Starts the development server.
- **Build**: `npm run build` - Builds the application for production.
- **Start**: `npm run start` - Starts the production server.
- **Lint**: `npm run lint` - Lints the codebase using ESLint.
- **Format**: `npm run format` - Formats the code using Prettier.
- **Type Check**: `npm run type-check` - Checks TypeScript types without emitting files.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or want to report issues, please open an issue or submit a pull request. Ensure that your code adheres to the project's coding standards and passes all tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
