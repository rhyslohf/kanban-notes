# Kanban Board

A lightweight, client-side single-page web application that transforms Markdown backlog into a visual Kanban board for engineering work items.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML](https://img.shields.io/badge/html-5-blue.svg)
![CSS](https://img.shields.io/badge/css-3-pink.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow.svg)

## Features

- **Markdown Import** — Paste a Markdown backlog and automatically parse work items
- **Two-Column Kanban** — Visual board with **To Do** and **Done** columns
- **Drag & Drop** — Move items between columns with native HTML5 drag-and-drop
- **Local Storage** — All state persists across browser refreshes automatically
- **Add Todo** — Quickly add new items with a title and optional description via the shared item modal
- **Edit Items** — Click the pencil icon on any card to edit its title and description
- **Multi-Select Delete** — Click the red X on Done items to select them, then use the Delete Selected button in the Done column header to remove multiple items at once
- **Get from AI** — Generate a prompt for AI agents to transform your notes into a clean engineering backlog, then import the returned Markdown back
- **Reset Board** — Clear all data with confirmation
- **Dark Theme** — Lightweight, fast, and fully responsive UI
- **Zero Dependencies** — No frameworks, no backend, no build tools

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/<username>/kanban-board.git
   cd kanban-board
   ```
2. Open `index.html` in your browser, or serve it locally:
   ```bash
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080`.

## Markdown Format

Paste the following format into the **Import Markdown** modal:

```markdown
## Short Header

Brief description.

- Optional bullet
- Optional bullet

## Another Header

Another description.
```

Each `## Header` becomes a work item. The first line after the header is treated as the description. Lines starting with `- ` are parsed as optional bullet points.

## Adding and Editing Items

1. Click **Add Todo** in the toolbar to open the item modal with empty fields
2. Enter a title (required) and description (optional)
3. Click **Add** to create a new card in the **To Do** column
4. To edit an existing item, hover over any card and click the pencil icon (**✏️**)
5. The same modal opens with the item's current details
6. Click **Update** to save changes
7. Press **Escape** or click outside the modal to cancel

## Multi-Select Delete

1. Hover over any item in the **Done** column
2. Click the red **X** button to select it (items get a red border when selected)
3. Click multiple items to add them to the selection
4. The **Delete Selected (N)** button appears in the Done column header
5. Click it to remove all selected items at once

## AI Workflow

1. Click **Get from AI** in the toolbar
2. A pre-built prompt appears in a modal
3. Copy the prompt and paste it into an AI agent along with your own notes
4. The AI returns formatted Markdown
5. Use **Import Markdown** to load the AI's output back into the board

## How It Works

1. Click **Add Todo** to create items individually, or **Import Markdown** to bulk-parse a backlog
2. Items appear in the **To Do** column
3. Drag items to the **Done** column to mark them complete
4. Edit items anytime using the pencil icon on hover
5. Delete completed items using the multi-select X buttons in the Done column
6. Click **Get from AI** to generate a prompt for enriching your notes
7. All changes are saved to Local Storage automatically

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
