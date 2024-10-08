// Global variables for e-reader
let currentChapter = 1;
let currentPage = 0;
let pages = [];
let fontSize = 16;
let lineSpacing = 1.5;
let pageWidth = 800;
let pageHeight = 600;
let margin = 20;
let chapterTitle = '';

// Global loadChapter function
window.loadChapter = async function(chapterNumber) {
    const chapterContent = document.getElementById('ereader-content');
    chapterContent.innerHTML = '<div class="text-center"><div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div></div>';
    
    try {
        const response = await fetch(`chapters/chapter_${chapterNumber}.md`);
        if (!response.ok) throw new Error('Chapter not found');
        const content = await response.text();
        currentChapter = chapterNumber;
        currentPage = 0;
        const parsedContent = parseMarkdown(content);
        chapterTitle = parsedContent.title;
        pages = paginateContent(parsedContent.content);
        displayChapter();
    } catch (error) {
        console.error('Error loading chapter:', error);
        chapterContent.innerHTML = '<p class="alert alert-danger">Error loading chapter. Please try again later.</p>';
    }
};

// Parse markdown content
function parseMarkdown(content) {
    const lines = content.split('\n');
    let title = '';
    let parsedContent = '';

    for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('# ') && !title) {
            title = lines[i].substring(2).trim();
        } else {
            parsedContent += lines[i] + '\n';
        }
    }

    return { title, content: marked.parse(parsedContent) };
}

// Paginate content
function paginateContent(content) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const words = tempDiv.innerText.split(' ');
    const lines = [];
    let currentLine = '';
    const charsPerLine = Math.floor((pageWidth - 2 * margin) / (fontSize * 0.6));

    words.forEach(word => {
        if ((currentLine + word).length <= charsPerLine) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) lines.push(currentLine);

    const linesPerPage = Math.floor((pageHeight - 2 * margin) / (fontSize * lineSpacing));
    const pages = [];
    for (let i = 0; i < lines.length; i += linesPerPage) {
        pages.push(lines.slice(i, i + linesPerPage));
    }
    return pages;
}

// Navigation functions
function nextPage() {
    if (currentPage < pages.length - 1) {
        currentPage++;
    } else if (currentChapter < 17) {
        loadChapter(currentChapter + 1);
    }
    displayChapter();
}

function previousPage() {
    if (currentPage > 0) {
        currentPage--;
    } else if (currentChapter > 1) {
        loadChapter(currentChapter - 1).then(() => {
            currentPage = pages.length - 1;
            displayChapter();
        });
    }
    displayChapter();
}

// Update reader settings
function updateFontSize(value) {
    fontSize = value;
    updateReaderSettings();
}

function updateLineSpacing(value) {
    lineSpacing = value;
    updateReaderSettings();
}

function updatePageWidth(value) {
    pageWidth = value;
    updateReaderSettings();
}

function updatePageHeight(value) {
    pageHeight = value;
    updateReaderSettings();
}

function updateMargin(value) {
    margin = value;
    updateReaderSettings();
}

function updateReaderSettings() {
    const content = pages.flat().join(' ');
    pages = paginateContent(content);
    currentPage = 0;
    displayChapter();
}

// Display chapter
function displayChapter() {
    const chapterContent = document.getElementById('ereader-content');
    const pageInfo = document.getElementById('page-info');
    const chapterTitleElement = document.getElementById('chapter-title');
    
    chapterContent.style.fontSize = `${fontSize}px`;
    chapterContent.style.lineHeight = `${lineSpacing}`;
    chapterContent.style.width = `${pageWidth}px`;
    chapterContent.style.height = `${pageHeight}px`;
    chapterContent.style.padding = `${margin}px`;
    
    chapterTitleElement.textContent = chapterTitle;
    chapterContent.innerHTML = pages[currentPage].join('<br>');
    pageInfo.textContent = `Page ${currentPage + 1} of ${pages.length}`;
    
    document.getElementById('prev-page').disabled = currentPage === 0 && currentChapter === 1;
    document.getElementById('next-page').disabled = currentPage === pages.length - 1 && currentChapter === 17;
}

document.addEventListener('DOMContentLoaded', function() {
    const chapterList = document.getElementById('chapter-list');
    const characterList = document.getElementById('character-list');
    const worldMap = document.getElementById('world-map');
    const mapOverlay = document.getElementById('map-overlay');
    const quantumParticle = document.getElementById('quantum-particle');
    const totalChapters = 17;

    // Load chapters
    function loadChapters() {
        for (let i = 1; i <= totalChapters; i++) {
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            const a = document.createElement('a');
            a.href = `#chapter-${i}`;
            a.textContent = `Chapter ${i}`;
            a.classList.add('text-decoration-none');
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadChapter(i);
                // Close the accordion after selecting a chapter
                const accordion = document.getElementById('collapseChapters');
                const bsCollapse = new bootstrap.Collapse(accordion, {
                    toggle: false
                });
                bsCollapse.hide();
            });
            li.appendChild(a);
            chapterList.appendChild(li);
        }
    }

    // Load character profiles
    async function loadCharacterProfiles() {
        try {
            const response = await fetch('characters.json');
            if (!response.ok) throw new Error('Characters not found');
            const characters = await response.json();
            displayCharacters(characters.characters);
        } catch (error) {
            console.error('Error loading characters:', error);
            characterList.innerHTML = '<p class="alert alert-danger">Error loading characters. Please try again later.</p>';
        }
    }

    // Display character profiles
    function displayCharacters(characters) {
        characterList.innerHTML = '';
        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.classList.add('col-md-4', 'mb-4');
            characterCard.innerHTML = `
                <div class="card h-100">
                    <img src="images/${character.name.toLowerCase().replace(/ /g, '_')}.svg" class="card-img-top" alt="${character.name}" loading="lazy">
                    <div class="card-body">
                        <h5 class="card-title">${character.name}</h5>
                        <p class="card-text"><strong>Age:</strong> ${character.age}</p>
                        <p class="card-text"><strong>Role:</strong> ${character.role}</p>
                        <p class="card-text">${character.background}</p>
                    </div>
                </div>
            `;
            characterList.appendChild(characterCard);
        });
    }

    // Initialize world map
    function initWorldMap() {
        const locations = [
            { name: 'Oakridge Institute', x: 30, y: 40 },
            { name: 'Quantum Realm Portal', x: 70, y: 60 },
            { name: 'Zoe\'s Home', x: 20, y: 80 }
        ];

        locations.forEach(location => {
            const marker = document.createElement('div');
            marker.classList.add('map-marker');
            marker.style.left = `${location.x}%`;
            marker.style.top = `${location.y}%`;
            marker.title = location.name;
            marker.setAttribute('data-bs-toggle', 'tooltip');
            marker.setAttribute('data-bs-placement', 'top');
            mapOverlay.appendChild(marker);
        });

        // Initialize Bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Quantum particle animation
    function animateQuantumParticle() {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        quantumParticle.appendChild(canvas);
        const ctx = canvas.getContext('2d');

        const particles = [];
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                originalX: Math.random() * canvas.width,
                originalY: Math.random() * canvas.height,
            });
        }

        function drawParticle(particle) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(124, 77, 255, 0.8)';
            ctx.fill();
        }

        function updateParticle(particle) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx = -particle.vx;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy = -particle.vy;

            // Quantum "teleportation" effect
            if (Math.random() < 0.001) {
                particle.x = Math.random() * canvas.width;
                particle.y = Math.random() * canvas.height;
            }

            // Particle entanglement effect
            const dx = particle.x - particle.originalX;
            const dy = particle.y - particle.originalY;
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                updateParticle(particle);
                drawParticle(particle);
            });

            requestAnimationFrame(animate);
        }

        animate();
    }

    // Search functionality
    const searchInput = document.getElementById('chapter-search');
    const chapterAccordion = document.getElementById('collapseChapters');
    const bsCollapse = new bootstrap.Collapse(chapterAccordion, {
        toggle: false
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const chapterItems = chapterList.getElementsByTagName('li');
        let hasVisibleItems = false;
        
        for (let item of chapterItems) {
            const chapterTitle = item.textContent.toLowerCase();
            if (chapterTitle.includes(searchTerm)) {
                item.style.display = '';
                hasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        }

        if (hasVisibleItems) {
            bsCollapse.show();
        } else {
            bsCollapse.hide();
        }

        if (searchTerm === '') {
            for (let item of chapterItems) {
                item.style.display = '';
            }
            bsCollapse.hide();
        }
    });

    // Back to Top button
    const backToTopBtn = document.getElementById('back-to-top');
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.display = 'block';
        } else {
            backToTopBtn.style.display = 'none';
        }
    });

    backToTopBtn.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Initialize the website
    loadChapters();
    loadCharacterProfiles();
    initWorldMap();
    animateQuantumParticle();

    // Load first chapter by default
    loadChapter(1);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // E-reader controls
    document.getElementById('prev-page').addEventListener('click', previousPage);
    document.getElementById('next-page').addEventListener('click', nextPage);
    document.getElementById('font-size').addEventListener('input', (e) => updateFontSize(parseInt(e.target.value)));
    document.getElementById('line-spacing').addEventListener('input', (e) => updateLineSpacing(parseFloat(e.target.value)));
    document.getElementById('page-width').addEventListener('input', (e) => updatePageWidth(parseInt(e.target.value)));
    document.getElementById('page-height').addEventListener('input', (e) => updatePageHeight(parseInt(e.target.value)));
    document.getElementById('margin').addEventListener('input', (e) => updateMargin(parseInt(e.target.value)));

    // Update displayed values for range inputs
    document.getElementById('font-size').addEventListener('input', (e) => {
        document.getElementById('font-size-value').textContent = e.target.value;
    });
    document.getElementById('line-spacing').addEventListener('input', (e) => {
        document.getElementById('line-spacing-value').textContent = e.target.value;
    });
    document.getElementById('margin').addEventListener('input', (e) => {
        document.getElementById('margin-value').textContent = e.target.value;
    });
});