# 🧠 Brainwave — The All-in-One AI SaaS Platform

_(formerly AI Forge)_

Brainwave is a full-stack AI Software-as-a-Service platform built as a capstone project.  
It solves the problem of fragmented AI tools by unifying **AI Chat**, **Code Generation**, **Media Generation**, and **Prompt Optimization** into one seamless, modern interface.

Built with **Next.js**, **Firebase**, and **Tailwind CSS**, the platform delivers a secure, fast, and responsive user experience with a polished UI.

---

## 🚀 Project Preview

A clean, responsive, dark-mode-ready interface featuring:

- Authentication
- Dashboard
- Code Generation
- Image Analyzer
- Chat System
- Profile & Settings
- Image & Music Generation (Demo Mode)

---

## ✨ Core Features

### 💬 AI Chat

- Real-time intelligent conversations
- Chat history saved to the user’s account

### 💻 Code Generation

- AI-assisted multi-language code generation
- Syntax-highlighted output

### 🎨 Image Generation

- Generate images from text prompts

### 🎵 Music Generation

- Create music tracks via AI prompt

### 🖼️ Image Analyzer

- Upload an image and ask contextual questions

### 🔧 Prompt Optimizer

- Improve your prompts for better AI results

### 🔐 Authentication

- Secure login with Firebase Auth
- Email/Password & Google Sign-In

### 🗂️ Firestore History

- Saved chats, code, images, and prompts
- Fully revisitable

### 🌓 Light/Dark Mode

- System-aware theme switching

---

## 🛠️ Tech Stack

| Area           | Technology                  |
| -------------- | --------------------------- |
| Framework      | **Next.js (React 19)**      |
| Styling        | **Tailwind CSS**            |
| UI Components  | **shadcn/ui**               |
| Backend        | **Next.js API Routes**      |
| Auth           | **Firebase Authentication** |
| Database       | **Cloud Firestore**         |
| State Mgmt     | **React Context (useAuth)** |
| Animations     | **Framer Motion**, Lottie   |
| Icons & Toasts | **Lucide**, **Sonner**      |

---

## 🧪 Demo Mode (frontend-demo Branch)

This repository includes a special **presentation-ready demo branch**.

### 🌟 What’s Included

- New **Image Generation** & **Music Generation** pages
- Fully functional UI, navigation, auth, and history

### 🚫 What’s Disabled

- All external API calls (Chat, Code, Image Gen, Music Gen, etc.)
- “Generate” buttons show:
  > **This feature will be coming soon!**

This allows you to present the full UX without needing backend/API keys.

---

## 🚀 Getting Started (Demo Version)

Follow these steps to run the `frontend-demo` branch locally.

---

### 1️⃣ Prerequisites

Make sure you have installed:

- **Git**
- **Node.js v20+**
- **npm**

---

### 2️⃣ Clone & Check Out Demo Branch

```bash
# Clone repository
git clone https://github.com/sanket-pilane/ai-forge.git

# Enter project directory
cd ai-forge

# Fetch all branches
git fetch

# Switch to the demo branch
git checkout frontend-demo
```

---

### 3️⃣ Set Up Environment Variables

Create a file named **`.env.local`** in the project root:

```bash
touch .env.local
```

Open the file and add your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

> ⚠️ Even in demo mode, Firebase credentials are required for login & registration.

---

### 4️⃣ Install & Run the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser at:

👉 **http://localhost:3000**

You’ll now see the full demo version of Brainwave running locally.

---

## 📌 Notes

- Demo branch is UI-only; no real API generation.
- Main branch (if available) contains live API logic.
- Ideal for portfolio demos, presentations, and showcasing UX.

---

## 🖤 Thanks for Checking Out Brainwave

If you like this project, consider ⭐ starring the repo and giving feedback!
