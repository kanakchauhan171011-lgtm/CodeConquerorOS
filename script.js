lucide.createIcons();


setTimeout(() => {
    const boot = document.getElementById('boot-screen');
    boot.style.opacity = '0';

    setTimeout(() => {
        boot.style.display = 'none';

        const heading = document.getElementById('Welcome to Code Conquerors');
        if (heading) heading.style.opacity = '5';

    }, 800);
}, 3200);

function openApp(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.style.display = 'flex';

    document.querySelectorAll('.window').forEach(w => 
        w.classList.remove('window-active')
    );

    win.classList.add('window-active');
}

function closeApp(id) { 
    const win = document.getElementById(id);
    if (win) win.style.display = 'none'; 
}

// --- GOOGLE SEARCH ---
function doGoogleSearch() {
    const query = document.getElementById('google-search').value;
    const iframe = document.getElementById('browser-iframe');

    if (!iframe) return;

    if (query.includes('.')) {
        iframe.src = query.startsWith('http') ? query : 'https://' + query;
    } else {
        iframe.src = `https://www.google.com/search?q=${encodeURIComponent(query)}&igu=1`;
    }
}

// --- FILE MANAGER ---
let myFiles = JSON.parse(localStorage.getItem('cc-files')) || [];

function renderFiles() {
    const list = document.getElementById('file-list');
    if (!list) return;

    list.innerHTML = '';

    myFiles.forEach((f, index) => {
        list.innerHTML += `
            <div class="flex flex-col items-center p-3 bg-white/5 rounded-xl hover:bg-white/10 group relative">
                <i data-lucide="file-text" class="w-10 h-10 text-blue-300"></i>
                <span class="text-[10px] mt-2 truncate w-full text-center">${f.name}</span>
                <button onclick="deleteFile(${index})" class="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100">✕</button>
            </div>`;
    });

    lucide.createIcons();
}

function addFile(e) {
    const file = e.target.files[0];
    if (file) {
        myFiles.push({ name: file.name, date: new Date().toLocaleDateString() });
        localStorage.setItem('cc-files', JSON.stringify(myFiles));
        renderFiles();
    }
}

function deleteFile(idx) {
    myFiles.splice(idx, 1);
    localStorage.setItem('cc-files', JSON.stringify(myFiles));
    renderFiles();
}

// --- DRAG WINDOWS ---
document.querySelectorAll('.window').forEach(win => {
    const bar = win.querySelector('.title-bar');
    if (!bar) return;

    bar.onmousedown = (e) => {
        let startX = e.clientX - win.offsetLeft;
        let startY = e.clientY - win.offsetTop;

        document.onmousemove = (e) => {
            win.style.left = (e.clientX - startX) + 'px';
            win.style.top = (e.clientY - startY) + 'px';
        };

        document.onmouseup = () => document.onmousemove = null;

        openApp(win.id);
    };
});

// --- BACKGROUND ---
function changeBackground(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            document.body.style.backgroundImage =
                `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${e.target.result}')`;

            localStorage.setItem('os-wallpaper', e.target.result);
        };

        reader.readAsDataURL(file);
    }
}

const savedBg = localStorage.getItem('os-wallpaper');

if (savedBg) {
    document.body.style.backgroundImage =
        `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url('${savedBg}')`;
}

// --- INIT ---
renderFiles();