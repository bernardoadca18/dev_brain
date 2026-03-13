# 🧠 DevBrain (Visual Project Planner)

![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A visual-first organization and project management tool that merges the **infinite canvas mapping of Obsidian** with the **interactive task management of Trello**. 

Designed to be a "do-it-all" second brain for Game Developers, Software Engineers, and Writers. Whether you are mapping out complex RPG lore, planning software architecture, or tracking sprint tasks, this tool provides a distraction-free, node-based environment to connect all your ideas.

## ✨ Core Features

* **🌌 Infinite Canvas:** A highly performant, zoomable, and pannable infinite grid to lay out your thoughts without borders.
* **📝 Note Nodes:** Markdown-friendly text cards to write lore, document APIs, or jot down quick insights.
* **✅ Interactive Task Nodes:** Trello-style Kanban cards embedded directly in the canvas. Add tasks, check them off, and drag-and-drop to reorder them seamlessly.
* **🔗 Visual Connections:** Draw edges between nodes to map relationships (e.g., linking a character node to a specific level design task).
* **🎨 Obsidian Aesthetic:** A sleek, distraction-free dark mode by default, featuring a customizable dynamic accent color to match your workflow.

## 🚀 Use Cases

* **🎮 Game Development:** Map out complex game lore, create state-machine diagrams for AI, organize level design To-Do's, and gather visual references (sprites/moodboards) in one place.
* **💻 Software Architecture:** Diagram cloud infrastructure, document database models, and link them directly to development sprint tasks.
* **✍️ Worldbuilding & Writing:** Create visual relationship webs for characters, timelines, and locations.

## 🛠️ Tech Stack

* **Framework:** [Next.js 15 (App Router)](https://nextjs.org/)
* **UI Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Canvas Engine:** [React Flow (@xyflow/react)](https://reactflow.dev/)
* **Drag & Drop:** [@dnd-kit/core](https://docs.dndkit.com/)
* **Icons:** [Lucide React](https://lucide.dev/)

## 🗺️ Roadmap (Upcoming Features)

- [ ] **Image & Media Nodes:** Drag and drop images directly into the canvas for moodboards and sprite references.
- [ ] **Local-First Architecture:** Save and load your canvas state locally (SQLite/IndexedDB) to ensure you truly own your data.
- [ ] **AI Integration (Google Gemini):** A contextual AI assistant that can read your canvas, brainstorm new connected nodes, and audit your game lore/code snippets.
- [ ] **Node Grouping (Zones):** Ability to group multiple nodes into visual, colored clusters (e.g., "Frontend Zone", "Sprint 1").
- [ ] **Global State Management:** Refactoring to Zustand to handle complex canvas interactions and sidebars.

## ⚙️ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn
