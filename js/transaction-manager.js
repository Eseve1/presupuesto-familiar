// Transaction Management

let transactions = [];

async function loadTransactions() {
    try {
        const currentMonth = getCurrentMonth();
        const startDate = new Date(currentMonth + '-01');
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);
        
        const snapshot = await db.collection('transactions')
            .where('userId', '==', currentUser.uid)
            .where('date', '>=', firebase.firestore.Timestamp.fromDate(startDate))
            .where('date', '<', firebase.firestore.Timestamp.fromDate(endDate))
            .orderBy('date', 'desc')
            .limit(50)
            .get();
        
        transactions = [];
        snapshot.forEach(doc => {
            transactions.push({ id: doc.id, ...doc.data() });
        });
        
        renderTransactions();
    } catch (error) {
        console.error('Error loading transactions:', error);
        showToast('Error al cargar las transacciones', 'error');
    }
}

function renderTransactions() {
    const transactionsList = document.getElementById('transactionsList');
    if (!transactionsList) return;
    
    if (transactions.length === 0) {
        transactionsList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p class="text-lg mb-2">No hay transacciones</p>
                <p class="text-sm">Registra tu primera transacción</p>
            </div>
        `;
        return;
    }
    
    transactionsList.innerHTML = transactions.slice(0, 10).map(transaction => {
        const date = transaction.date.toDate();
        const isExpense = transaction.type === 'expense';
        
        return `
            <div class="transaction-item flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 rounded">
                <div class="flex items-center space-x-3">
                    <span class="text-2xl">${isExpense ? '💸' : '💵'}</span>
                    <div>
                        <p class="font-medium text-gray-800">${transaction.description}</p>
                        <p class="text-xs text-gray-500">${formatDate(date)} • ${transaction.category || 'Sin categoría'}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold ${isExpense ? 'text-red-600' : 'text-green-600'}">
                        ${isExpense ? '-' : '+'}${formatCurrency(transaction.amount)}
                    </p>
                    <button onclick="deleteTransaction('${transaction.id}')" class="text-xs text-red-500 hover:text-red-700 mt-1">
                        Eliminar
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function formatDate(date) {
    return date.toLocaleDateString('es-BO', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Setup transaction modal
document.addEventListener('DOMContentLoaded', () => {
    const addTransactionBtn = document.getElementById('addTransactionBtn');
    const transactionModal = document.getElementById('transactionModal');
    const cancelTransaction = document.getElementById('cancelTransaction');
    const transactionForm = document.getElementById('transactionForm');
    const transactionType = document.getElementById('transactionType');
    const envelopeSelectionDiv = document.getElementById('envelopeSelectionDiv');
    
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', () => {
            transactionModal.classList.remove('hidden');
            populateEnvelopeSelect();
            // Set default date to today
            document.getElementById('transactionDate').valueAsDate = new Date();
        });
    }
    
    if (cancelTransaction) {
        cancelTransaction.addEventListener('click', () => {
            transactionModal.classList.add('hidden');
            transactionForm.reset();
        });
    }
    
    if (transactionType) {
        transactionType.addEventListener('change', () => {
            if (transactionType.value === 'income') {
                envelopeSelectionDiv.classList.add('hidden');
            } else {
                envelopeSelectionDiv.classList.remove('hidden');
            }
        });
    }
    
    if (transactionForm) {
        transactionForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await createTransaction();
        });
    }
});

function populateEnvelopeSelect() {
    const select = document.getElementById('transactionEnvelope');
    if (!select) return;
    
    select.innerHTML = envelopes.map(envelope => 
        `<option value="${envelope.id}">${envelope.icon} ${envelope.name}</option>`
    ).join('');
}

async function createTransaction() {
    const type = document.getElementById('transactionType').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const description = document.getElementById('transactionDescription').value;
    const dateStr = document.getElementById('transactionDate').value;
    const date = new Date(dateStr + 'T12:00:00');
    
    let envelopeId = null;
    let category = null;
    
    if (type === 'expense') {
        envelopeId = document.getElementById('transactionEnvelope').value;
        const envelope = envelopes.find(e => e.id === envelopeId);
        if (envelope) {
            category = envelope.name;
        }
    }
    
    try {
        showLoading();
        
        // Create transaction
        await db.collection('transactions').add({
            userId: currentUser.uid,
            date: firebase.firestore.Timestamp.fromDate(date),
            type: type,
            amount: amount,
            envelopeId: envelopeId,
            category: category,
            description: description,
            recurring: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update envelope if expense
        if (type === 'expense' && envelopeId) {
            const envelope = envelopes.find(e => e.id === envelopeId);
            if (envelope) {
                await db.collection('envelopes').doc(envelopeId).update({
                    spent: firebase.firestore.FieldValue.increment(amount)
                });
            }
        }
        
        // Update user's monthly income if income transaction
        if (type === 'income') {
            await db.collection('users').doc(currentUser.uid).update({
                'profile.monthlyIncome': firebase.firestore.FieldValue.increment(amount)
            });
            // Reload user data
            const userDoc = await db.collection('users').doc(currentUser.uid).get();
            currentUserData = userDoc.data();
        }
        
        // Close modal and reset form
        document.getElementById('transactionModal').classList.add('hidden');
        document.getElementById('transactionForm').reset();
        
        // Reload data
        await loadEnvelopes();
        await loadTransactions();
        updateDashboardSummary();
        updateChart();
        
        showToast('Transacción registrada exitosamente', 'success');
    } catch (error) {
        console.error('Error creating transaction:', error);
        showToast('Error al registrar la transacción', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteTransaction(transactionId) {
    if (!confirm('¿Estás seguro de eliminar esta transacción?')) {
        return;
    }
    
    try {
        showLoading();
        
        // Get transaction details
        const transactionDoc = await db.collection('transactions').doc(transactionId).get();
        const transaction = transactionDoc.data();
        
        // If expense, update envelope
        if (transaction.type === 'expense' && transaction.envelopeId) {
            await db.collection('envelopes').doc(transaction.envelopeId).update({
                spent: firebase.firestore.FieldValue.increment(-transaction.amount)
            });
        }
        
        // Delete transaction
        await db.collection('transactions').doc(transactionId).delete();
        
        // Reload data
        await loadEnvelopes();
        await loadTransactions();
        updateDashboardSummary();
        updateChart();
        
        showToast('Transacción eliminada', 'success');
    } catch (error) {
        console.error('Error deleting transaction:', error);
        showToast('Error al eliminar la transacción', 'error');
    } finally {
        hideLoading();
    }
}

// Make deleteTransaction globally accessible
window.deleteTransaction = deleteTransaction;
