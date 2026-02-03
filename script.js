// FIXED script.js – fully working add / edit / delete / stats

let trades = JSON.parse(localStorage.getItem('trades')) || [];
let editIndex = null;

document.addEventListener('DOMContentLoaded', () => {
  renderDashboard();
});

function saveTrade(e) {
  e.preventDefault();

  const market = document.getElementById('market').value;
  const date = document.getElementById('date').value;
  const pair = document.getElementById('pair').value;
  const result = document.getElementById('result').value;
  const pl = document.getElementById('pl').value;

  const trade = { market, date, pair, result, pl };

  if (editIndex !== null) {
    trades[editIndex] = trade;
    editIndex = null;
  } else {
    trades.push(trade);
  }

  localStorage.setItem('trades', JSON.stringify(trades));
  window.location.href = 'index.html';
}

function renderDashboard() {
  const tbody = document.getElementById('tradeTable');
  if (!tbody) return;

  tbody.innerHTML = '';

  let wins = 0;
  let losses = 0;

  trades.forEach((t, i) => {
    if (t.result === 'win') wins++;
    if (t.result === 'loss') losses++;

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

  document.getElementById('totalTrades').innerText = trades.length;
  document.getElementById('wins').innerText = wins;
  document.getElementById('losses').innerText = losses;
  document.getElementById('winRate').innerText = trades.length
    ? Math.round((wins / trades.length) * 100) + '%'
    : '0%';
}

function deleteTrade(i) {
  if (confirm('Delete this trade?')) {
    trades.splice(i, 1);
    localStorage.setItem('trades', JSON.stringify(trades));
    renderDashboard();
  }
}

function editTrade(i) {
  localStorage.setItem('editIndex', i);
  window.location.href = 'journal.html';
}

function loadEditTrade() {
  const i = localStorage.getItem('editIndex');
  if (i === null) return;

  const t = trades[i];
  editIndex = i;

  document.getElementById('market').value = t.market;
  document.getElementById('date').value = t.date;
  document.getElementById('pair').value = t.pair;
  document.getElementById('result').value = t.result;
  document.getElementById('pl').value = t.pl;
}
