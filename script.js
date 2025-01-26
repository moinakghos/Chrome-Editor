document.addEventListener('DOMContentLoaded', () => {
    const fileList = document.getElementById('fileList');
    const openFileButton = document.getElementById('openFileButton');
    const wordCountElement = document.getElementById('wordCount');
    const editor = document.getElementById('editor');

    const observer = new MutationObserver(() => {
        if (fileList.children.length > 0) {
            openFileButton.classList.add('hidden');
        } else {
            openFileButton.classList.remove('hidden');
        }
    });

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

    // Update word count as user types
    editor.addEventListener('input', () => {
        const text = editor.value;
        const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
        wordCountElement.textContent = `Word Count: ${wordCount}`;
    });
});

function initializeLightMode() {
    const body = document.body;
    body.classList.add('light-mode');
    body.classList.remove('dark-mode');
}

function toggleMode() {
    const body = document.body;
    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');
}

function openFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const textarea = document.getElementById('editor');
            textarea.value = e.target.result;

            // Add file to file list
            const fileList = document.getElementById('fileList');
            const li = document.createElement('li');
            li.textContent = file.name;

            const closeBtn = document.createElement('span');
            closeBtn.textContent = '✕';
            closeBtn.className = 'file-close';
            closeBtn.onclick = (event) => {
                event.stopPropagation();
                li.remove();
                if (fileList.children.length === 0) {
                    textarea.value = '';
                }
            };

            li.appendChild(closeBtn);
            fileList.appendChild(li);
        };
        reader.readAsText(file);
    }
}

function createFile() {
    const textarea = document.getElementById('editor');
    textarea.value = '';

    const fileList = document.getElementById('fileList');
    const li = document.createElement('li');
    li.textContent = 'Untitled';

    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    closeBtn.className = 'file-close';
    closeBtn.onclick = (event) => {
        event.stopPropagation();
        li.remove();
        if (fileList.children.length === 0) {
            textarea.value = '';
        }
    };

    li.appendChild(closeBtn);
    fileList.appendChild(li);

    // Focus the editor for immediate typing
    textarea.focus();
}

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
