let trades = JSON.parse(localStorage.getItem('trades')) || [];

function saveTrades() {
  localStorage.setItem('trades', JSON.stringify(trades));
}

// ADD / EDIT TRADE
const form = document.getElementById('tradeForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const trade = {
      market: market.value,
      date: date.value,
      pair: pair.value,
      result: result.value,
      pl: result.value === 'win' ? 100 : -50,
      notes: notes.value
    };

    const editIndex = document.getElementById('editIndex').value;
    if (editIndex === '') {
      trades.push(trade);
    } else {
      trades[editIndex] = trade;
    }

    saveTrades();
    window.location.href = 'index.html';
  });
}

// LOAD DASHBOARD
function loadStats() {
  if (!document.getElementById('totalTrades')) return;

  const total = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const losses = trades.filter(t => t.result === 'loss').length;
  const monthlyPL = trades.reduce((a,b)=>a+b.pl,0);

  totalTrades.innerText = total;
  wins.innerText = wins;
  losses.innerText = losses;
  winRate.innerText = total ? Math.round((wins/total)*100)+'%' : '0%';
  monthlyPL.innerText = monthlyPL;

  renderTable();
}

function renderTable() {
  const tbody = document.querySelector('#tradeTable tbody');
  tbody.innerHTML = '';

  trades.forEach((t, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.market}</td>
      <td>${t.date}</td>
      <td>${t.pair}</td>
      <td>${t.result}</td>
      <td>${t.pl}</td>
      <td>
        <button onclick="editTrade(${i})">Edit</button>
        <button onclick="deleteTrade(${i})">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function deleteTrade(index) {
  if (confirm('Delete this trade?')) {
    trades.splice(index, 1);
    saveTrades();
    loadStats();
  }
}

function editTrade(index) {
  const t = trades[index];
  localStorage.setItem('editTrade', JSON.stringify({ ...t, index }));
  window.location.href = 'journal.html';
}

// LOAD EDIT DATA
const editData = JSON.parse(localStorage.getItem('editTrade'));
if (editData && form) {
  market.value = editData.market;
  date.value = editData.date;
  pair.value = editData.pair;
  result.value = editData.result;
  notes.value = editData.notes;
  editIndex.value = editData.index;
  localStorage.removeItem('editTrade');
}

if (document.getElementById('totalTrades')) loadStats();
