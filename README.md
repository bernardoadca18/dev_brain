<p align="center">
  🇺🇸 English | 🇧🇷 <a href="./README.pt-BR.md">Português</a>
</p>

## 🚀 Overview

**Dev Brain** is a productivity and visual organization platform designed for developers and creators. Built around an "infinite canvas" interface, it allows you to structure ideas, manage tasks, and integrate AI into a unified and highly customizable environment.

The project is designed to act as a developer’s "digital brain", replacing linear task lists with a dynamic visual workflow where you can connect notes, level design checklists, media assets, and voice transcriptions into a single interactive graph.

---

## ✨ Core Features

- **Infinite Canvas:** Smooth zoom and pan navigation with no spatial limits  

- **Node Ecosystem:**
  - 📝 **Notes:** Rich text editor for ideas and documentation  
  - ✅ **Tasks:** Checklist management directly on the canvas  
  - 🖼️ **Media:** Support for images, audio, and video  
  - 🎙️ **Speech-to-Text:** Built-in voice transcription  
  - 📁 **Groups:** Logical grouping of related nodes  

- **Integrated AI:** Sidebar chat powered by Google Gemini (`@google/genai`)  

- **Local Persistence:** Data stored using **IndexedDB** and **LocalStorage**  

- **History System:** Undo/Redo with up to 50 states  

- **Customization:** Global hue shifting (accent color control)  

---

## 🛠️ Tech Stack

### Frontend & Frameworks

- **Framework:** Next.js 15+ (App Router)  
- **Language:** TypeScript  
- **State Management:** Zustand  
- **Flow Engine:** @xyflow/react  
- **Styling:** Tailwind CSS & Framer Motion  

### Libraries

- `@google/genai`  
- `@dnd-kit/core`  
- `lucide-react`  
- `idb-keyval`  

---

## 🏗️ Architecture

```
/store
  ├── useCanvasStore.ts
  └── useFileSystemStore.ts

/components/canvas

/hooks
  ├── useKeyboardShortcuts
  └── useAutoSave
```

---

## ⚙️ Setup

### 1. Clone the repository

```bash
git clone https://github.com/seu-usuario/dev-brain.git
cd dev-brain
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

### 4. Run locally

```bash
npm run dev
```

Open in browser:  
http://localhost:3000

---

## ⌨️ Shortcuts

- Ctrl + Z → Undo  
- Ctrl + Y → Redo  
- Backspace / Delete → Remove selected node  
- Double Click → Create a new note  

---

## 📝 License

Private use.
