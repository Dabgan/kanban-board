# Kanban Board Application

A modern, accessible Kanban board implementation built with Next.js, TypeScript, and React DnD.

![Kanban Board Screenshot](/public/image.png)

## Features

-   **Board Management**

    -   Create, edit, and delete columns
    -   Real-time column title updates
    -   Column-specific card management

-   **Card Management**

    -   Create, edit, and delete cards
    -   Drag and drop cards between columns
    -   Keyboard navigation support

-   **Accessibility**

    -   Full keyboard navigation
    -   ARIA labels and roles
    -   Screen reader support
    -   Focus management

-   **Data Persistence**
    -   Optimistic updates
    -   Error handling
    -   Data validation

## Technical Stack

-   **Frontend/Backend**

    -   Next.js 14
    -   TypeScript
    -   React DnD (@hello-pangea/dnd)
    -   React Hot Toast
    -   SCSS Modules

-   **Testing**
    -   Jest
    -   React Testing Library
    -   User Event

## Getting Started

### Prerequisites

-   Node.js 18+
-   npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/Dabgan/kanban-board
cd kanban-board
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
