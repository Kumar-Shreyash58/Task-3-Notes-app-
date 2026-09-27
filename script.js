let notes = [];
let editingNoteId = null;
let currentCategory = "All";
function login() {
    let name = document.getElementById("nameInput").value;
    if (name.trim() === "") {
        alert("Please enter your name or email");
        return;
    }
    localStorage.setItem("userName", name);
    document.getElementById("userName").innerText = name;
    document.getElementById("loginPage")
        .classList.add("hidden");
    document.getElementById("app")
        .classList.remove("hidden");
    loadNotes();
}

function loadNotes() {
    let savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    displayNotes();
}

function saveNotes() {
    localStorage.setItem(
        "notes",
        JSON.stringify(notes)
    );
}

function createNote() {
    editingNoteId = null;
    document.getElementById("noteTitle").value = "";
    document.getElementById("noteContent").innerHTML = "";
    document.getElementById("noteCategory").value = "Work";
    document.getElementById("categoryColor").value = "#ffffff";
    document.getElementById("backgroundImage").value = "";
    document.getElementById("wordCount").innerText = "0";
    document.getElementById("editor")
        .classList.remove("hidden");
}

function saveCurrentNote() {
    let title = document.getElementById("noteTitle").value;
    let content = document.getElementById("noteContent").innerHTML;
    let category = document.getElementById("noteCategory").value;
    let color = document.getElementById("categoryColor").value;
    let image = document.getElementById("backgroundImage").value;
    if (title.trim() === "") {
        return;
    }
    if (editingNoteId !== null) {
        let note = notes.find(
            n => n.id === editingNoteId
        );

        if (note) {
            note.title = title;
            note.content = content;
            note.category = category;
            note.color = color;
            note.image = image;

            note.modified =
                new Date().toLocaleString();
            saveNotes();
        }
        return;
    }
    let newNote = {
        id: Date.now(),
        title: title,
        content: content,
        category: category,
        color: color,
        image: image,
        created: new Date().toLocaleString(),
        modified: new Date().toLocaleString(),
        pinned: false
    };
    notes.push(newNote);
    editingNoteId = newNote.id;
    saveNotes();
    displayNotes();
}

function displayNotes() {
    let container = document.getElementById("notesContainer");
    container.innerHTML = "";
    let search = document.getElementById("searchInput")
        .value
        .toLowerCase();
    let sort = document.getElementById("sortOption")
        .value;
    let filteredNotes = notes.filter(function(note) {
    let text =note.title + " " + note.content + " " +note.created + " " + note.modified + " " + note.category;
    let matchesSearch =
        text.toLowerCase().includes(search);
    let matchesCategory =
        currentCategory === "All" ||
        note.category === currentCategory;
    return matchesSearch && matchesCategory;
});
    if (sort === "title") {
        filteredNotes.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );
    }
    else if (sort === "created") {
        filteredNotes.sort(
            (a, b) =>
                a.id - b.id
        );
    }
    else if (sort === "category") {
        filteredNotes.sort(
            (a, b) =>
                a.category.localeCompare(b.category)
        );
    }
    else {
        filteredNotes.sort(
            (a, b) =>
                b.id - a.id
        );
    }
    filteredNotes.sort(
        (a, b) =>
            b.pinned - a.pinned
    );
    filteredNotes.forEach(function(note) {
        let card =
            document.createElement("div");
        card.className = "note";
        card.draggable = true;
        if (!document.body.classList.contains("dark")) {
    card.style.backgroundColor =
        note.color;
} else {

    card.style.backgroundColor =
        "#292929";
}
        if (note.image) {
            card.style.backgroundImage =
                "url('" + note.image + "')";
            card.style.backgroundSize = "cover";
        }
        card.innerHTML = `
            <h3>
                ${note.pinned ? "📌 " : ""}
                ${note.title}
            </h3>
            <div>
                ${note.content}
            </div>
            <p>Category: ${note.category}</p>
            <small>
                Created: ${note.created}
            </small>
            <br>
            <small>
                Last edited: ${note.modified}
            </small>
            <br><br>
            <button onclick="editNote(${note.id})">
                Edit
            </button>
            <button onclick="deleteNote(${note.id})">
                Delete
            </button>
            <button onclick="pinNote(${note.id})">
                ${note.pinned ? "Unpin" : "Pin"}
            </button>
        `;
        card.addEventListener(
            "dragstart",
            function(event) {
                event.dataTransfer.setData(
                    "noteId",
                    note.id
                );
            }
        );
        container.appendChild(card);
    });
}
function editNote(id) {
    let note = notes.find(
        n => n.id === id
    );
    editingNoteId = id;
    document.getElementById("noteTitle").value = note.title;
    document.getElementById("noteContent").innerHTML = note.content;
    document.getElementById("noteCategory").value = note.category;
    document.getElementById("categoryColor").value = note.color;
    document.getElementById("backgroundImage").value = note.image;
    updateWordCount();
    document.getElementById("editor")
        .classList.remove("hidden");
}
document.getElementById("noteTitle")
    .addEventListener("input", function() {
        if (editingNoteId !== null) {
            saveCurrentNote();
        }

    });

document.getElementById("noteContent")
    .addEventListener("input", function() {
        updateWordCount();
        if (editingNoteId !== null) {
            saveCurrentNote();
        }
    });
function deleteNote(id) {
    notes = notes.filter(
        note => note.id !== id
    );
    saveNotes();
    displayNotes();
}
function pinNote(id) {

    let note = notes.find(
        n => n.id === id
    );
    note.pinned = !note.pinned;
    saveNotes();
    displayNotes();
}
function closeEditor() {
    saveCurrentNote();
    document.getElementById("editor")
        .classList.add("hidden");
    displayNotes();
}
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}
function allowDrop(event) {
    event.preventDefault();
    function dropIntoCategory(event, category) {
    event.preventDefault();
    let id =
        event.dataTransfer.getData("noteId");
    let note = notes.find(
        n => n.id == id
    );
    if (note) {
        note.category = category;
        note.modified = new Date().toLocaleString();
        saveNotes(); 
        displayNotes();
    }
}
}
function dropIntoCategory(event, category) {
    event.preventDefault();
    let id = event.dataTransfer.getData("noteId");
    let note = notes.find(
        n => n.id == id
    );
    if (note) {
        note.category = category;
        note.modified = new Date().toLocaleString();
        saveNotes();
        displayNotes();
    }
}
function formatText(command) {
    document.execCommand(command, false, null);
}
function updateWordCount() {
    let text = document.getElementById("noteContent")
        .innerText
        .trim();
    let words =
        text === "" ? 0 : text.split(/\s+/).length;

    if (words > 400) {
        alert("Maximum 400 words allowed");
        return;
    }
    document.getElementById("wordCount")
        .innerText = words;
}
document.addEventListener(
    "keydown",
    function(event) {
        if (event.ctrlKey && event.key === "n") {
            event.preventDefault();
            createNote();
        }
        if (event.ctrlKey && event.key === "s") {
            event.preventDefault();
            saveCurrentNote();
            alert("Note saved");
        }
    }
);
window.onload = function() {
    let savedName =
        localStorage.getItem("userName");
    if (savedName) {
        document.getElementById("userName")
            .innerText = savedName;
        document.getElementById("loginPage")
            .classList.add("hidden");
        document.getElementById("app")
            .classList.remove("hidden");
        loadNotes();
    }
};
function filterCategory(category) {
    currentCategory = category;
    displayNotes();
}
function logout() {
    localStorage.removeItem("userName");
    document.getElementById("app")
        .classList.add("hidden");
    document.getElementById("loginPage")
        .classList.remove("hidden");
    document.getElementById("nameInput").value = "";
    currentCategory = "All";
}