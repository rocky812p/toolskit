document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const saveBtn = document.getElementById('save-note');
    const clearBtn = document.getElementById('clear-note');
    const notesList = document.getElementById('notes-list');

    // Load saved notes from localStorage
    let notes = JSON.parse(localStorage.getItem('notes')) || [];

    // Display saved notes
    function displayNotes() {
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'bg-gray-100 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition-shadow duration-200';
            noteElement.innerHTML = `
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-semibold text-gray-900 dark:text-white">${escapeHtml(note.title)}</h4>
                        <p class="text-gray-600 dark:text-gray-300 mt-1 whitespace-pre-wrap">${escapeHtml(note.content)}</p>
                        <span class="text-sm text-gray-500 dark:text-gray-400">${note.date}</span>
                    </div>
                    <div class="flex space-x-2">
                        <button class="edit-note text-blue-500 hover:text-blue-600" data-index="${index}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-note text-red-500 hover:text-red-600" data-index="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;

            // Add edit functionality
            noteElement.querySelector('.edit-note').addEventListener('click', () => {
                editNote(index);
            });

            // Add delete functionality
            noteElement.querySelector('.delete-note').addEventListener('click', () => {
                deleteNote(index);
            });

            notesList.appendChild(noteElement);
        });
    }

    // Save note
    function saveNote() {
        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            showMessage('Please enter both title and content', 'error');
            return;
        }

        const date = new Date().toLocaleString();
        const note = { title, content, date };

        notes.unshift(note); // Add to beginning of array
        localStorage.setItem('notes', JSON.stringify(notes));
        
        // Clear inputs
        titleInput.value = '';
        contentInput.value = '';

        // Show success message
        showMessage('Note saved successfully!', 'success');

        // Refresh notes list
        displayNotes();
    }

    // Edit note
    function editNote(index) {
        const note = notes[index];
        titleInput.value = note.title;
        contentInput.value = note.content;
        
        // Remove the note from array (it will be re-added when saved)
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        displayNotes();

        // Focus on title input
        titleInput.focus();
    }

    // Delete note
    function deleteNote(index) {
        if (confirm('Are you sure you want to delete this note?')) {
            notes.splice(index, 1);
            localStorage.setItem('notes', JSON.stringify(notes));
            displayNotes();
            showMessage('Note deleted successfully!', 'success');
        }
    }

    // Clear inputs
    function clearInputs() {
        titleInput.value = '';
        contentInput.value = '';
    }

    // Show message
    function showMessage(message, type) {
        const messageElement = document.createElement('div');
        messageElement.className = `fixed top-4 right-4 p-4 rounded-lg text-white ${
            type === 'error' ? 'bg-red-500' : 'bg-green-500'
        } animate-fade-in`;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageElement.classList.add('animate-fade-out');
            setTimeout(() => {
                messageElement.remove();
            }, 300);
        }, 3000);
    }

    // Escape HTML to prevent XSS
    function escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Event listeners
    saveBtn.addEventListener('click', saveNote);
    clearBtn.addEventListener('click', clearInputs);

    // Auto-save functionality
    let autoSaveTimeout;
    contentInput.addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            if (titleInput.value.trim() && contentInput.value.trim()) {
                saveNote();
            }
        }, 2000); // Auto-save after 2 seconds of no typing
    });

    // Initialize
    displayNotes();
}); 