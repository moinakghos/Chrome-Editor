document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('fileList');
    const openFileButton = document.getElementById('openFileButton');
    const editor = document.getElementById('editor');
    const wordCountElement = document.getElementById('wordCount');

    let fileContents = {}; // Object to store file names and their contents
    let currentFile = null; // Track the currently selected file

    // Update file explorer visibility
    const updateFileExplorer = () => {
        if (fileList.children.length > 0) {
            openFileButton.classList.add('hidden'); // Hide the "Open File" button
        } else {
            openFileButton.classList.remove('hidden'); // Show the "Open File" button
        }
    };

    // Observe changes in the file list
    const observer = new MutationObserver(updateFileExplorer);
    observer.observe(fileList, { childList: true });

    // Key bindings
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'n') {
            e.preventDefault();
            createFile();
        } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'o') {
            e.preventDefault();
            document.getElementById('fileInput').click();
        } else if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            saveAsFile();
        }
    });

    // Update word count dynamically as user types
    editor.addEventListener('input', () => {
        const text = editor.value.trim();
        const wordCount = text.length === 0 ? 0 : text.split(/\s+/).length;
        wordCountElement.textContent = `Word Count: ${wordCount}`;

        // Save content to the currently selected file
        if (currentFile) {
            fileContents[currentFile] = editor.value;
        }
    });

    // Function to create a new file
    function createFile() {
        const fileName = `Untitled-${Object.keys(fileContents).length + 1}`;
        fileContents[fileName] = ''; // Add blank content for the new file
        addFileToExplorer(fileName);
        selectFile(fileName);
    }

    // Function to open a file
    function openFile(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;

                // Always add the file to the explorer freshly
                fileContents[file.name] = content; // Store file content
                removeFileFromExplorer(file.name); // Remove any existing file entry
                addFileToExplorer(file.name); // Add the file afresh
                selectFile(file.name); // Select and display the file
            };
            reader.readAsText(file);
        }
    }

    // Function to add a file to the explorer
    function addFileToExplorer(fileName) {
        const li = document.createElement('li');
        li.dataset.fileName = fileName;
        li.textContent = fileName;

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.className = 'file-close';
        closeBtn.onclick = (event) => {
            event.stopPropagation();
            li.remove();

            if (fileList.children.length === 0) {
                editor.value = ''; // Clear editor if no files remain
                wordCountElement.textContent = 'Word Count: 0';
                currentFile = null;
            } else {
                const nextFile = fileList.firstChild.dataset.fileName;
                selectFile(nextFile); // Select the next file if available
            }
        };

        li.appendChild(closeBtn);
        li.onclick = () => selectFile(fileName);

        fileList.appendChild(li);
        updateFileExplorer();
    }

    // Function to remove a file from the explorer
    function removeFileFromExplorer(fileName) {
        const fileItem = [...fileList.children].find((li) => li.dataset.fileName === fileName);
        if (fileItem) {
            fileItem.remove();
        }
    }

    // Function to select a file and load its content into the editor
    function selectFile(fileName) {
        [...fileList.children].forEach((li) => li.classList.remove('active')); // Deselect all files

        const fileItem = [...fileList.children].find((li) => li.dataset.fileName === fileName);
        if (fileItem) {
            fileItem.classList.add('active'); // Highlight the selected file
            editor.value = fileContents[fileName]; // Load content into the editor
            const text = editor.value.trim();
            wordCountElement.textContent = `Word Count: ${
                text.length === 0 ? 0 : text.split(/\s+/).length
            }`;
            currentFile = fileName; // Set the currently active file
        }
    }

    // Function to save a file with "Save As" functionality
    async function saveAsFile() {
        const textarea = document.getElementById('editor');
        const content = textarea.value;

        const options = {
            types: [
                {
                    description: 'Text Files',
                    accept: {
                        'text/plain': ['.txt', '.html', '.js', '.css'],
                    },
                },
            ],
        };

        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
        alert('File saved successfully!');
    }

    // Function to initialize light mode by default
    function initializeLightMode() {
        const body = document.body;
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');

        const editor = document.getElementById('editor');
        const sidebar = document.getElementById('sidebar');

        editor.style.backgroundColor = '#ffffff';
        editor.style.color = '#000000';
        sidebar.style.backgroundColor = '#f3f3f3';
        sidebar.style.color = '#000000';
    }

    // Function to toggle between light and dark mode
    function toggleMode() {
        const body = document.body;
        body.classList.toggle('light-mode');
        body.classList.toggle('dark-mode');

        const editor = document.getElementById('editor');
        const sidebar = document.getElementById('sidebar');

        if (body.classList.contains('dark-mode')) {
            editor.style.backgroundColor = '#1e1e1e';
            editor.style.color = '#ffffff';
            sidebar.style.backgroundColor = '#202124';
            sidebar.style.color = '#ffffff';
        } else {
            editor.style.backgroundColor = '#ffffff';
            editor.style.color = '#000000';
            sidebar.style.backgroundColor = '#f3f3f3';
            sidebar.style.color = '#000000';
        }
    }

    // Expose functions globally for use in HTML
    window.createFile = createFile;
    window.openFile = openFile;
    window.saveAsFile = saveAsFile;
    window.toggleMode = toggleMode;
    window.initializeLightMode = initializeLightMode;
});
