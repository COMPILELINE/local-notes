document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let notes = [];
    let currentNote = null;

    // --- DOM Elements ---
    const noteListElement = document.getElementById('note-list');
    const newNoteBtn = document.getElementById('new-note-btn');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentTextarea = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note-btn');
    const deleteNoteBtn = document.getElementById('delete-note-btn');
    const backlinksContainer = document.getElementById('backlinks-container');
    const commandPaletteModal = new bootstrap.Modal(document.getElementById('commandPalette'));
    const paletteSearchInput = document.getElementById('palette-search');
    const paletteList = document.getElementById('palette-list');
    
    // --- Event Listeners ---
    newNoteBtn.addEventListener('click', newNote);
    saveNoteBtn.addEventListener('click', saveNote);
    deleteNoteBtn.addEventListener('click', deleteNote);
    document.addEventListener('keydown', handleKeydown);
    
    // --- Core Functions ---
    
    async function fetchNotes() {
        try {
            const response = await fetch('/api/notes');
            notes = await response.json();
            renderNotes();
            // Select the first note if available, otherwise clear editor
            if (notes.length > 0 && currentNote == null) {
                selectNote(notes[0].id);
            } else if (currentNote) {
                selectNote(currentNote.id); // Re-select to update backlinks
            } else {
                clearEditor();
            }
        } catch (error) {
            console.error('Error fetching notes:', error);
        }
    }
    
    function renderNotes() {
        noteListElement.innerHTML = '';
        notes.forEach(note => {
            const li = document.createElement('li');
            li.className = `list-group-item ${currentNote?.id === note.id ? 'active' : ''}`;
            li.textContent = note.title;
            li.dataset.id = note.id;
            li.addEventListener('click', () => selectNote(note.id));
            noteListElement.appendChild(li);
        });
    }

    function selectNote(id) {
        currentNote = notes.find(n => n.id === id);
        if (currentNote) {
            noteTitleInput.value = currentNote.title;
            noteContentTextarea.value = currentNote.content;
            renderNotes(); // Re-render to highlight active note
            updateBacklinks(currentNote);
            deleteNoteBtn.style.display = 'inline-block';
        }
    }

    function clearEditor() {
        currentNote = null;
        noteTitleInput.value = '';
        noteContentTextarea.value = '';
        backlinksContainer.innerHTML = '';
        deleteNoteBtn.style.display = 'none';
        renderNotes();
    }
    
    function newNote() {
        clearEditor();
        noteTitleInput.focus();
    }
    
    async function saveNote() {
        const title = noteTitleInput.value;
        const content = noteContentTextarea.value;
    
        if (!title.trim()) {
            alert('Note title cannot be empty.');
            return;
        }

        const noteData = {
            title,
            content
        };
    
        try {
            let response;
            if (currentNote) {
                response = await fetch(`/api/notes/${currentNote.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: currentNote.id, ...noteData })
                });
            } else {
                response = await fetch('/api/notes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(noteData)
                });
            }
            if (response.ok) {
                // Fetch all notes to refresh the state and UI
                await fetchNotes();
                if (!currentNote) {
                    // Find the newly created note and select it
                    const newNote = notes.find(n => n.title === title && n.content === content);
                    if (newNote) {
                        selectNote(newNote.id);
                    }
                }
            } else {
                console.error('Failed to save note:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving note:', error);
        }
    }

    async function deleteNote() {
        if (!currentNote || !confirm('Are you sure you want to delete this note?')) {
            return;
        }
    
        try {
            const response = await fetch(`/api/notes/${currentNote.id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                currentNote = null;
                await fetchNotes(); // Re-fetch notes to update the list
            } else {
                console.error('Failed to delete note:', response.statusText);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    }

    function updateBacklinks(note) {
        backlinksContainer.innerHTML = '';
        if (note.backlinks && note.backlinks.length > 0) {
            const header = document.createElement('h6');
            header.textContent = 'Linked From:';
            backlinksContainer.appendChild(header);
            
            const ul = document.createElement('ul');
            ul.className = 'list-unstyled';
            note.backlinks.forEach(title => {
                const linkNote = notes.find(n => n.title === title);
                if (linkNote) {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = title;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        selectNote(linkNote.id);
                    });
                    li.appendChild(a);
                    ul.appendChild(li);
                }
            });
            backlinksContainer.appendChild(ul);
        }
    }

    // --- Command Palette Logic ---
    function handleKeydown(event) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'p') {
            event.preventDefault();
            commandPaletteModal.show();
            paletteSearchInput.value = '';
            renderPaletteItems('');
        }
    }
    
    paletteSearchInput.addEventListener('input', (event) => {
        renderPaletteItems(event.target.value);
    });

    function renderPaletteItems(query) {
        paletteList.innerHTML = '';
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) || 
            note.content.toLowerCase().includes(query.toLowerCase())
        );

        filteredNotes.forEach(note => {
            const li = document.createElement('li');
            li.className = 'list-group-item list-group-item-action';
            li.textContent = note.title;
            li.addEventListener('click', () => {
                selectNote(note.id);
                commandPaletteModal.hide();
            });
            paletteList.appendChild(li);
        });
    }

    // Initial load
    fetchNotes();
});
