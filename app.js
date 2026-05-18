
let expenses = JSON.parse(localStorage.getItem('expenseDesk') || '[]');


window.addEventListener('DOMContentLoaded', () => {
  
  document.getElementById('date').valueAsDate = new Date();
  renderTable();
  updateSummary();
});


function addExpense() {
  const amount   = parseFloat(document.getElementById('amount').value);
  const reason   = document.getElementById('reason').value.trim();
  const bank     = document.getElementById('bank').value;
  const category = document.getElementById('category').value;
  const date     = document.getElementById('date').value;
  const msg      = document.getElementById('formMsg');


  if (!amount || amount <= 0) return showMsg(' Please enter a valid amount.', 'error');
  if (!reason)                return showMsg('Please enter a reason.', 'error');
  if (!bank)                  return showMsg(' Please select a bank.', 'error');
  if (!category)              return showMsg(' Please select a category.', 'error');
  if (!date)                  return showMsg('Please pick a date.', 'error');

  const entry = {
    id: Date.now(),
    amount,
    reason,
    bank,
    category,
    date
  };

  expenses.unshift(entry);   
  save();
  renderTable();
  updateSummary();
  resetForm();
  showMsg('✅ Expense added!', 'success');
}


function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  save();
  renderTable();
  updateSummary();
}


function renderTable() {
  const filterCat      = document.getElementById('filterCategory').value;
  const filterBank     = document.getElementById('filterBank').value;
  const filterDateFrom = document.getElementById('filterDateFrom').value;
  const filterDateTo   = document.getElementById('filterDateTo').value;

  
  let filtered = expenses.filter(e => {
    if (filterCat  && e.category !== filterCat)  return false;
    if (filterBank && e.bank     !== filterBank)  return false;
    if (filterDateFrom && e.date < filterDateFrom) return false;
    if (filterDateTo   && e.date > filterDateTo)   return false;
    return true;
  });

  const tbody     = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  tbody.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.add('show');
    return;
  }
  emptyState.classList.remove('show');

  filtered.forEach((e, index) => {
    const { amountClass, rowClass } = getAmountStyle(e.amount);
    const formattedDate   = formatDate(e.date);
    const formattedAmount = `$${e.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    const tr = document.createElement('tr');
    tr.className = rowClass;
    tr.innerHTML = `
      <td style="color:var(--muted);font-family:'DM Mono',monospace;">${index + 1}</td>
      <td style="white-space:nowrap;">${formattedDate}</td>
      <td>${escapeHTML(e.reason)}</td>
      <td>${e.category}</td>
      <td style="font-size:.82rem;color:var(--muted);">${e.bank}</td>
      <td class="${amountClass}">${formattedAmount}</td>
      <td><button class="btn-del" onclick="deleteExpense(${e.id})">🗑 Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}


function getAmountStyle(amount) {
  if (amount >= 5000) {
    return { amountClass: 'amount-red',    rowClass: 'tier-red' };
  } else if (amount >= 1000) {
    return { amountClass: 'amount-yellow', rowClass: 'tier-yellow' };
  } else if (amount >= 500) {
    return { amountClass: 'amount-green',  rowClass: 'tier-green' };
  }
  return { amountClass: 'amount-normal', rowClass: 'tier-normal' };
}


function updateSummary() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  document.getElementById('totalSpent').textContent =
    '$' + total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('totalEntries').textContent = expenses.length;
}


function clearFilters() {
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterBank').value     = '';
  document.getElementById('filterDateFrom').value = '';
  document.getElementById('filterDateTo').value   = '';
  renderTable();
}


function save() {
  localStorage.setItem('expenseDesk', JSON.stringify(expenses));
}

function resetForm() {
  document.getElementById('amount').value   = '';
  document.getElementById('reason').value   = '';
  document.getElementById('bank').value     = '';
  document.getElementById('category').value = '';
  document.getElementById('date').valueAsDate = new Date();
}

function showMsg(text, type) {
  const msg = document.getElementById('formMsg');
  msg.textContent = text;
  msg.className = 'form-msg ' + type;
  setTimeout(() => {
    msg.textContent = '';
    msg.className = 'form-msg';
  }, 3000);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(d)} ${months[parseInt(m) - 1]} ${y}`;
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
