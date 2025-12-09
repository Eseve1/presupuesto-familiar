// Envelope System Management

let envelopes = [];

async function loadEnvelopes() {
    try {
        const currentMonth = getCurrentMonth();
        const snapshot = await db.collection('envelopes')
            .where('userId', '==', currentUser.uid)
            .where('month', '==', currentMonth)
            .get();
        
        envelopes = [];
        snapshot.forEach(doc => {
            envelopes.push({ id: doc.id, ...doc.data() });
        });
        
        renderEnvelopes();
    } catch (error) {
        console.error('Error loading envelopes:', error);
        showToast('Error al cargar los sobres', 'error');
    }
}

function renderEnvelopes() {
    const envelopesList = document.getElementById('envelopesList');
    if (!envelopesList) return;
    
    if (envelopes.length === 0) {
        envelopesList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <p class="text-lg mb-2">No tienes sobres creados</p>
                <p class="text-sm">Crea tu primer sobre para comenzar a gestionar tu presupuesto</p>
            </div>
        `;
        return;
    }
    
    envelopesList.innerHTML = envelopes.map(envelope => {
        const remaining = envelope.allocated - envelope.spent;
        const percentage = envelope.allocated > 0 ? (envelope.spent / envelope.allocated) * 100 : 0;
        const status = percentage < 70 ? 'bg-green-600' : percentage < 90 ? 'bg-yellow-500' : 'bg-red-600';
        
        return `
            <div class="envelope-card bg-white rounded-lg shadow p-4 border-l-4" style="border-left-color: ${envelope.color}">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center space-x-3">
                        <span class="text-3xl">${envelope.icon}</span>
                        <div>
                            <h3 class="font-bold text-gray-800">${envelope.name}</h3>
                            <span class="text-xs text-gray-500 uppercase">${getCategoryLabel(envelope.category)}</span>
                        </div>
                    </div>
                    <button onclick="deleteEnvelope('${envelope.id}')" class="text-red-500 hover:text-red-700">
                        <span class="text-xl">🗑️</span>
                    </button>
                </div>
                
                <div class="space-y-2">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Gastado:</span>
                        <span class="font-semibold text-gray-800">${formatCurrency(envelope.spent)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600">Presupuesto:</span>
                        <span class="font-semibold text-gray-800">${formatCurrency(envelope.allocated)}</span>
                    </div>
                    <div class="flex justify-between text-sm font-bold">
                        <span class="${remaining >= 0 ? 'text-green-600' : 'text-red-600'}">Disponible:</span>
                        <span class="${remaining >= 0 ? 'text-green-600' : 'text-red-600'}">${formatCurrency(remaining)}</span>
                    </div>
                </div>
                
                <div class="mt-3">
                    <div class="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progreso</span>
                        <span>${Math.min(percentage, 100).toFixed(0)}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="progress-bar ${status} h-2 rounded-full" style="width: ${Math.min(percentage, 100)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getCategoryLabel(category) {
    const labels = {
        'necesidades': 'Necesidades',
        'personales': 'Personales',
        'ahorro': 'Ahorro'
    };
    return labels[category] || category;
}

// Setup envelope modal
document.addEventListener('DOMContentLoaded', () => {
    const addEnvelopeBtn = document.getElementById('addEnvelopeBtn');
    const envelopeModal = document.getElementById('envelopeModal');
    const cancelEnvelope = document.getElementById('cancelEnvelope');
    const envelopeForm = document.getElementById('envelopeForm');
    
    if (addEnvelopeBtn) {
        addEnvelopeBtn.addEventListener('click', () => {
            envelopeModal.classList.remove('hidden');
        });
    }
    
    if (cancelEnvelope) {
        cancelEnvelope.addEventListener('click', () => {
            envelopeModal.classList.add('hidden');
            envelopeForm.reset();
        });
    }
    
    // Icon selection
    const iconButtons = document.querySelectorAll('.icon-btn');
    iconButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            iconButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('envelopeIcon').value = btn.dataset.icon;
        });
    });
    
    if (envelopeForm) {
        envelopeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await createEnvelope();
        });
    }
});

async function createEnvelope() {
    const name = document.getElementById('envelopeName').value;
    const category = document.getElementById('envelopeCategory').value;
    const budget = parseFloat(document.getElementById('envelopeBudget').value);
    const icon = document.getElementById('envelopeIcon').value;
    
    const colors = {
        'necesidades': '#3b82f6',
        'personales': '#a855f7',
        'ahorro': '#10b981'
    };
    
    try {
        showLoading();
        
        const currentMonth = getCurrentMonth();
        await db.collection('envelopes').add({
            userId: currentUser.uid,
            name: name,
            category: category,
            allocated: budget,
            spent: 0,
            color: colors[category],
            icon: icon,
            month: currentMonth,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Close modal and reset form
        document.getElementById('envelopeModal').classList.add('hidden');
        document.getElementById('envelopeForm').reset();
        
        // Reload envelopes
        await loadEnvelopes();
        updateDashboardSummary();
        
        showToast('Sobre creado exitosamente', 'success');
    } catch (error) {
        console.error('Error creating envelope:', error);
        showToast('Error al crear el sobre', 'error');
    } finally {
        hideLoading();
    }
}

async function deleteEnvelope(envelopeId) {
    if (!confirm('¿Estás seguro de eliminar este sobre?')) {
        return;
    }
    
    try {
        showLoading();
        
        // Delete envelope
        await db.collection('envelopes').doc(envelopeId).delete();
        
        // Reload envelopes
        await loadEnvelopes();
        updateDashboardSummary();
        
        showToast('Sobre eliminado', 'success');
    } catch (error) {
        console.error('Error deleting envelope:', error);
        showToast('Error al eliminar el sobre', 'error');
    } finally {
        hideLoading();
    }
}

// Make deleteEnvelope globally accessible
window.deleteEnvelope = deleteEnvelope;
