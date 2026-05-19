
let expenses = [];


function addExpense() {
 
  const amountVal   = document.getElementById('amount').value;
  const reasonVal   = document.getElementById('reason').value;
  const bankVal     = document.getElementById('bank').value;
  const categoryVal = document.getElementById('category').value;
  const dateVal     = document.getElementById('date').value;

 
  if (amountVal === "" || reasonVal === "" || bankVal === "" || categoryVal === "" || dateVal === "") {
    alert("Please fill out all input fields!");
    return; 
  }

  
  const entry = {
    amount: Number(amountVal), 
    bank: bankVal,
    category: categoryVal,
    date: dateVal
  };

  
  expenses.push(entry);

 
  renderTable();
  updateSummary();
  resetForm();
}


function resetForm() {
  document.getElementById('amount').value = "";
  document.getElementById('reason').value = "";
  document.getElementById('bank').value = "";
  document.getElementById('category').value = "";
  document.getElementById('date').value = "";
}


function renderTable() {
  const tbody = document.getElementById('tableBody');
  const emptyState = document.getElementById('emptyState');
  

  tbody.innerHTML = "";


  if (expenses.length === 0) {
    emptyState.style.display = "flex";
    return; 
  } else {
    emptyState.style.display = "none";
  }

  
  for (let i = 0; i < expenses.length; i++) {
    const item = expenses[i];

    
    const tr = document.createElement('tr');

    
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${item.date}</td>
      <td>${item.reason}</td>
      <td>${item.category}</td>
      <td>${item.bank}</td>
      <td>$${item.amount}</td>
      <td>
        <button class="btn-del" onclick="deleteExpense(${i})">🗑 Delete</button>
      </td>
    `;

   
    tbody.appendChild(tr);
  }
}


function deleteExpense(indexToDelete) {
  let remainingExpenses = [];

 
  for (let i = 0; i < expenses.length; i++) {
    if (i !== indexToDelete) {
      remainingExpenses.push(expenses[i]);
    }
  }

 
  expenses = remainingExpenses;

  
  renderTable();
  updateSummary();
}


function updateSummary() {
  let totalSpent = 0;

 m
  for (let i = 0; i < expenses.length; i++) {
    totalSpent = totalSpent + expenses[i].amount;
  }

 
  document.getElementById('totalSpent').textContent = "$" + totalSpent;
  document.getElementById('totalEntries').textContent = expenses.length;
}


function clearFilters() {
  document.getElementById('filterCategory').value = "";
  document.getElementById('filterBank').value = "";
  document.getElementById('filterDateFrom').value = "";
  document.getElementById('filterDateTo').value = "";
  renderTable();
}
