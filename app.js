// Vesper - Simple Tarot App
// Pure vanilla JavaScript implementation

// State
let allCards = [];
let currentReading = null;
let readingHistory = [];

// DOM Elements
const drawSection = document.getElementById('draw-section');
const readingSection = document.getElementById('reading-section');
const cardsDisplay = document.getElementById('cards-display');
const historyList = document.getElementById('history-list');
const drawOneBtn = document.getElementById('draw-one');
const drawThreeBtn = document.getElementById('draw-three');
const saveReadingBtn = document.getElementById('save-reading');
const newReadingBtn = document.getElementById('new-reading');
const clearHistoryBtn = document.getElementById('clear-history');

// Initialize app
async function init() {
    await loadCards();
    loadHistory();
    setupEventListeners();
    renderHistory();
}

// Load tarot cards from JSON
async function loadCards() {
    try {
        const response = await fetch('cards.json');
        const data = await response.json();
        allCards = data.cards;
    } catch (error) {
        console.error('Error loading cards:', error);
        allCards = getDefaultCards();
    }
}

// Setup event listeners
function setupEventListeners() {
    drawOneBtn.addEventListener('click', () => drawCards(1));
    drawThreeBtn.addEventListener('click', () => drawCards(3));
    saveReadingBtn.addEventListener('click', saveReading);
    newReadingBtn.addEventListener('click', resetToDrawSection);
    clearHistoryBtn.addEventListener('click', clearHistory);
}

// Fisher-Yates shuffle algorithm
function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Draw cards
function drawCards(count) {
    const shuffled = shuffle(allCards);
    currentReading = {
        cards: shuffled.slice(0, count),
        date: new Date().toISOString(),
        timestamp: Date.now()
    };

    displayReading();
}

// Display current reading
function displayReading() {
    // Hide draw section, show reading section
    drawSection.classList.add('hidden');
    readingSection.classList.remove('hidden');

    // Clear previous cards
    cardsDisplay.innerHTML = '';

    // Render cards
    currentReading.cards.forEach((card, index) => {
        const cardElement = createCardElement(card, index);
        cardsDisplay.appendChild(cardElement);
    });
}

// Create card element
function createCardElement(card, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'tarot-card';

    const positions = ['Past', 'Present', 'Future'];
    const position = currentReading.cards.length === 3 ? positions[index] : '';

    cardDiv.innerHTML = `
        ${position ? `<div class="card-position">${position}</div>` : ''}
        <h3 class="card-name">${card.name}</h3>
        <p class="card-description">${card.description}</p>
    `;

    return cardDiv;
}

// Save reading to history
function saveReading() {
    if (!currentReading) return;

    readingHistory.unshift(currentReading);

    // Keep only last 20 readings
    if (readingHistory.length > 20) {
        readingHistory = readingHistory.slice(0, 20);
    }

    saveHistory();
    renderHistory();

    // Show confirmation
    showToast('Reading saved to history');
}

// Reset to draw section
function resetToDrawSection() {
    currentReading = null;
    readingSection.classList.add('hidden');
    drawSection.classList.remove('hidden');
}

// Load history from localStorage
function loadHistory() {
    try {
        const stored = localStorage.getItem('vesper-readings');
        if (stored) {
            readingHistory = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading history:', error);
        readingHistory = [];
    }
}

// Save history to localStorage
function saveHistory() {
    try {
        localStorage.setItem('vesper-readings', JSON.stringify(readingHistory));
    } catch (error) {
        console.error('Error saving history:', error);
    }
}

// Render history
function renderHistory() {
    if (readingHistory.length === 0) {
        historyList.innerHTML = '<p class="empty-state">No readings yet. Draw your first cards!</p>';
        clearHistoryBtn.classList.add('hidden');
        return;
    }

    historyList.innerHTML = '';
    clearHistoryBtn.classList.remove('hidden');

    readingHistory.forEach((reading, index) => {
        const readingElement = createHistoryElement(reading, index);
        historyList.appendChild(readingElement);
    });
}

// Create history element
function createHistoryElement(reading, index) {
    const div = document.createElement('div');
    div.className = 'history-item';

    const date = new Date(reading.date);
    const dateStr = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
    });

    const cardNames = reading.cards.map(c => c.name).join(' • ');

    div.innerHTML = `
        <div class="history-header">
            <span class="history-date">${dateStr}</span>
            <button class="btn-delete" data-index="${index}">×</button>
        </div>
        <div class="history-cards">${cardNames}</div>
    `;

    // Add delete functionality
    const deleteBtn = div.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', () => deleteReading(index));

    // Add click to view
    div.addEventListener('click', (e) => {
        if (!e.target.classList.contains('btn-delete')) {
            viewReading(reading);
        }
    });

    return div;
}

// Delete reading
function deleteReading(index) {
    readingHistory.splice(index, 1);
    saveHistory();
    renderHistory();
    showToast('Reading deleted');
}

// View a past reading
function viewReading(reading) {
    currentReading = reading;
    displayReading();

    // Hide save button since it's already saved
    saveReadingBtn.style.display = 'none';
}

// Clear all history
function clearHistory() {
    if (confirm('Are you sure you want to clear all reading history?')) {
        readingHistory = [];
        saveHistory();
        renderHistory();
        showToast('History cleared');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// Default cards fallback
function getDefaultCards() {
    return [
        {
            id: 'major-0',
            name: 'The Fool',
            description: 'New beginnings, spontaneity, and infinite potential await. The Fool invites you to take a leap of faith and trust in the journey ahead.'
        },
        {
            id: 'major-1',
            name: 'The Magician',
            description: 'You have all the tools you need to manifest your desires. The Magician represents resourcefulness and power to transform ideas into reality.'
        },
        {
            id: 'major-2',
            name: 'The High Priestess',
            description: 'Trust your intuition and inner wisdom. The High Priestess encourages you to look beyond the surface and explore the mysteries within.'
        }
    ];
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
