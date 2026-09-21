# Kanban Board

A lightweight, client-side single-page web application that transforms a Markdown backlog into a visual Kanban board for engineering work items.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML](https://img.shields.io/badge/html-5-blue.svg)
![CSS](https://img.shields.io/badge/css-3-pink.svg)
![JavaScript](https://img.shields.io/badge/javascript-ES6-yellow.svg)

## Features

- **Markdown Import** — Paste a Markdown backlog and automatically parse work items, including titles, descriptions, and bullet points
- **Two-Column Kanban** — Visual board with **To Do** and **Done** columns
- **Drag & Drop** — Move items between columns with native HTML5 drag-and-drop
- **Local Storage** — All state persists across browser refreshes automatically
- **Add Todo** — Quickly add new items with a title, description, and optional bullet points via the item modal
- **Edit Items** — Click the pencil icon (✏️) on any card to edit its title, description, and bullet points
- **Bullet Points** — Both imported Markdown and manually added/edited items support bullet points, shown on the card
- **Multi-Select Delete** — Click the red ✕ on Done items to select them, then use **Delete Selected** to remove multiple items at once
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
2. Open `index.html` directly in your browser, or serve it locally:
   ```bash
   python -m http.server 8080
   ```
   Then navigate to `http://localhost:8080`.

No build step or package installation is required.

## Markdown Import Format

Click **Import Markdown** and paste a backlog in the following format:

```markdown
## Short Header

Brief description.

- Optional bullet point
- Optional bullet point

## Another Header

Another description.

- A bullet
```

Each `## Heading` becomes a card in the **To Do** column. The first non-bullet line after the heading is the description. Lines starting with `- ` become bullet points shown beneath the description on the card.

Importing is additive — items with duplicate titles are skipped, so re-importing a backlog is safe.

## Adding and Editing Items

1. Click **Add Todo** in the toolbar to open the item modal
2. Enter a **Title** (required)
3. In the **Description** field (a multi-line text area), add:
   - A plain description on the first line(s), and/or
   - Bullet points on any line starting with `- ` (dash + space)
4. Click **Add** to create the card in the **To Do** column

To edit an existing item:

1. Hover over any card and click the blue pencil icon (**✏️**) in the top-right corner
2. The modal opens pre-filled with the item's current title, description, and bullet points
3. Make your changes and click **Update** to save
4. Press **Escape** or click outside the modal to cancel without saving

### Description Field Example

```
Implement authentication middleware
- Add JWT validation
- Handle token expiry
- Write unit tests
```

This produces a card with the description *"Implement authentication middleware"* and three bullet points.

## Drag & Drop

- Grab any card and drag it to the **Done** column to mark it complete
- Drag it back to **To Do** to reopen it
- The target column highlights in blue when you hover over it during a drag
- All status changes are saved to Local Storage immediately

## Multi-Select Delete

1. Hover over any item in the **Done** column
2. Click the red **✕** button to select it (items get a red border when selected)
3. Select as many items as needed
4. The **Delete Selected (N)** button appears in the Done column header showing the count
5. Click it to permanently remove all selected items

## AI Workflow

1. Click **Get from AI** in the toolbar
2. A pre-built prompt appears — copy it
3. Paste the prompt into an AI assistant along with your own notes
4. The AI returns a formatted Markdown backlog
5. Click **Import Markdown** and paste the AI's output to load all items onto the board

## Local Storage

All board data (items, statuses, descriptions, and bullet points) is automatically saved to the browser's `localStorage` under the key `kanban-board-items`. The board fully restores its state on every page load — no server or login required.

To clear all data, click **Reset Board** and confirm the prompt.

## Keyboard Shortcuts

| Key | Context | Action |
|-----|---------|--------|
| `Escape` | Any modal | Close the modal |
| `Escape` | Description textarea | Close the modal (when not composing a bullet) |

## Browser Support

- Chrome (recommended)
- Firefox
- Edge
- Safari

## License

MIT
