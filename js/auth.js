// Authentication Logic

document.addEventListener('DOMContentLoaded', () => {
    // Only run on index page
    if (!window.location.pathname.includes('dashboard.html')) {
        setupAuthUI();
    }
});

function setupAuthUI() {
    const loginTab = document.getElementById('loginTab');
    const registerTab = document.getElementById('registerTab');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    // Tab switching
    loginTab.addEventListener('click', () => {
        loginTab.classList.add('bg-white', 'shadow-sm', 'text-blue-600');
        loginTab.classList.remove('text-gray-600');
        registerTab.classList.remove('bg-white', 'shadow-sm', 'text-blue-600');
        registerTab.classList.add('text-gray-600');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
    });
    
    registerTab.addEventListener('click', () => {
        registerTab.classList.add('bg-white', 'shadow-sm', 'text-blue-600');
        registerTab.classList.remove('text-gray-600');
        loginTab.classList.remove('bg-white', 'shadow-sm', 'text-blue-600');
        loginTab.classList.add('text-gray-600');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });
    
    // Login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            showLoading();
            await auth.signInWithEmailAndPassword(email, password);
            // Auth state observer will handle redirect
        } catch (error) {
            console.error('Login error:', error);
            showAuthError(getErrorMessage(error.code));
        } finally {
            hideLoading();
        }
    });
    
    // Register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const income = parseFloat(document.getElementById('registerIncome').value);
        
        try {
            showLoading();
            
            // Create user account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Create user profile in Firestore
            await db.collection('users').doc(user.uid).set({
                userId: user.uid,
                profile: {
                    name: name,
                    mode: null, // Will be selected on first login
                    email: email,
                    currency: 'BOB',
                    monthlyIncome: income,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                }
            });
            
            // Create default envelopes based on 50/30/20 rule
            await createDefaultEnvelopes(user.uid, income);
            
            showToast('Cuenta creada exitosamente', 'success');
            // Auth state observer will handle redirect
        } catch (error) {
            console.error('Registration error:', error);
            showAuthError(getErrorMessage(error.code));
        } finally {
            hideLoading();
        }
    });
}

async function createDefaultEnvelopes(userId, monthlyIncome) {
    const currentMonth = getCurrentMonth();
    
    const defaultEnvelopes = [
        {
            name: 'Comida',
            category: 'necesidades',
            allocated: monthlyIncome * 0.25,
            icon: '🍽️',
            color: '#3b82f6'
        },
        {
            name: 'Vivienda',
            category: 'necesidades',
            allocated: monthlyIncome * 0.25,
            icon: '🏠',
            color: '#1e40af'
        },
        {
            name: 'Entretenimiento',
            category: 'personales',
            allocated: monthlyIncome * 0.20,
            icon: '🎮',
            color: '#a855f7'
        },
        {
            name: 'Ropa y Personal',
            category: 'personales',
            allocated: monthlyIncome * 0.10,
            icon: '👕',
            color: '#ec4899'
        },
        {
            name: 'Ahorro Mensual',
            category: 'ahorro',
            allocated: monthlyIncome * 0.20,
            icon: '💰',
            color: '#10b981'
        }
    ];
    
    const batch = db.batch();
    
    defaultEnvelopes.forEach(envelope => {
        const envelopeRef = db.collection('envelopes').doc();
        batch.set(envelopeRef, {
            userId: userId,
            id: envelopeRef.id,
            name: envelope.name,
            category: envelope.category,
            allocated: envelope.allocated,
            spent: 0,
            color: envelope.color,
            icon: envelope.icon,
            month: currentMonth,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    });
    
    await batch.commit();
}

function showAuthError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'Este correo electrónico ya está registrado',
        'auth/invalid-email': 'Correo electrónico inválido',
        'auth/operation-not-allowed': 'Operación no permitida',
        'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres',
        'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/too-many-requests': 'Demasiados intentos. Por favor, intenta más tarde',
        'auth/network-request-failed': 'Error de conexión. Verifica tu internet'
    };
    
    return errorMessages[errorCode] || 'Error de autenticación. Por favor, intenta de nuevo';
}
