export function setupNotesWindow(windowElement) {
  const notesContainer = windowElement.querySelector(".notes-container");
  const newNoteBtn = windowElement.querySelector(".new-note-btn");
  const notesList = windowElement.querySelector(".notes-list");

  // Load notes from localStorage
  function loadNotes() {
    const saved = localStorage.getItem("ethanos-notes");
    return saved ? JSON.parse(saved) : [];
  }

  // Save notes to localStorage
  function saveNotes(notes) {
    localStorage.setItem("ethanos-notes", JSON.stringify(notes));
  }

  // Render all notes
  function renderNotes() {
    const notes = loadNotes();
    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = '<div class="notes-empty">No notes yet. Click "New Note" to create one!</div>';
      return;
    }

    notes.forEach((note, index) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note-item";
      noteElement.innerHTML = `
        <div class="note-header">
          <input type="text" class="note-title" value="${escapeHtml(note.title)}" placeholder="Untitled Note">
          <button class="note-delete-btn" data-index="${index}">×</button>
        </div>
        <textarea class="note-content" placeholder="Start typing...">${escapeHtml(note.content)}</textarea>
        <div class="note-footer">
          <span class="note-date">${formatDate(note.date)}</span>
        </div>
      `;

      const titleInput = noteElement.querySelector(".note-title");
      const contentTextarea = noteElement.querySelector(".note-content");
      const deleteBtn = noteElement.querySelector(".note-delete-btn");

      // Auto-save on change
      titleInput.addEventListener("input", () => {
        notes[index].title = titleInput.value;
        saveNotes(notes);
      });

      contentTextarea.addEventListener("input", () => {
        notes[index].content = contentTextarea.value;
        saveNotes(notes);
      });

      deleteBtn.addEventListener("click", () => {
        notes.splice(index, 1);
        saveNotes(notes);
        renderNotes();
      });

      notesList.appendChild(noteElement);
    });
  }

  // Create new note
  function createNewNote() {
    const notes = loadNotes();
    const newNote = {
      title: "",
      content: "",
      date: new Date().toISOString(),
    };
    notes.unshift(newNote);
    saveNotes(notes);
    renderNotes();
  }

  newNoteBtn.addEventListener("click", createNewNote);

  // Initial render
  renderNotes();
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
