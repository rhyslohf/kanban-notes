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
  const markdownInput = document.getElementById('markdownInput');
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

  function exportMarkdown() {
    if (items.length === 0) {
      alert('No items to export.');
      return;
    }
    const markdown = items.map(function (item) {
      let text = '## ' + item.title + '\n\n';
      text += item.description ? item.description + '\n\n' : '';
      item.bullets.forEach(function (b) {
        text += '- ' + b + '\n';
      });
      return text.trim() + '\n';
    }).join('\n');
    prompt('Copy this Markdown:', markdown);
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
  }

  document.getElementById('importBtn').addEventListener('click', openModal);
  document.getElementById('exportBtn').addEventListener('click', exportMarkdown);
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
  document.getElementById('parseBtn').addEventListener('click', handleImport);
  document.querySelector('.modal-close').addEventListener('click', closeModal);
  importModal.addEventListener('click', function (e) {
    if (e.target === importModal) closeModal();
  });
  markdownInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  loadFromStorage();
  render();
  initDragAndDrop();
})();
