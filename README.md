# AI Forge 🚀

AI Forge is a comprehensive, all-in-one AI workshop built with Next.js 16 and Google Gemini. It combines powerful generative tools with a curated prompt gallery, allowing users to generate code, chat with AI, analyze images, and optimize prompts—all in a single, beautifully designed interface.

## ✨ Key Features

### 🛠️ Generative Tools

- **🤖 Smart Chat**: A real-time chat interface powered by Gemini 2.5 Flash, supporting Markdown rendering for rich text responses.
- **💻 Code Generator**: Generate production-ready code snippets with syntax highlighting (PrismJS).
- **🖼️ Image Vision Analyzer**: Upload images to get detailed AI analysis and object detection using Gemini's multimodal capabilities.
- **✨ Magic Prompt Optimizer**: Refine simple inputs into professional-grade prompts tailored for specific models (OpenAI, Claude, or Gemini).

### 🎨 Prompt Gallery

- **Curated Collection**: Browse high-quality prompts for Midjourney, DALL-E, and more.
- **Smart Filtering**: Filter by category (Photography, 3D Art, Coding) or AI model.
- **One-Click Actions**: Instantly copy prompts or download reference images.

### 🔐 User System

- **Secure Authentication**: Complete sign-up/login flow using Firebase Auth (Email/Password & Google).
- **Cloud History**: All chats, code snippets, and image analyses are saved to Firestore in real-time.
- **History Management**: Rename, delete, or resume past conversations.
- **User Profile**: Customizable profile with avatar uploading and usage statistics.

## 🧩 Architecture

The application follows a modern, serverless architecture using Next.js App Router and Firebase.

```mermaid
graph TD
    User[User] -->|Auth| AuthPage[Auth Page]
    User -->|Browses| Dashboard[Dashboard Layout]
    
    subgraph Frontend [Next.js App Router]
        Dashboard --> Sidebar[Sidebar Nav]
        
        Sidebar --> ChatPage[Chat Generator]
        Sidebar --> CodePage[Code Generator]
        Sidebar --> ImagePage[Image Analyzer]
        Sidebar --> GalleryPage[Prompt Gallery]
        Sidebar --> OptimizerPage[Prompt Optimizer]
        Sidebar --> HistoryPage[History & Stats]
    end

    subgraph Backend [API Routes]
        ChatAPI[/api/chat]
        CodeAPI[/api/code]
        ImageAPI[/api/image]
        OptimizeAPI[/api/optimize-prompt]
        StatsAPI[/api/user-stats]
    end

    subgraph Services [External Services]
        Firebase[Firebase Auth & Firestore]
        Gemini[Google Gemini API]
    end

    ChatPage -->|POST| ChatAPI
    CodePage -->|POST| CodeAPI
    ImagePage -->|POST| ImageAPI
    OptimizerPage -->|POST| OptimizeAPI
    
    ChatAPI & CodeAPI & ImageAPI -->|Verify Token| Firebase
    ChatAPI & CodeAPI & ImageAPI -->|Generate| Gemini
    
    GalleryPage -->|Reads| LocalData[src/lib/prompt.ts]
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **AI Model**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Backend / DB**: Firebase (Auth, Firestore, Storage, Admin SDK)
- **Styling**: Tailwind CSS 4
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (Radix UI primitives)
- **State Management**: React Hooks & Context API
- **Animations**: Framer Motion & Lottie Files
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- Node.js 18+
- npm, yarn, pnpm, or bun

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/ai-forge.git
cd ai-forge
```

### 2. Install dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory and add your Firebase and Google AI credentials:

```env
# Google Gemini API
GOOGLE_API_KEY=your_gemini_api_key

# Firebase Client Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> **Note**: You will also need a `serviceAccountKey.json` for Firebase Admin SDK if running locally, or set up proper IAM roles.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── (app)/            # Protected application routes (layout with sidebar)
│   │   ├── chat/         # Chat generator page
│   │   ├── code/         # Code generator page
│   │   ├── gallery/      # Prompt gallery
│   │   ├── history/      # User history management
│   │   ├── image/        # Image analysis tool
│   │   ├── optimizer/    # Prompt engineering tool
│   │   └── profile/      # User settings
│   ├── api/              # Server-side API routes (Gemini interactions)
│   └── auth/             # Authentication page
├── components/           # Reusable UI components (Shadcn + Custom)
│   ├── gallery/          # Gallery-specific components
│   └── ui/               # Base UI primitives
├── lib/                  # Utilities, Firebase config, Gemini setup
├── hooks/                # Custom React hooks (useAuth)
└── context/              # Global state providers
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feat/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feat/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ by **Sanket Pilane**.
