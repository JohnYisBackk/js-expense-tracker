// =============================================
// 1. DOM ELEMENTS
// =============================================

const entryForm = document.getElementById("entryForm");
const entryTitle = document.getElementById("entryTitle");
const entryAmount = document.getElementById("entryAmount");

const balanceValue = document.getElementById("balanceValue");
const incomeValue = document.getElementById("incomeValue");
const expenseValue = document.getElementById("expenseValue");

const emptyState = document.getElementById("emptyState");

const ledgerList = document.getElementById("ledgerList");

const entryTypeInputs = document.querySelectorAll('input[name="entryType"]');

const storageKey = "expenseTrackerTransactions";

// =============================================
// 2. DATA ARRAY
// =============================================

let transactions = [];

// =============================================
//  3. SAVE TO LOCALSTORAGE
// =============================================

function saveTransactions() {
  localStorage.setItem(storageKey, JSON.stringify(transactions));
}

// =============================================
// 4.  LOAD LOCALSTORAGE
// =============================================

function loadTransactions() {
  const storedTransactions = localStorage.getItem(storageKey);

  if (storedTransactions) {
    transactions = JSON.parse(storedTransactions);
  }
}

// =============================================
// 5. ADD TRANSACTION FUNCTION
// =============================================

function addTransaction() {
  const title = entryTitle.value.trim();
  const amount = Number(entryAmount.value);

  let selectedType = "";

  entryTypeInputs.forEach((input) => {
    if (input.checked) {
      selectedType = input.value;
    }
  });

  if (title === "" || isNaN(amount) || amount <= 0 || selectedType === "") {
    alert("Please fill in all fields correctly.");
    return;
  }

  const newTransaction = {
    id: Date.now(),
    title: title,
    amount: amount,
    type: selectedType,
  };

  transactions.push(newTransaction);

  entryTitle.value = "";
  entryAmount.value = "";

  entryTypeInputs.forEach((input) => {
    if (input.value === "income") {
      input.checked = true;
    }
  });

  saveTransactions();
  renderTransactions();
  updateSummary();
}

// =============================================
// 6. RENDER TRANSACTIONS FUNCTION
// =============================================

function renderTransactions() {
  ledgerList.innerHTML = "";

  if (transactions.length === 0) {
    emptyState.style.display = "block";
    return;
  } else {
    emptyState.style.display = "none";
  }

  transactions.forEach((transaction) => {
    const transactionRow = document.createElement("div");
    transactionRow.className = "transaction-row";

    transactionRow.innerHTML = `
      <div class="transaction-info">
        <h3 class="transaction-name">${transaction.title}</h3>
        <p class="transaction-meta">Added transaction</p>
      </div>

      <div class="transaction-amount">
        $${transaction.amount.toFixed(2)}
      </div>

      <div class="transaction-badge ${transaction.type}">
        ${transaction.type}
      </div>

      <button class="remove-btn" data-id="${transaction.id}">
        Delete
      </button>
    `;

    const deleteBtn = transactionRow.querySelector(".remove-btn");

    deleteBtn.addEventListener("click", function () {
      deleteTransaction(transaction.id);
    });

    ledgerList.appendChild(transactionRow);
  });
}

// =============================================
// 7. UPDATE SUMMARY FUNCTION
// =============================================

function updateSummary() {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((transaction) => {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpense += transaction.amount;
    }
  });

  const totalBalance = totalIncome - totalExpense;

  balanceValue.textContent = `$${totalBalance.toFixed(2)}`;
  incomeValue.textContent = `$${totalIncome.toFixed(2)}`;
  expenseValue.textContent = `$${totalExpense.toFixed(2)}`;
}

// =============================================
// 8. DELETE TRANSACTION FUNCTION
// =============================================

function deleteTransaction(transactionId) {
  transactions = transactions.filter((t) => t.id !== transactionId);

  saveTransactions();
  renderTransactions();
  updateSummary();
}

// =============================================
// 9. EVENT LISTENER
// =============================================

entryForm.addEventListener("submit", function (event) {
  event.preventDefault();

  addTransaction();
});

// =============================================
// 10. APP INITIALIZATION
// =============================================

loadTransactions();
renderTransactions();
updateSummary();
