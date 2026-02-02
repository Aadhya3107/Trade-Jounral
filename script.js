let trades = JSON.parse(localStorage.getItem('trades')) || [];

function saveTrades() {
  localStorage.setItem('trades', JSON.stringify(trades));
}

// ADD TRADE
const form = document.getElementById('tradeForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const trade = {
      date: date.value,
      pair: pair.value,
      result: result.value,
      pl: result.value === 'win' ? 100 : -50,
      notes: notes.value
    };
    trades.push(trade);
    saveTrades();
    alert('Trade Saved');
    form.reset();
  });
}

// DASHBOARD
function loadStats() {
  if (!document.getElementById('totalTrades')) return;

  const total = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const losses = trades.filter(t => t.result === 'loss').length;
  const monthlyPL = trades.reduce((a,b)=>a+b.pl,0);

  totalTrades.innerText = total;
  winsEl.innerText = wins;
  lossesEl.innerText = losses;
  winRate.innerText = total ? Math.round((wins/total)*100)+'%' : '0%';
  monthlyPL.innerText = monthlyPL;

  renderTable();
  renderChart();
}

function renderTable() {
  const tbody = document.querySelector('#tradeTable tbody');
  tbody.innerHTML = '';
  trades.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `<td>${t.date}</td><td>${t.pair}</td><td>${t.result}</td><td>${t.pl}</td><td>${t.notes}</td>`;
    tbody.appendChild(row);
  });
}

function renderChart() {
  const ctx = document.getElementById('plChart');
  if (!ctx) return;
  const labels = trades.map(t => t.date);
  const data = trades.map(t => t.pl);

  new Chart(ctx, {
    type: 'line',
    data: { labels, datasets: [{ label: 'P/L', data }] },
  });
}

if (document.getElementById('totalTrades')) loadStats();
