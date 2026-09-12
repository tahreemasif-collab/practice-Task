const LO = 1, HI = 100, MAX_TRIES = 7;

const guessForm = document.getElementById('guessForm');
const guessInput = document.getElementById('guessInput');
const hint = document.getElementById('hint');
const triesLeft = document.getElementById('triesLeft');
const bestScore = document.getElementById('bestScore');
const history = document.getElementById('history');
const meterFill = document.getElementById('meterFill');
const roundEl = document.getElementById('round');
const newGameBtn = document.getElementById('newGame');

document.getElementById('lo').textContent = LO;
document.getElementById('hi').textContent = HI;

let secret = 0;
let tries = 0;
let round = 1;
let best = null;
let over = false;

function startRound(){
  secret = Math.floor(Math.random() * (HI - LO + 1)) + LO;
  tries = 0;
  over = false;
  triesLeft.textContent = MAX_TRIES;
  hint.textContent = "I'm thinking of a number — take a guess.";
  history.innerHTML = '';
  meterFill.style.width = '100%';
  guessInput.value = '';
  guessInput.disabled = false;
  guessInput.focus();
  roundEl.textContent = round;
}

guessForm.addEventListener('submit', (e) => {
  e.preventDefault();
  if (over) return;

  const guess = Number(guessInput.value);
  if (!guess || guess < LO || guess > HI) return;

  tries += 1;
  const remaining = MAX_TRIES - tries;
  triesLeft.textContent = Math.max(remaining, 0);
  meterFill.style.width = `${(remaining / MAX_TRIES) * 100}%`;

  const li = document.createElement('li');

  if (guess === secret){
    li.textContent = `${guess} — correct!`;
    li.classList.add('win');
    history.prepend(li);
    hint.textContent = `Nailed it in ${tries} ${tries === 1 ? 'try' : 'tries'}. Nice.`;
    over = true;
    guessInput.disabled = true;
    if (best === null || tries < best){
      best = tries;
      bestScore.textContent = best;
    }
    round += 1;
    return;
  }

  li.textContent = guess;
  li.classList.add(guess < secret ? 'low' : 'high');
  history.prepend(li);

  if (guess < secret){
    hint.textContent = 'Higher than that.';
  } else {
    hint.textContent = 'Lower than that.';
  }

  if (remaining <= 0){
    hint.textContent = `Out of tries — it was ${secret}.`;
    over = true;
    guessInput.disabled = true;
    round += 1;
  }

  guessInput.value = '';
  guessInput.focus();
});

newGameBtn.addEventListener('click', startRound);

startRound();
