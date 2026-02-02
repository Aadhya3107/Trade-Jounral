let trades = JSON.parse(localStorage.getItem('trades')) || [];

const form = document.getElementById('tradeForm');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const trade = {
      date: date.value,
      pair: pair.value,
      result: result.value,
      notes: notes.value
    };
    trades.push(trade);
    localStorage.setItem('trades', JSON.stringify(trades));
    alert('Trade Saved');
    form.reset();
  });
}

function loadStats() {
  const total = trades.length;
  const wins = trades.filter(t => t.result === 'win').length;
  const losses = trades.filter(t => t.result === 'loss').length;
  document.getElementById('totalTrades').innerText = total;
  document.getElementById('wins').innerText = wins;
  document.getElementById('losses').innerText = losses;
  document.getElementById('winRate').innerText = total ? Math.round((wins/total)*100) + '%' : '0%';
}

if (document.getElementById('totalTrades')) loadStats();