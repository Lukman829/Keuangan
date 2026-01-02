document.addEventListener('DOMContentLoaded', () => {
    const addTransactionForm = document.getElementById('add-transaction-form');
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const typeInput = document.getElementById('type');
    const transactionsList = document.getElementById('transactions');
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const balanceEl = document.getElementById('balance');

    // Load transactions from local storage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Function to render a single transaction
    function renderTransaction(transaction) {
        const li = document.createElement('li');
        li.innerHTML = `
            ${transaction.description} 
            <span>${transaction.type === 'income' ? '+' : '-'}Rp ${Math.abs(transaction.amount).toLocaleString('id-ID')}</span>
        `;
        li.classList.add(transaction.type);
        transactionsList.appendChild(li);
    }

    // Function to update the dashboard
    function updateDashboard() {
        const amounts = transactions.map(t => t.amount);

        const totalIncome = amounts
            .filter(item => item > 0)
            .reduce((acc, item) => (acc += item), 0);

        const totalExpense = amounts
            .filter(item => item < 0)
            .reduce((acc, item) => (acc += item), 0);

        const balance = totalIncome + totalExpense;

        totalIncomeEl.textContent = `Rp ${totalIncome.toLocaleString('id-ID')}`;
        totalExpenseEl.textContent = `Rp ${Math.abs(totalExpense).toLocaleString('id-ID')}`;
        balanceEl.textContent = `Rp ${balance.toLocaleString('id-ID')}`;
    }
    
    // Function to render all transactions and update dashboard
    function init() {
        transactionsList.innerHTML = '';
        transactions.forEach(renderTransaction);
        updateDashboard();
    }

    // Event listener for form submission
    addTransactionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value);
        const type = typeInput.value;

        if (description === '' || isNaN(amount) || amount === 0) {
            alert('Please enter a valid description and amount.');
            return;
        }

        const transaction = {
            id: Date.now(),
            description,
            amount: type === 'income' ? amount : -amount,
            type
        };

        transactions.push(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        renderTransaction(transaction);
        updateDashboard();

        descriptionInput.value = '';
        amountInput.value = '';
    });

    // Initial render
    init();
});
