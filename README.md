<!-- README-AI-SIGNATURE:20260403024914 -->
# portfolio

Welcome to the portfolio repository of Moaaz Mustafa. This project showcases a personal portfolio built with TypeScript and Next.js, designed to highlight skills, projects, and experiences in a visually appealing manner. The application is structured to provide a seamless user experience while leveraging modern web technologies.

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white) ![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)

## ✨ Key Features

### 🎨 Modern Design
- Utilizes Tailwind CSS for responsive and customizable styling.
- Incorporates animations and transitions for an engaging user experience.

### 🔒 Secure Authentication
- Implements NextAuth.js for secure user authentication.
- Supports Google OAuth for easy sign-in options.

### 📊 Dynamic Content
- Integrates Prisma for database management, allowing for dynamic content updates.
- Utilizes Cloudinary for efficient media storage and management.

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

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please fork the repository and submit a pull request. Ensure that your code adheres to the project's coding standards and includes appropriate tests.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
