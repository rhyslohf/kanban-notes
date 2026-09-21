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
- **Markdown Export** — Convert board items back to Markdown format for copying
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

## How It Works

1. Click **Import Markdown** and paste your backlog
2. Items are parsed and displayed in the **To Do** column
3. Drag items to the **Done** column to mark them complete
4. Click **Export Markdown** to copy the board back to Markdown
5. All changes are saved to Local Storage automatically

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
