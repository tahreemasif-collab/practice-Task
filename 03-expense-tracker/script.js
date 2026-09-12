const entryForm = document.getElementById('entryForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const entryList = document.getElementById('entryList');
const emptyState = document.getElementById('emptyState');
const balanceEl = document.getElementById('balance');
const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const clearAllBtn = document.getElementById('clearAll');

let entries = [];

function fmt(n){
  return 'Rs ' + n.toLocaleString(undefined, { maximumFractionDigits: 2 });
}

function render(){
  entryList.innerHTML = '';
  emptyState.style.display = entries.length ? 'none' : 'block';

  let income = 0, expense = 0;

  // newest first
  [...entries].reverse().forEach(entry => {
    if (entry.type === 'income') income += entry.amount;
    else expense += entry.amount;

    const li = document.createElement('li');
    const date = new Date(entry.ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    li.innerHTML = `
      <div class="entry-row">
        <div>
          <span class="entry-title">${entry.title}</span>
          <span class="entry-meta">${date} · ${entry.type}</span>
        </div>
      </div>
      <div class="entry-row" style="flex:0; align-items:center;">
        <span class="entry-amount ${entry.type}">${entry.type === 'expense' ? '-' : '+'}${fmt(entry.amount)}</span>
        <button class="remove-btn" data-id="${entry.id}" aria-label="Remove entry">×</button>
      </div>
    `;
    entryList.appendChild(li);
  });

  totalIncomeEl.textContent = fmt(income);
  totalExpenseEl.textContent = fmt(expense);
  balanceEl.textContent = fmt(income - expense);
}

entryForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;
  if (!title || !amount || amount <= 0) return;

  entries.push({ id: Date.now(), title, amount, type, ts: Date.now() });
  titleInput.value = '';
  amountInput.value = '';
  titleInput.focus();
  render();
});

entryList.addEventListener('click', (e) => {
  const btn = e.target.closest('.remove-btn');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  entries = entries.filter(entry => entry.id !== id);
  render();
});

clearAllBtn.addEventListener('click', () => {
  if (!entries.length) return;
  entries = [];
  render();
});

render();
