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

function showSection(section) {
  [introSection, choiceSection, templeSection, resultSection].forEach((screen) => {
    screen.classList.remove('active');
  });
  section.classList.add('active');
}

function startTempleGame() {
  templeProgressState = new Set();
  templeText.textContent = 'Vstup do chrámu a vyber, co chceš jako první prozkoumat.';
  templeProgress.textContent = `Úkoly dokončené: 0/${Object.keys(templeActions).length}`;
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

  if (templeProgressState.size === Object.keys(templeActions).length) {
    templeText.textContent = 'Gratulujeme! Prošel jsi celý chrám a dokončil všechny herní úkoly. Tvá cesta je plná klidných okamžiků a síly Buddhy.';
  }
}

startButton.addEventListener('click', () => {
  showSection(choiceSection);
});

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
