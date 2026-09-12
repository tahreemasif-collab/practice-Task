const passwordOut = document.getElementById('passwordOut');
const copyBtn = document.getElementById('copyBtn');
const regenBtn = document.getElementById('regenBtn');
const generateBtn = document.getElementById('generateBtn');
const lengthInput = document.getElementById('length');
const lengthVal = document.getElementById('lengthVal');
const upperCb = document.getElementById('upper');
const lowerCb = document.getElementById('lower');
const numbersCb = document.getElementById('numbers');
const symbolsCb = document.getElementById('symbols');
const excludeCb = document.getElementById('excludeAmbiguous');
const strengthFill = document.getElementById('strengthFill');
const strengthLabel = document.getElementById('strengthLabel');

const SETS = {
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lower: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}?'
};
const AMBIGUOUS = /[l1IO0]/g;

function secureRandomInt(max){
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0] % max;
}

function buildCharset(){
  let charset = '';
  if (upperCb.checked) charset += SETS.upper;
  if (lowerCb.checked) charset += SETS.lower;
  if (numbersCb.checked) charset += SETS.numbers;
  if (symbolsCb.checked) charset += SETS.symbols;
  if (excludeCb.checked) charset = charset.replace(AMBIGUOUS, '');
  return charset;
}

function generatePassword(){
  const length = Number(lengthInput.value);
  const charset = buildCharset();

  if (!charset){
    passwordOut.textContent = 'Select at least one character type';
    updateStrength('');
    return;
  }

  let password = '';
  for (let i = 0; i < length; i++){
    password += charset[secureRandomInt(charset.length)];
  }

  passwordOut.textContent = password;
  updateStrength(password);
}

function updateStrength(password){
  if (!password){
    strengthFill.style.width = '0%';
    strengthFill.style.background = 'transparent';
    strengthLabel.textContent = '—';
    return;
  }

  let variety = 0;
  if (/[A-Z]/.test(password)) variety++;
  if (/[a-z]/.test(password)) variety++;
  if (/[0-9]/.test(password)) variety++;
  if (/[^A-Za-z0-9]/.test(password)) variety++;

  const score = Math.min(100, (password.length / 32) * 60 + variety * 10);

  let label, color;
  if (score < 40){ label = 'weak'; color = '#e85f5c'; }
  else if (score < 70){ label = 'okay'; color = '#e8c547'; }
  else { label = 'strong'; color = '#3ddc84'; }

  strengthFill.style.width = `${score}%`;
  strengthFill.style.background = color;
  strengthLabel.textContent = label;
  strengthLabel.style.color = color;
}

lengthInput.addEventListener('input', () => {
  lengthVal.textContent = lengthInput.value;
  generatePassword();
});

[upperCb, lowerCb, numbersCb, symbolsCb, excludeCb].forEach(cb => {
  cb.addEventListener('change', generatePassword);
});

generateBtn.addEventListener('click', generatePassword);
regenBtn.addEventListener('click', generatePassword);

copyBtn.addEventListener('click', async () => {
  const text = passwordOut.textContent;
  if (!text || text.includes(' ')) return;
  try {
    await navigator.clipboard.writeText(text);
    const original = copyBtn.textContent;
    copyBtn.textContent = 'Copied';
    setTimeout(() => { copyBtn.textContent = original; }, 1200);
  } catch (e) {
    // clipboard API unavailable — fail silently
  }
});

generatePassword();
