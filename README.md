<div align="center">

# 🎨 Studio Space — Client

**A modern, fast and beautifully designed web experience for Studio Space.**
Built with Next.js, React, TypeScript and Tailwind CSS.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-black?style=for-the-badge&logo=vercel&logoColor=white)](https://studio-space-client-two.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-Secure-6366F1?style=flat-square)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

[Live Demo](https://studio-space-client-two.vercel.app) · [Report a Bug](https://github.com/abirhosen30/studio-space-client/issues) · [Request a Feature](https://github.com/abirhosen30/studio-space-client/issues)

</div>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Author](#-author)

---

## ✨ About the Project

**Studio Space Client** is the front-end application of the Studio Space platform. It is built on the latest **Next.js App Router** with **React 19**, fully typed with **TypeScript**, and styled with **Tailwind CSS v4** and **shadcn/ui** components for a clean, accessible and responsive interface.

Authentication is handled securely with **Better Auth** and persisted in **MongoDB**, giving users a smooth and safe sign-in experience.

> 🔗 **Live site:** [studio-space-client-two.vercel.app](https://studio-space-client-two.vercel.app)

---

## 🚀 Features

- ⚡ **Blazing-fast performance** — Next.js App Router, server components and the React Compiler
- 🔐 **Secure authentication** — powered by Better Auth with a MongoDB adapter
- 🎨 **Beautiful, accessible UI** — shadcn/ui and Base UI components with Lucide icons
- 🌗 **Responsive design** — looks great on mobile, tablet and desktop
- 📅 **Date & calendar tools** — date picker built with `react-day-picker` and `date-fns`
- 🖼️ **Smooth carousels** — touch-friendly sliders using Embla Carousel
- 📊 **Data visualisation** — interactive charts with Recharts
- 🔎 **Command palette & OTP inputs** — via `cmdk` and `input-otp`
- ✨ **Polished motion** — subtle animations with `tw-animate-css`
- 🧩 **Type-safe codebase** — TypeScript and ESLint throughout

---

## 🛠️ Tech Stack

| Category        | Technologies                                                    |
| --------------- | --------------------------------------------------------------- |
| **Framework**   | [Next.js 16](https://nextjs.org/) (App Router)                  |
| **Library**     | [React 19](https://react.dev/) with React Compiler              |
| **Language**    | [TypeScript](https://www.typescriptlang.org/)                   |
| **Styling**     | [Tailwind CSS v4](https://tailwindcss.com/), `tw-animate-css`   |
| **UI**          | [shadcn/ui](https://ui.shadcn.com/), Base UI, Lucide, React Icons |
| **Auth**        | [Better Auth](https://www.better-auth.com/)                     |
| **Database**    | [MongoDB](https://www.mongodb.com/)                             |
| **Charts**      | [Recharts](https://recharts.org/)                               |
| **Carousel**    | [Embla Carousel](https://www.embla-carousel.com/)               |
| **Code Blocks** | [Shiki](https://shiki.style/)                                   |
| **Linting**     | ESLint 9                                                        |
| **Deployment**  | [Vercel](https://vercel.com/)                                   |

---

## 📁 Project Structure

```bash
studio-space-client/
├── public/              # Static assets (images, icons, fonts)
├── src/                 # Application source code
├── AGENTS.md            # Guidelines for AI coding agents
├── components.json      # shadcn/ui configuration
├── eslint.config.mjs    # ESLint configuration
├── next.config.ts       # Next.js configuration
├── package.json         # Dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) **18.18+** (Node 20+ recommended)
- A package manager: `npm`, `yarn`, `pnpm` or `bun`
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/abirhosen30/studio-space-client.git
cd studio-space-client
```

**2. Install dependencies**

```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the project root (see [Environment Variables](#-environment-variables)).

**4. Start the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app. 🎉

---

## 🔑 Environment Variables

Create a `.env.local` file and add the values below. Adjust the names to match your own configuration.

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Better Auth
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
```

> ⚠️ Never commit your `.env.local` file. It is already ignored by `.gitignore`.

---

## 📜 Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the development server         |
| `npm run build` | Create an optimised production build |
| `npm run start` | Run the production server            |
| `npm run lint`  | Lint the codebase with ESLint        |

---

## ☁️ Deployment

The easiest way to deploy this app is with [Vercel](https://vercel.com/):

1. Push your code to GitHub.
2. Import the repository on [Vercel](https://vercel.com/new).
3. Add your environment variables in **Project Settings → Environment Variables**.
4. Click **Deploy** — done! 🚀

The production build is live at **[studio-space-client-two.vercel.app](https://studio-space-client-two.vercel.app)**.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m "Add some amazing feature"`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 👤 Author

**Abir Hosen**

- GitHub: [@abirhosen30](https://github.com/abirhosen30)

---

<div align="center">

⭐ If you like this project, please consider giving it a star! ⭐

Made with ❤️ using Next.js

</div>
