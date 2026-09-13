document.addEventListener('DOMContentLoaded', () => {
    // --- State Management ---
    let currentLang = localStorage.getItem('ramyaLanguage') || 'en';
    let currentTheme = localStorage.getItem('ramyaTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    let currentFilter = 'all';
    let modalFontSize = 1.12;

    // --- DOM Elements ---
    const enBtn = document.getElementById('enBtn');
    const taBtn = document.getElementById('taBtn');
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = document.getElementById('themeIcon');
    const writingCardsGrid = document.getElementById('writingCardsGrid');
    const booksContainer = document.getElementById('booksContainer');
    const notesListContainer = document.getElementById('notesListContainer');
    const filterButtons = document.querySelectorAll('#writingFilterBar .filter-btn');
    const quoteText = document.getElementById('quoteText');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    const contactForm = document.getElementById('contactForm');
    
    // Modal Elements
    const readerModalOverlay = document.getElementById('readerModalOverlay');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const modalCategoryTag = document.getElementById('modalCategoryTag');
    const modalTitle = document.getElementById('modalTitle');
    const modalDate = document.getElementById('modalDate');
    const modalReadTime = document.getElementById('modalReadTime');
    const modalBodyContent = document.getElementById('modalBodyContent');
    const fontSizeInc = document.getElementById('fontSizeInc');
    const fontSizeDec = document.getElementById('fontSizeDec');
    const readAloudBtn = document.getElementById('readAloudBtn');

    // --- Toast Notification System ---
    function showToast(message, icon = '✨') {
        const toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) return;

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    }

    // --- Language Switcher ---
    function setLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        localStorage.setItem('ramyaLanguage', lang);

        enBtn.classList.toggle('active', lang === 'en');
        taBtn.classList.toggle('active', lang === 'ta');

        // Update static text elements
        document.querySelectorAll('[data-en]').forEach(el => {
            if (el.dataset[lang]) {
                el.textContent = el.dataset[lang];
            }
        });

        // Re-render dynamic components
        renderWritings(currentFilter);
        renderBooks();
        renderNotes();
        shuffleQuote();
    }

    enBtn.addEventListener('click', () => setLanguage('en'));
    taBtn.addEventListener('click', () => setLanguage('ta'));

    // --- Theme Switcher ---
    function setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('ramyaTheme', theme);
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    themeToggleBtn.addEventListener('click', () => {
        setTheme(currentTheme === 'light' ? 'dark' : 'light');
        showToast(currentTheme === 'dark' ? 'Midnight Library Mode' : 'Warm Paper Mode', '🎨');
    });

    // --- Quote Shuffle ---
    function shuffleQuote() {
        if (!websiteData || !websiteData.quotes) return;
        const quotes = websiteData.quotes;
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        quoteText.textContent = currentLang === 'ta' ? randomQuote.ta : randomQuote.en;
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', () => {
            shuffleQuote();
            showToast(currentLang === 'ta' ? 'புதிய சிந்தனை புதுப்பிக்கப்பட்டது!' : 'New reflection loaded!', '💭');
        });
    }

    // --- Render Writings ---
    function renderWritings(filter = 'all') {
        if (!writingCardsGrid || !websiteData || !websiteData.writings) return;
        writingCardsGrid.innerHTML = '';

        const filtered = websiteData.writings.filter(item => {
            if (filter === 'all') return true;
            return item.category === filter;
        });

        filtered.forEach(item => {
            const card = document.createElement('article');
            card.className = 'writing-card';

            const title = currentLang === 'ta' ? item.title_ta : item.title_en;
            const excerpt = currentLang === 'ta' ? item.excerpt_ta : item.excerpt_en;
            const readTime = currentLang === 'ta' ? item.readTime_ta : item.readTime_en;
            const tagLabel = item.category.toUpperCase();

            card.innerHTML = `
                <div class="card-meta">
                    <span class="tag-badge">${tagLabel}</span>
                    <span class="read-time">${readTime}</span>
                </div>
                <h3>${title}</h3>
                <p>${excerpt}</p>
                <div class="card-link">
                    ${currentLang === 'ta' ? 'தொடர்ந்து படிக்க →' : 'Read Article →'}
                </div>
            `;

            card.addEventListener('click', () => openReaderModal(item));
            writingCardsGrid.appendChild(card);
        });
    }

    // Filter Buttons Listener
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderWritings(currentFilter);
        });
    });

    // --- Render Books ---
    function renderBooks() {
        if (!booksContainer || !websiteData || !websiteData.books) return;
        booksContainer.innerHTML = '';

        websiteData.books.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';

            const title = currentLang === 'ta' ? book.title_ta : book.title_en;
            const subtitle = currentLang === 'ta' ? book.subtitle_ta : book.subtitle_en;
            const description = currentLang === 'ta' ? book.description_ta : book.description_en;
            const statusTag = currentLang === 'ta' ? book.status_ta : book.status_en;

            bookCard.innerHTML = `
                <div>
                    <img src="${book.coverImage}" alt="${title}" class="book-cover-img" loading="lazy">
                </div>
                <div class="book-info">
                    <span class="tag-badge" style="margin-bottom: 12px; display: inline-block;">${statusTag}</span>
                    <h3>${title}</h3>
                    <div class="book-subtitle">${subtitle}</div>
                    <p class="book-desc">${description}</p>
                    <div class="book-actions">
                        <button class="btn btn-primary btn-sm preview-book-btn">${currentLang === 'ta' ? 'புத்தக மாதிரி பார்க்க' : 'Preview Book'}</button>
                        <a href="${book.amazonLink}" target="_blank" rel="noopener" class="btn btn-secondary btn-sm">${currentLang === 'ta' ? 'அமேசானில் வாங்க' : 'Buy on Amazon'}</a>
                    </div>
                </div>
            `;

            bookCard.querySelector('.preview-book-btn').addEventListener('click', () => {
                openBookPreviewModal(book);
            });

            booksContainer.appendChild(bookCard);
        });
    }

    // --- Render Notes ---
    function renderNotes() {
        if (!notesListContainer || !websiteData || !websiteData.writings) return;
        notesListContainer.innerHTML = '';

        const notes = websiteData.writings.filter(w => w.category === 'notes' || w.category === 'essays').slice(0, 3);

        notes.forEach((note, index) => {
            const noteItem = document.createElement('div');
            noteItem.className = 'note-item';

            const title = currentLang === 'ta' ? note.title_ta : note.title_en;
            const excerpt = currentLang === 'ta' ? note.excerpt_ta : note.excerpt_en;

            noteItem.innerHTML = `
                <div class="note-number">0${index + 1}</div>
                <div class="note-content">
                    <h3>${title}</h3>
                    <p>${excerpt}</p>
                </div>
                <button class="btn btn-secondary btn-sm">${currentLang === 'ta' ? 'வாசிக்க →' : 'Read Note →'}</button>
            `;

            noteItem.addEventListener('click', () => openReaderModal(note));
            notesListContainer.appendChild(noteItem);
        });
    }

    // --- Reader Modal Functions ---
    function openReaderModal(item) {
        if (!readerModalOverlay) return;

        modalCategoryTag.textContent = item.category.toUpperCase();
        modalTitle.textContent = currentLang === 'ta' ? item.title_ta : item.title_en;
        modalDate.textContent = item.date;
        modalReadTime.textContent = currentLang === 'ta' ? item.readTime_ta : item.readTime_en;
        
        modalBodyContent.innerHTML = currentLang === 'ta' ? item.content_ta : item.content_en;
        modalBodyContent.style.fontSize = `${modalFontSize}rem`;

        readerModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function openBookPreviewModal(book) {
        if (!readerModalOverlay) return;

        modalCategoryTag.textContent = 'BOOK PREVIEW';
        modalTitle.textContent = currentLang === 'ta' ? book.title_ta : book.title_en;
        modalDate.textContent = book.pages;
        modalReadTime.textContent = book.isbn;

        const sampleText = currentLang === 'ta' ? book.sampleText_ta : book.sampleText_en;
        const desc = currentLang === 'ta' ? book.description_ta : book.description_en;

        modalBodyContent.innerHTML = `
            <div style="text-align: center; margin-bottom: 24px;">
                <img src="${book.coverImage}" alt="${book.title_en}" style="max-width: 180px; margin: 0 auto; border-radius: 12px; box-shadow: var(--shadow-md);">
            </div>
            <p><strong>${desc}</strong></p>
            <h3>${currentLang === 'ta' ? 'புத்தகத்தின் ஒரு பகுதி:' : 'Excerpts & Sample Verse:'}</h3>
            <blockquote>${sampleText}</blockquote>
            <p style="text-align: center; margin-top: 30px;">
                <a href="${book.amazonLink}" target="_blank" rel="noopener" class="btn btn-primary">${currentLang === 'ta' ? 'முழு புத்தகத்தையும் பெற அமேசான் செல்லவும்' : 'Get Full Copy on Amazon'}</a>
            </p>
        `;

        readerModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeReaderModal() {
        if (!readerModalOverlay) return;
        readerModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        if (window.speechSynthesis) window.speechSynthesis.cancel();
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeReaderModal);
    if (readerModalOverlay) {
        readerModalOverlay.addEventListener('click', (e) => {
            if (e.target === readerModalOverlay) closeReaderModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeReaderModal();
    });

    // Font Resizing Controls
    if (fontSizeInc) {
        fontSizeInc.addEventListener('click', () => {
            if (modalFontSize < 1.5) {
                modalFontSize += 0.1;
                modalBodyContent.style.fontSize = `${modalFontSize}rem`;
            }
        });
    }

    if (fontSizeDec) {
        fontSizeDec.addEventListener('click', () => {
            if (modalFontSize > 0.9) {
                modalFontSize -= 0.1;
                modalBodyContent.style.fontSize = `${modalFontSize}rem`;
            }
        });
    }

    // Speech Synthesis Audio Read-Aloud
    if (readAloudBtn) {
        readAloudBtn.addEventListener('click', () => {
            if (!('speechSynthesis' in window)) {
                showToast('Audio playback not supported in this browser.', '⚠️');
                return;
            }

            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
                showToast('Audio playback stopped.', '🔇');
                return;
            }

            const textToRead = `${modalTitle.textContent}. ${modalBodyContent.textContent}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);
            utterance.lang = currentLang === 'ta' ? 'ta-IN' : 'en-US';
            utterance.rate = 0.95;

            utterance.onstart = () => showToast('Playing audio reader...', '🔊');
            utterance.onend = () => showToast('Finished audio reader.', '✅');

            window.speechSynthesis.speak(utterance);
        });
    }

    // --- Contact Form Handling ---
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName').value;
            const message = currentLang === 'ta'
                ? `நன்றி ${name}! உங்கள் மடல் பெறப்பட்டது. ரம்யா விரைவில் பதிலளிப்பார்.`
                : `Thank you ${name}! Your message has been received. Ramya will respond soon.`;
            
            showToast(message, '📬');
            contactForm.reset();
        });
    }

    // --- Initial Setup Execution ---
    setTheme(currentTheme);
    setLanguage(currentLang);

    // --- Hide Page Preloader ---
    const pagePreloader = document.getElementById('pagePreloader');
    if (pagePreloader) {
        setTimeout(() => {
            pagePreloader.style.opacity = '0';
            setTimeout(() => {
                pagePreloader.style.display = 'none';
            }, 500);
        }, 400);
    }
});
