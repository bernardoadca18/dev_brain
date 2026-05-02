# Dev Brain | AI-Powered Infinite Canvas

🇧🇷 Português | 🇺🇸 [English](./README.md)
---

## 🚀 Visão Geral

**Dev Brain** é uma plataforma de produtividade e organização visual projetada para desenvolvedores e criadores. Utilizando uma interface de "infinite canvas" (lona infinita), o projeto permite a estruturação de ideias, gestão de tarefas e integração com inteligência artificial em um ambiente unificado e altamente customizável.

O projeto foi construído para ser o "cérebro digital" de um desenvolvedor. Ele substitui listas de tarefas lineares por um fluxo visual dinâmico, onde você pode conectar notas de lore (história), checklists de design de níveis, recursos de mídia e transcrições de voz em um único grafo interativo.

---

## ✨ Funcionalidades Principais

- **Infinite Canvas (Lona Infinita):** Navegação fluida com zoom e pan, permitindo organizar informações sem limites espaciais.

- **Ecossistema de Nós (Nodes):**
  - 📝 **Notas:** Editor de texto para documentação e ideias  
  - ✅ **Tarefas (Tasks):** Gestão de checklists diretamente na lona  
  - 🖼️ **Mídia:** Suporte para imagens, áudio e vídeo  
  - 🎙️ **Speech-to-Text:** Conversão de voz em texto integrada  
  - 📁 **Grupos:** Agrupamento lógico de nós relacionados  

- **IA Integrada:** Chat lateral com integração ao Google Gemini (`@google/genai`)  

- **Persistência Local Inteligente:** Armazenamento via **IndexedDB** e **LocalStorage**  

- **Histórico e Recuperação:** Sistema de **Undo/Redo** com até 50 estados  

- **Customização:** Sistema de "Hue Shifting" para alterar a cor de destaque (accent color)  

---

## 🛠️ Stack Técnica

### Frontend & Frameworks

- **Framework:** Next.js 15+ (App Router)  
- **Linguagem:** TypeScript  
- **Gerenciamento de Estado:** Zustand  
- **Interface de Fluxo:** @xyflow/react  
- **Estilização:** Tailwind CSS & Framer Motion  

### Bibliotecas Essenciais

- `@google/genai`  
- `@dnd-kit/core`  
- `lucide-react`  
- `idb-keyval`  

---

## 🏗️ Arquitetura do Sistema

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

## ⚙️ Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/dev-brain.git
cd dev-brain
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_GEMINI_API_KEY=sua_chave_aqui
```

### 4. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse no navegador:  
http://localhost:3000

---

## ⌨️ Atalhos de Teclado

- Ctrl + Z → Desfazer  
- Ctrl + Y → Refazer  
- Backspace / Delete → Remover nó selecionado  
- Double Click → Criar nova nota na posição do mouse  

---

## 📝 Licença

Este projeto é de uso privado.
