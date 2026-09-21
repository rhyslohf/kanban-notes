(function () {
  const STORAGE_KEY = 'kanban-board-items';

  let items = [];
  let draggedItem = null;

  const todoList = document.getElementById('todoList');
  const doneList = document.getElementById('doneList');
  const todoCount = document.getElementById('todoCount');
  const doneCount = document.getElementById('doneCount');
const emptyState = document.getElementById('emptyState');
  const importModal = document.getElementById('importModal');
  const aiModal = document.getElementById('aiModal');
  const markdownInput = document.getElementById('markdownInput');
  const aiPrompt = document.getElementById('aiPrompt');
  const board = document.getElementById('board');

  function loadFromStorage() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        items = JSON.parse(data);
      }
    } catch (e) {
      items = [];
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function parseMarkdown(markdown) {
    const items = [];
    const sections = markdown.trim().split(/\n(?=##\s)/);

    sections.forEach(function (section) {
      const headerMatch = section.match(/^##\s+(.+)$/m);
      if (!headerMatch) return;

      const title = headerMatch[1].trim();
      const afterHeader = section.slice(headerMatch.index + headerMatch[0].length);

      const descMatch = afterHeader.match(/^\s*([^\n-]+)/);
      const description = descMatch ? descMatch[1].trim() : '';

      const bullets = [];
      const bulletMatches = afterHeader.matchAll(/^- (.+)$/gm);
      for (const match of bulletMatches) {
        bullets.push(match[1].trim());
      }

      items.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        title: title,
        description: description,
        bullets: bullets,
        status: 'todo'
      });
    });

    return items;
  }

  function render() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    const todoItems = items.filter(function (i) { return i.status === 'todo'; });
    const doneItems = items.filter(function (i) { return i.status === 'done'; });

    todoItems.forEach(function (item) {
      todoList.appendChild(createCard(item));
    });

    doneItems.forEach(function (item) {
      doneList.appendChild(createCard(item));
    });

    todoCount.textContent = todoItems.length;
    doneCount.textContent = doneItems.length;

    emptyState.classList.toggle('hidden', items.length > 0);
    board.classList.toggle('hidden', items.length === 0);

    saveToStorage();
  }

  function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = item.id;

    let bulletsHtml = '';
    if (item.bullets.length > 0) {
      bulletsHtml = '<ul>' + item.bullets.map(function (b) {
        return '<li>' + escapeHtml(b) + '</li>';
      }).join('') + '</ul>';
    }

    card.innerHTML =
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
      bulletsHtml;

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function handleDragStart(e) {
    draggedItem = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
  }

  function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    draggedItem = null;
    document.querySelectorAll('.card-list').forEach(function (list) {
      list.classList.remove('drag-over');
    });
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const list = e.target.closest('.card-list');
    if (list) {
      list.classList.add('drag-over');
    }
  }

  function handleDragLeave(e) {
    const list = e.target.closest('.card-list');
    if (list && !list.contains(e.relatedTarget)) {
      list.classList.remove('drag-over');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    const list = e.target.closest('.card-list');
    if (!list) return;
    list.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const item = items.find(function (i) { return i.id === id; });
    if (!item) return;

    const newStatus = list.dataset.status;
    if (item.status !== newStatus) {
      item.status = newStatus;
      render();
    }
  }

  function initDragAndDrop() {
    document.querySelectorAll('.card-list').forEach(function (list) {
      list.addEventListener('dragover', handleDragOver);
      list.addEventListener('dragleave', handleDragLeave);
      list.addEventListener('drop', handleDrop);
    });
  }

  function showAIPrompt() {
    const prompt = `Here's a more generalized version that keeps the structure and intent the same, but replaces the software-specific example with one that works across engineering disciplines.

# Prompt: Engineering Notes → Actionable Work Queue

Act as a senior engineer with architecture and implementation experience.

I will provide an unstructured dump of engineering notes, TODOs, reminders, bug ideas, architecture thoughts, implementation fragments, and technical observations. Your job is to convert them into a concise, actionable engineering work queue.

## Rules

* Preserve technical terminology exactly where possible.

* Keep every work item brief—these are implementation cues, not documentation.

* Merge obvious duplicates or overlapping notes.

* Do not invent missing implementation details.

* Keep related tasks together where they clearly belong.

* Remove conversational filler and rewrite into engineering language.

* If a note contains enough detail to imply steps, include short bullet points.

* Do not create epics, priorities, estimates, or acceptance criteria unless explicitly present.

* Output only the formatted backlog.

## Output Format

Every item must follow this exact Markdown structure.

Markdown

\`\`\`
## Short Header

Brief one or two sentence description.

- Step or implementation cue (only if useful)
- Step or implementation cue
- Step or implementation cue
\`\`\`

### Formatting Rules

* Header: 2–6 words.

* Description: Maximum 2 sentences.

* Bullets: 0–5 bullets.

* One blank line between sections.

* Consistent formatting for every item.

* No nested bullets.

* No numbering.

* No extra commentary.

## Example

Input

> update monitoring alerts, clean up duplicate config entries, move shared logic into common module, keep existing behavior unchanged

Output

Markdown

\`\`\`
## Monitoring Cleanup

Consolidate monitoring and shared implementation work while preserving existing behavior.

- Update monitoring alerts
- Remove duplicate configuration entries
- Move shared logic into a common module
- Preserve current behavior
\`\`\`

Now convert my notes into this format.

--- PASTE YOUR NOTES BELOW ---`;

    document.getElementById('aiPrompt').value = prompt;
    document.getElementById('aiModal').classList.remove('hidden');
  }

  function handleImport() {
    const text = markdownInput.value.trim();
    if (!text) return;

    const parsed = parseMarkdown(text);
    if (parsed.length === 0) return;

    parsed.forEach(function (item) {
      const existing = items.find(function (i) { return i.title === item.title; });
      if (!existing) {
        items.push(item);
      }
    });

    render();
    closeModal();
  }

  function resetBoard() {
    if (!confirm('Are you sure you want to reset the board? All data will be lost.')) return;
    items = [];
    saveToStorage();
    render();
  }

  function openModal() {
    importModal.classList.remove('hidden');
    markdownInput.value = '';
  }

  function closeModal() {
    importModal.classList.add('hidden');
    aiModal.classList.add('hidden');
  }

  document.getElementById('importBtn').addEventListener('click', openModal);
  document.getElementById('exportBtn').addEventListener('click', showAIPrompt);
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
  document.getElementById('copyAIPrompt').addEventListener('click', function () {
    const ta = document.getElementById('aiPrompt');
    ta.select();
    document.execCommand('copy');
    const btn = document.getElementById('copyAIPrompt');
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = 'Copy Prompt'; }, 1500);
  });
  document.getElementById('parseBtn').addEventListener('click', handleImport);
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  importModal.addEventListener('click', function (e) {
    if (e.target === importModal) closeModal();
  });
  aiModal.addEventListener('click', function (e) {
    if (e.target === aiModal) closeModal();
  });
  markdownInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
  aiPrompt.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  loadFromStorage();
  render();
  initDragAndDrop();
})();
