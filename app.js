(function () {
  var STORAGE_KEY = 'kanban-board-items';

  var items = [];
  var draggedItem = null;
  var selectedItems = [];
  var editingItemId = null;

  var todoList = document.getElementById('todoList');
  var doneList = document.getElementById('doneList');
  var todoCount = document.getElementById('todoCount');
  var doneCount = document.getElementById('doneCount');
  var emptyState = document.getElementById('emptyState');
  var importModal = document.getElementById('importModal');
  var aiModal = document.getElementById('aiModal');
  var itemModal = document.getElementById('itemModal');
  var markdownInput = document.getElementById('markdownInput');
  var aiPrompt = document.getElementById('aiPrompt');
  var board = document.getElementById('board');
  var deleteBtn = document.getElementById('deleteBtn');
  var itemModalHeading = document.getElementById('itemModalHeading');
  var itemModalTitle = document.getElementById('itemModalTitle');
  var itemModalDesc = document.getElementById('itemModalDesc');
  var itemModalSubmit = document.getElementById('itemModalSubmit');

  function loadFromStorage() {
    try {
      var data = localStorage.getItem(STORAGE_KEY);
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
    var sections = markdown.trim().split(/\n(?=##\s)/);
    var result = [];
    sections.forEach(function (section) {
      var headerMatch = section.match(/^##\s+(.+)$/m);
      if (!headerMatch) return;

      var title = headerMatch[1].trim();
      var afterHeader = section.slice(headerMatch.index + headerMatch[0].length);

      var descMatch = afterHeader.match(/^\s*([^\n-]+)/);
      var description = descMatch ? descMatch[1].trim() : '';

      var bullets = [];
      var bulletMatches = afterHeader.matchAll(/^- (.+)$/gm);
      for (var i = 0; i < bulletMatches.length; i++) {
        bullets.push(bulletMatches[i][1].trim());
      }

      result.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        title: title,
        description: description,
        bullets: bullets,
        status: 'todo'
      });
    });
    return result;
  }

  function render() {
    todoList.innerHTML = '';
    doneList.innerHTML = '';

    var todoItems = items.filter(function (i) { return i.status === 'todo'; });
    var doneItems = items.filter(function (i) { return i.status === 'done'; });

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

    if (selectedItems.length > 0) {
      deleteBtn.textContent = 'Delete Selected (' + selectedItems.length + ')';
      deleteBtn.classList.remove('hidden');
    } else {
      deleteBtn.classList.add('hidden');
    }

    saveToStorage();
  }

  function createCard(item) {
    var card = document.createElement('div');
    card.className = 'card';
    if (item.status === 'done' && selectedItems.indexOf(item.id) !== -1) {
      card.classList.add('selected');
    }
    card.draggable = true;
    card.dataset.id = item.id;

    var bulletsHtml = '';
    if (item.bullets.length > 0) {
      var lis = item.bullets.map(function (b) {
        return '<li>' + escapeHtml(b) + '</li>';
      }).join('');
      bulletsHtml = '<ul>' + lis + '</ul>';
    }

    var deleteHtml = item.status === 'done'
      ? '<button class="delete-btn" data-id="' + item.id + '">&times;</button>'
      : '';

    card.innerHTML =
      '<h3>' + escapeHtml(item.title) + '</h3>' +
      (item.description ? '<p>' + escapeHtml(item.description) + '</p>' : '') +
      bulletsHtml +
      '<button class="edit-btn" data-id="' + item.id + '">&#9998;</button>' +
      deleteHtml;

    var editBtn = card.querySelector('.edit-btn');
    editBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openEditModal(item.id);
    });

    if (item.status === 'done') {
      var delBtn = card.querySelector('.delete-btn');
      if (delBtn) {
        delBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          toggleSelect(item.id);
        });
      }
    }

    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);

    return card;
  }

  function openAddModal() {
    editingItemId = null;
    itemModalHeading.textContent = 'Add Todo';
    itemModalTitle.value = '';
    itemModalDesc.value = '';
    itemModalSubmit.textContent = 'Add';
    itemModal.classList.remove('hidden');
  }

  function openEditModal(id) {
    var item = items.find(function (i) { return i.id === id; });
    if (!item) return;
    editingItemId = id;
    itemModalHeading.textContent = 'Edit Item';
    itemModalTitle.value = item.title;
    itemModalDesc.value = item.description || '';
    itemModalSubmit.textContent = 'Update';
    itemModal.classList.remove('hidden');
  }

  closeModal();

  function submitItem() {
    var title = itemModalTitle.value.trim();
    if (!title) return;
    var desc = itemModalDesc.value.trim();

    if (editingItemId) {
      var item = items.find(function (i) { return i.id === editingItemId; });
      if (item) {
        item.title = title;
        item.description = desc;
      }
      editingItemId = null;
    } else {
      items.push({
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        title: title,
        description: desc,
        bullets: [],
        status: 'todo'
      });
    }

    closeModal();
    render();
  }

  function toggleSelect(id) {
    var idx = selectedItems.indexOf(id);
    if (idx !== -1) {
      selectedItems.splice(idx, 1);
    } else {
      selectedItems.push(id);
    }
    render();
  }

  function deleteSelected() {
    items = items.filter(function (i) { return selectedItems.indexOf(i.id) === -1; });
    selectedItems = [];
    saveToStorage();
    render();
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
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
    var list = e.target.closest('.card-list');
    if (list) {
      list.classList.add('drag-over');
    }
  }

  function handleDragLeave(e) {
    var list = e.target.closest('.card-list');
    if (list && !list.contains(e.relatedTarget)) {
      list.classList.remove('drag-over');
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    var list = e.target.closest('.card-list');
    if (!list) return;
    list.classList.remove('drag-over');

    var id = e.dataTransfer.getData('text/plain');
    var item = items.find(function (i) { return i.id === id; });
    if (!item) return;

    var newStatus = list.dataset.status;
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
    document.getElementById('aiPrompt').value = AI_PROMPT_TEXT;
    document.getElementById('aiModal').classList.remove('hidden');
  }

  function handleImport() {
    var text = markdownInput.value.trim();
    if (!text) return;

    var parsed = parseMarkdown(text);
    if (parsed.length === 0) return;

    parsed.forEach(function (item) {
      var existing = items.find(function (i) { return i.title === item.title; });
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
    itemModal.classList.add('hidden');
    editingItemId = null;
  }

  var closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(function (btn) {
    btn.addEventListener('click', closeModal);
  });
  importModal.addEventListener('click', function (e) {
    if (e.target === importModal) closeModal();
  });
  aiModal.addEventListener('click', function (e) {
    if (e.target === aiModal) closeModal();
  });
  itemModal.addEventListener('click', function (e) {
    if (e.target === itemModal) closeModal();
  });

  document.getElementById('addTodoBtn').addEventListener('click', openAddModal);
  document.getElementById('importBtn').addEventListener('click', openModal);
  document.getElementById('exportBtn').addEventListener('click', showAIPrompt);
  document.getElementById('resetBtn').addEventListener('click', resetBoard);
  document.getElementById('itemModalSubmit').addEventListener('click', submitItem);
  deleteBtn.addEventListener('click', deleteSelected);

  document.getElementById('copyAIPrompt').addEventListener('click', function () {
    var ta = document.getElementById('aiPrompt');
    ta.select();
    document.execCommand('copy');
    var btn = document.getElementById('copyAIPrompt');
    btn.textContent = 'Copied!';
    setTimeout(function () { btn.textContent = 'Copy Prompt'; }, 1500);
  });
  document.getElementById('parseBtn').addEventListener('click', handleImport);

  markdownInput.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  aiPrompt.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  itemModalTitle.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
  itemModalDesc.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });
})();
