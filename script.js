// LOAD TRADES
let trades = JSON.parse(localStorage.getItem('trades')) || [];

function saveTrades() {
  localStorage.setItem('trades', JSON.stringify(trades));
}

// ADD / EDIT TRADE
const form = document.getElementById('tradeForm');
if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const trade = {
      market: document.getElementById('market').value,
      date: document.getElementById('date').value,
      pair: document.getElementById('pair').value,
      result: document.getElementById('result').value,
      pl: document.getElementById('result').value === 'win' ? 100 : -50,
      notes: document.getElementById('notes').value
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

// DASHBOARD STATS
function loadStats() {
  if (!document.getElementById('totalTrades')) return;

  const total = trades.length;
  const winsCount = trades.filter(t => t.result === 'win').length;
  const lossesCount = trades.filter(t => t.result === 'loss').length;

  document.getElementById('totalTrades').innerText = total;
  document.getElementById('wins').innerText = winsCount;
  document.getElementById('losses').innerText = lossesCount;
  document.getElementById('winRate').innerText = total ? Math.round((winsCount / total) * 100) + '%' : '0%';

  renderTable();
}

// TABLE RENDER
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

// DELETE
function deleteTrade(index) {
  if (confirm('Delete this trade?')) {
    trades.splice(index, 1);
    saveTrades();
    loadStats();
  }
}

// EDIT
function editTrade(index) {
  localStorage.setItem('editTrade', JSON.stringify({ ...trades[index], index }));
  window.location.href = 'journal.html';
}

// LOAD EDIT DATA
const editData = JSON.parse(localStorage.getItem('editTrade'));
if (editData && form) {
  document.getElementById('market').value = editData.market;
  document.getElementById('date').value = editData.date;
  document.getElementById('pair').value = editData.pair;
  document.getElementById('result').value = editData.result;
  document.getElementById('notes').value = editData.notes;
  document.getElementById('editIndex').value = editData.index;
  localStorage.removeItem('editTrade');
}

// INIT
if (document.getElementById('totalTrades')) loadStats();
