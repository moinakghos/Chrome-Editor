let fileStructure = {};
    let currentFile = null;

    document.addEventListener('DOMContentLoaded', () => {
        renderFileExplorer();

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                saveFile();
            } else if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                e.preventDefault();
                saveAsFile();
            } else if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                document.getElementById('fileInput').click();
            }
        });
    });

    function renderFileExplorer() {
        const fileList = document.getElementById('fileList');
        fileList.innerHTML = '';
        Object.keys(fileStructure).forEach(key => {
            const li = createFileElement(key);
            fileList.appendChild(li);
        });
    }

    function createFileElement(name) {
        const li = document.createElement('li');
        li.textContent = name;
        li.style.cursor = 'pointer';
        li.onclick = () => loadFile(name, fileStructure[name]);
        return li;
    }

    function createFile() {
        const fileName = prompt("Enter file name:");
        if (!fileName) return;

        fileStructure[fileName] = '';
        renderFileExplorer();
    }

    function loadFile(name, content) {
        currentFile = name;
        const editor = document.getElementById('editor');
        editor.value = content;
        document.title = `${name} - Chrome Editor`;
    }

    function saveFile() {
        if (!currentFile) {
            alert("No file is currently open to save.");
            return;
        }

        const editorContent = document.getElementById('editor').value;
        fileStructure[currentFile] = editorContent;
        alert(`${currentFile} has been saved.`);
    }

    function saveAsFile() {
        const fileName = prompt("Enter the file name for saving:", currentFile || "newFile.txt");
        if (!fileName) return;

        const editorContent = document.getElementById('editor').value;
        fileStructure[fileName] = editorContent;
        renderFileExplorer();
    }

    function openFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                currentFile = file.name;
                fileStructure[file.name] = e.target.result;
                renderFileExplorer();
                loadFile(file.name, e.target.result);
            };
            reader.readAsText(file);
        }
    }

    function newWindow() {
        const newWin = window.open("index.html", "_blank");
        if (!newWin) {
            alert("Pop-ups are blocked. Please allow pop-ups for this site.");
        }
    }

    function exitApp() {
        if (confirm("Are you sure you want to exit the application? Unsaved changes will be lost.")) {
            window.close();
        }
    }

    function toggleMode() {
        const body = document.body;
        const topbar = document.querySelector(".topbar");
        const sidebar = document.querySelector(".sidebar");

        body.classList.toggle("light-mode");
        topbar.classList.toggle("light-mode");
        sidebar.classList.toggle("light-mode");
    }