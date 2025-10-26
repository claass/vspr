const body = document.body;
const themeRadios = document.querySelectorAll('input[name="theme"]');
const triadRadios = document.querySelectorAll('input[name="triad"]');
const reduceMotionToggle = document.getElementById('pref-reduce-motion');
const highContrastToggle = document.getElementById('pref-high-contrast');
const sansBodyToggle = document.getElementById('pref-sans-body');
const candleToggle = document.getElementById('candle-toggle');
const candleDescription = candleToggle?.querySelector('.toggle-candle__description');
const chalice = document.querySelector('.chalice');
const chaliceLiquid = document.querySelector('.chalice__liquid');
const chaliceStatus = document.querySelector('.chalice__status');
const coins = document.querySelectorAll('.coin');
const coinPanels = document.querySelectorAll('.coin-panel');
const chatOrb = document.querySelector('.chat-orb');
const chatToggle = document.getElementById('chat-toggle');
const explainSentences = document.querySelectorAll('.explainability__sentence');
const cards = document.querySelectorAll('.card');
const filaments = document.querySelectorAll('.filament');
const noiseOverlay = document.querySelector('.noise-overlay');
const noiseToggle = document.getElementById('noise-toggle');
const contrastStatus = document.getElementById('contrast-status');
const gamutStatus = document.getElementById('gamut-status');

// Theme switching
function setTheme(theme) {
  body.classList.remove('theme-night', 'theme-dawn');
  body.classList.add(`theme-${theme}`);
  updateContrast();
}

themeRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      setTheme(radio.value);
    }
  });
});

// Triad switching
function setTriad(triad) {
  body.classList.remove('triad-cyan-coral-peach', 'triad-jade-ember-opal', 'triad-azure-rose-softgold');
  body.classList.add(`triad-${triad}`);
}

triadRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    if (radio.checked) {
      setTriad(radio.value);
    }
  });
});

// Preference toggles
const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');
reduceMotionToggle.checked = motionMedia.matches;
applyReduceMotion(reduceMotionToggle.checked);

motionMedia.addEventListener('change', event => {
  if (!reduceMotionToggle.dataset.manual) {
    reduceMotionToggle.checked = event.matches;
    applyReduceMotion(event.matches);
  }
});

reduceMotionToggle.addEventListener('change', () => {
  reduceMotionToggle.dataset.manual = 'true';
  applyReduceMotion(reduceMotionToggle.checked);
});

highContrastToggle.addEventListener('change', () => {
  body.classList.toggle('hi-contrast', highContrastToggle.checked);
  updateContrast();
});

sansBodyToggle.addEventListener('change', () => {
  body.classList.toggle('prefers-sans-body', sansBodyToggle.checked);
});

function applyReduceMotion(enable) {
  body.classList.toggle('reduce-motion', enable);
  if (enable) {
    candleToggle?.setAttribute('data-motion', 'reduced');
    chatOrb?.classList.remove('is-thinking');
    stopChalice();
    if (chaliceStatus) {
      chaliceStatus.textContent = 'Progress paused (motion preference).';
    }
  } else {
    candleToggle?.removeAttribute('data-motion');
    if (chaliceStatus && chaliceProgress === 0) {
      chaliceStatus.textContent = 'Progress at 0%.';
    }
    scheduleChalice();
  }
}

// Candle toggle interactions
function updateCandleState(isLit) {
  candleToggle?.setAttribute('aria-checked', String(isLit));
  if (candleDescription) {
    candleDescription.textContent = isLit ? 'Lit' : 'Unlit';
  }
}

candleToggle?.addEventListener('click', () => {
  const current = candleToggle.getAttribute('aria-checked') === 'true';
  updateCandleState(!current);
});

candleToggle?.addEventListener('keydown', event => {
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    const current = candleToggle.getAttribute('aria-checked') === 'true';
    updateCandleState(!current);
  }
});

// Chalice progress simulation
let chaliceProgress = 0;
let chaliceTimer;

function advanceChalice() {
  chaliceProgress = Math.min(100, chaliceProgress + 10);
  chalice?.setAttribute('aria-valuenow', String(chaliceProgress));
  if (chaliceLiquid) {
    chaliceLiquid.style.height = `${chaliceProgress}%`;
  }
  if (chaliceStatus) {
    chaliceStatus.textContent = `Progress at ${chaliceProgress}%.`;
  }
  if (chaliceProgress === 100) {
    chalice?.classList.add('is-complete');
    setTimeout(() => chalice?.classList.remove('is-complete'), 120);
    setTimeout(() => {
      chaliceProgress = 0;
      if (chaliceLiquid) {
        chaliceLiquid.style.height = '0%';
      }
      if (chaliceStatus) {
        chaliceStatus.textContent = 'Progress at 0%.';
      }
      chalice?.setAttribute('aria-valuenow', '0');
      scheduleChalice();
    }, 1600);
  } else {
    scheduleChalice();
  }
}

function scheduleChalice() {
  if (!chalice) return;
  stopChalice();
  if (body.classList.contains('reduce-motion')) return;
  chaliceTimer = setTimeout(() => {
    advanceChalice();
  }, 1300);
}

scheduleChalice();

function stopChalice() {
  if (chaliceTimer) {
    clearTimeout(chaliceTimer);
    chaliceTimer = null;
  }
}

// Coin tab interactions
coins.forEach(coin => {
  coin.addEventListener('click', () => activateCoin(coin));
  coin.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateCoin(coin);
    }
  });
});

function activateCoin(targetCoin) {
  coins.forEach(coin => {
    const isActive = coin === targetCoin;
    coin.classList.toggle('is-active', isActive);
    coin.setAttribute('aria-selected', String(isActive));
    coin.tabIndex = isActive ? 0 : -1;
  });
  coinPanels.forEach(panel => {
    if (panel.id === targetCoin.dataset.target) {
      panel.hidden = false;
      panel.classList.add('is-active');
    } else {
      panel.hidden = true;
      panel.classList.remove('is-active');
    }
  });
}

// Chat orb
let thinking = false;
chatToggle?.addEventListener('click', () => {
  thinking = !thinking;
  chatOrb?.classList.toggle('is-thinking', thinking);
  chatOrb?.setAttribute('aria-label', thinking ? 'Thinking' : 'Listening');
  if (chatToggle) {
    chatToggle.textContent = thinking ? 'Pause Thinking' : 'Toggle Thinking';
  }
});

// Explainability filaments
function highlightCard(cardId) {
  cards.forEach(card => {
    const match = card.dataset.card === cardId;
    card.classList.toggle('is-highlighted', match);
  });
  explainSentences.forEach(sentence => {
    sentence.classList.toggle('is-active', sentence.dataset.card === cardId);
  });
  filaments.forEach(filament => {
    filament.classList.toggle('is-active', filament.classList.contains(`filament--${cardId}`));
  });
}

explainSentences.forEach(sentence => {
  sentence.addEventListener('click', () => highlightCard(sentence.dataset.card));
  sentence.addEventListener('focus', () => highlightCard(sentence.dataset.card));
});

// QA panel instrumentation
function parseColorToRGB(colorValue) {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = colorValue;
  const computed = ctx.fillStyle;
  const match = /^#?([\da-f]{6}|[\da-f]{8})$/i.exec(computed);
  if (match) {
    const hex = match[1];
    const bigint = parseInt(hex.substring(0, 6), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }
  const parts = computed.match(/\d+/g) || [0, 0, 0];
  return {
    r: Number(parts[0]),
    g: Number(parts[1]),
    b: Number(parts[2]),
  };
}

function relativeLuminance({ r, g, b }) {
  const channel = value => {
    const v = value / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  const R = channel(r);
  const G = channel(g);
  const B = channel(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function updateContrast() {
  const textColor = parseColorToRGB(getComputedStyle(body).color);
  const bgColor = parseColorToRGB(getComputedStyle(body).backgroundColor || '#000000');
  const lumText = relativeLuminance(textColor);
  const lumBg = relativeLuminance(bgColor);
  const ratio = (Math.max(lumText, lumBg) + 0.05) / (Math.min(lumText, lumBg) + 0.05);
  const passes = ratio >= 4.5;
  if (contrastStatus) {
    contrastStatus.textContent = `${ratio.toFixed(2)} : 1 ${passes ? 'AA Pass' : 'AA Fail'}`;
    contrastStatus.classList.toggle('qa-fail', !passes);
  }
}

updateContrast();

if (gamutStatus) {
  const supportsP3 = CSS.supports('color', 'color(display-p3 1 1 1)');
  gamutStatus.textContent = supportsP3 ? 'Display-P3 active' : 'sRGB fallback';
}

noiseToggle?.addEventListener('change', () => {
  noiseOverlay?.classList.toggle('is-active', noiseToggle.checked);
});

// Initialize coin focus order
activateCoin(document.querySelector('.coin.is-active') || coins[0]);

// Ensure candle default state
updateCandleState(false);

// Respect manual reduce motion for chat progression
if (body.classList.contains('reduce-motion')) {
  chatOrb?.classList.remove('is-thinking');
}
