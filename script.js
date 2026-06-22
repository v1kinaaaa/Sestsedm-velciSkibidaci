const startButton = document.getElementById('startButton');
const againButton = document.getElementById('againButton');
const templeBackButton = document.getElementById('templeBack');
const choiceSection = document.getElementById('choice');
const templeSection = document.getElementById('temple');
const resultSection = document.getElementById('result');
const introSection = document.getElementById('intro');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const templeText = document.getElementById('templeText');
const templeProgress = document.getElementById('templeProgress');
const choiceButtons = document.querySelectorAll('#choice .choice-button');
const templeButtons = document.querySelectorAll('.temple-button');
const questLogEl = document.getElementById('questLog');
const badgeArea = document.getElementById('badgeArea');
const badgeModal = document.getElementById('badgeModal');
const closeBadge = document.getElementById('closeBadge');
const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const imageModal = document.getElementById('imageModal');
const imagePreview = document.getElementById('imagePreview');
const closeImage = document.getElementById('closeImage');
let uploadedImage = null;

const outcomes = {
  meditation: {
    title: 'Meditace a klid',
    text: 'V buddhistické meditaci se naučíš sledovat dech, pozorovat myšlenky a vytvářet vnitřní mír. Sedíš na polštáři, vnímáš měkké světlo svíček a necháš tělo relaxovat. Každý nádech a výdech tě spojuje s tichou radostí a učí tě být zde a teď.',
  },
  wisdom: {
    title: 'Učení Buddhy',
    text: 'Buddha učí soucit, pravdu, vědomé konání a cestu k vnitřní svobodě. Ponořuješ se do čtyř vznešených pravd a Osmidílné cesty, kde každý krok pomáhá zlepšit tvé myšlení a chování. Tento duchovní poklad ti ukazuje, jak žít laskavě, moudře a s lehkostí v každodenním světě.',
  },
};

const templeActions = {
  garden: {
    text: 'Na nádvoří najdeš voňavé květiny, klidnou fontánu a marné místo pro tiché přemýšlení. Zastavíš se, vdechneš vůni kadidla a cítíš, jak se tvá mysl uklidňuje.',
  },
  monk: {
    text: 'Potkáš mnicha, který ti s úsměvem nabídne nápoj a laskavé slovo. Jeho příběh o soucitu ti pomůže pochopit, že laskavost může změnit den každému.',
  },
  lamp: {
    text: 'Zapalíš lampu před soškou Buddhy a sleduješ, jak se malý plamen třpytí. V tu chvíli cítíš, že světlo v chrámu je jako dobrý čin, který může rozsvítit srdce ostatních.',
  },
};

let templeProgressState = new Set();
const STORAGE_KEY = 'buddha_temple_progress';
const BADGES_KEY = 'buddha_badges';

function showSection(section) {
  [introSection, choiceSection, templeSection, resultSection].forEach((screen) => {
    screen.classList.remove('active');
  });
  section.classList.add('active');
}

function startTempleGame() {
  // load saved progress if present
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  templeProgressState = new Set(saved);
  templeText.textContent = 'Vstup do chrámu a vyber, co chceš jako první prozkoumat.';
  templeProgress.textContent = `Úkoly dokončené: ${templeProgressState.size}/${Object.keys(templeActions).length}`;
  updateQuestLog();
  showBadges();
  showSection(templeSection);
}

function updateTemple(action) {
  if (templeProgressState.has(action)) {
    templeText.textContent = 'Toto místo už jsi navštívil. Vyber jiné a pokračuj ve své hře po chrámu.';
    return;
  }

  const actionData = templeActions[action];
  if (!actionData) return;

  templeProgressState.add(action);
  templeText.textContent = actionData.text;
  templeProgress.textContent = `Úkoly dokončené: ${templeProgressState.size}/${Object.keys(templeActions).length}`;
  playTone(440, 0.12);
  animateButton(action);
  // persist progress
  localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(templeProgressState)));
  updateQuestLog();

  if (templeProgressState.size === Object.keys(templeActions).length) {
    templeText.textContent = 'Gratulujeme! Prošel jsi celý chrám a dokončil všechny herní úkoly. Tvá cesta je plná klidných okamžiků a síly Buddhy.';
    awardBadge('Chrámový průzkumník');
  }
  // show uploaded image if present
  if (uploadedImage) {
    showImageModal(uploadedImage);
  }
}

function animateButton(action) {
  const btn = document.querySelector(`.temple-button[data-action="${action}"]`);
  if (!btn) return;
  btn.classList.add('pulse');
  setTimeout(() => btn.classList.remove('pulse'), 900);
}

function playTone(freq = 440, time = 0.1) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    g.gain.setValueAtTime(0.001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time);
    o.stop(ctx.currentTime + time + 0.02);
  } catch (e) {
    // audio may be blocked in some environments
  }
}

function updateQuestLog() {
  const keys = Object.keys(templeActions);
  questLogEl.innerHTML = keys.map(k => {
    const done = templeProgressState.has(k);
    return `<div class="quest-item">${done ? '✅' : '🔲'} ${templeActions[k].textShort || templeActions[k].label || k}</div>`;
  }).join('');
}

function awardBadge(name) {
  // save badge
  const badges = JSON.parse(localStorage.getItem(BADGES_KEY) || '[]');
  if (!badges.includes(name)) {
    badges.push(name);
    localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
  }
  badgeArea.innerHTML = `<span class="badge">${name}</span>`;
  // show modal
  badgeModal.setAttribute('aria-hidden', 'false');
}

function showBadges() {
  const badges = JSON.parse(localStorage.getItem(BADGES_KEY) || '[]');
  if (badges.length) {
    badgeArea.innerHTML = badges.map(b => `<span class="badge">${b}</span>`).join(' ');
  } else {
    badgeArea.innerHTML = '';
  }
}

// keyboard navigation for temple actions
document.addEventListener('keydown', (e) => {
  if (!templeSection.classList.contains('active')) return;
  const buttons = Array.from(document.querySelectorAll('.temple-button'));
  const idx = buttons.findIndex(b => b === document.activeElement);
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    const next = buttons[(idx + 1) % buttons.length];
    next.focus();
    e.preventDefault();
  } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    const prev = buttons[(idx - 1 + buttons.length) % buttons.length];
    prev.focus();
    e.preventDefault();
  } else if (e.key === 'Enter') {
    if (document.activeElement && document.activeElement.classList.contains('temple-button')) {
      document.activeElement.click();
    }
  }
});

// close badge modal
closeBadge.addEventListener('click', () => {
  badgeModal.setAttribute('aria-hidden', 'true');
});

// image upload handling
imageInput.addEventListener('change', (e) => {
  const file = e.target.files && e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    uploadedImage = reader.result;
    // small preview in badge area
    badgeArea.innerHTML = `<img src="${uploadedImage}" alt="náhled" style="max-width:80px; border-radius:8px; box-shadow:0 8px 18px rgba(0,0,0,0.08);" />`;
    try {
      localStorage.setItem('buddha_uploaded_image', uploadedImage);
    } catch (err) {
      console.warn('Nelze uložit obrázek do localStorage (příliš velký).');
    }
    // set as hero image on main page
    const hero = document.querySelector('.hero-image');
    if (hero) hero.src = uploadedImage;
  };
  reader.readAsDataURL(file);
});

uploadImageBtn.addEventListener('click', () => {
  imageInput.click();
});

function showImageModal(src) {
  imagePreview.src = src;
  imageModal.setAttribute('aria-hidden', 'false');
}

closeImage.addEventListener('click', () => {
  imageModal.setAttribute('aria-hidden', 'true');
});

// close image modal on overlay click
imageModal.addEventListener('click', (e) => {
  if (e.target === imageModal) {
    imageModal.setAttribute('aria-hidden', 'true');
  }
});

// escape closes modals
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    badgeModal.setAttribute('aria-hidden', 'true');
    imageModal.setAttribute('aria-hidden', 'true');
  }
});

// emit uploaded image visually from a button on the main page
function emitImageFromButton(button) {
  if (!uploadedImage) return;
  const rect = button.getBoundingClientRect();
  const img = document.createElement('img');
  img.src = uploadedImage;
  img.className = 'emitted-image';
  // start centered on the button
  const size = Math.min(120, Math.max(72, rect.width));
  img.style.width = size + 'px';
  img.style.height = size + 'px';
  img.style.left = (rect.left + rect.width / 2 - size / 2) + 'px';
  img.style.top = (rect.top + rect.height / 2 - size / 2) + 'px';
  document.body.appendChild(img);
  // force layout then animate
  requestAnimationFrame(() => {
    img.classList.add('animate-up');
  });
  // after animation, open modal with full image
  setTimeout(() => {
    showImageModal(uploadedImage);
    img.remove();
  }, 520);
}

// attach to main page buttons: start and choice buttons
const mainStartButton = document.getElementById('startButton');
if (mainStartButton) {
  mainStartButton.addEventListener('click', (e) => {
    // emit image from this button if user uploaded one, then navigate
    if (uploadedImage) emitImageFromButton(e.currentTarget);
    showSection(choiceSection);
  });
}

const mainChoiceButtons = document.querySelectorAll('#choice .choice-button');
mainChoiceButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (uploadedImage) emitImageFromButton(e.currentTarget);
  });
});

// start button navigation is handled above to ensure emission animation

// on load: restore uploaded image if present
(() => {
  try {
    const saved = localStorage.getItem('buddha_uploaded_image');
    if (saved) {
      uploadedImage = saved;
      badgeArea.innerHTML = `<img src="${uploadedImage}" alt="náhled" style="max-width:80px; border-radius:8px; box-shadow:0 8px 18px rgba(0,0,0,0.08);" />`;
      const hero = document.querySelector('.hero-image');
      if (hero) hero.src = uploadedImage;
    }
  } catch (e) {
    // ignore storage errors
  }
})();

choiceButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const choice = button.dataset.choice;

    if (choice === 'temples') {
      startTempleGame();
      return;
    }

    const outcome = outcomes[choice];
    if (!outcome) return;

    resultTitle.textContent = outcome.title;
    resultText.textContent = outcome.text;
    showSection(resultSection);
  });
});

templeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    updateTemple(action);
  });
});

templeBackButton.addEventListener('click', () => {
  showSection(choiceSection);
});

againButton.addEventListener('click', () => {
  showSection(introSection);
});
