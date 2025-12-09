// Firebase Configuration and App Initialization

// IMPORTANT: Replace these placeholder values with your actual Firebase credentials
// See FIREBASE_SETUP.md for detailed instructions on how to get these values
// DO NOT deploy to production with these placeholder values
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
let app, auth, db;
let currentUser = null;
let currentUserData = null;

try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Error initializing Firebase:', error);
    showToast('Error al inicializar Firebase. Por favor, configura tus credenciales.', 'error');
}

// Current month helper
function getCurrentMonth() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

// Currency formatter
function formatCurrency(amount) {
    return `Bs. ${parseFloat(amount).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="flex items-center space-x-3">
            <span class="text-xl">${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}</span>
            <p class="text-gray-800">${message}</p>
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Show/Hide Loading Overlay
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Auth State Observer
auth.onAuthStateChanged(async (user) => {
    if (user) {
        currentUser = user;
        console.log('User logged in:', user.uid);
        
        // Load user data
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                currentUserData = userDoc.data();
                
                // Redirect to dashboard if on index page
                if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
                    window.location.href = 'dashboard.html';
                }
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    } else {
        currentUser = null;
        currentUserData = null;
        
        // Redirect to login if on dashboard page
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'index.html';
        }
    }
});

// Initialize dashboard if on dashboard page
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        initializeDashboard();
    });
}

async function initializeDashboard() {
    showLoading();
    
    try {
        // Wait for auth to be ready
        await new Promise(resolve => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                if (user) {
                    unsubscribe();
                    resolve();
                }
            });
        });
        
        // Load user data
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        if (!userDoc.exists) {
            throw new Error('User data not found');
        }
        
        currentUserData = userDoc.data();
        
        // Update welcome message
        const welcomeMsg = document.getElementById('userWelcome');
        if (welcomeMsg) {
            welcomeMsg.textContent = `Bienvenido, ${currentUserData.profile.name}`;
        }
        
        // Check if user needs to select mode
        if (!currentUserData.profile.mode) {
            document.getElementById('modeSelectionModal').classList.remove('hidden');
        } else {
            // Apply theme
            applyTheme(currentUserData.profile.mode);
            
            // Initialize dashboard components
            await loadEnvelopes();
            await loadTransactions();
            updateDashboardSummary();
            initializeChart();
        }
        
        // Setup event listeners
        setupDashboardEventListeners();
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showToast('Error al cargar el dashboard', 'error');
    } finally {
        hideLoading();
    }
}

function applyTheme(mode) {
    const body = document.body;
    const themeStylesheet = document.getElementById('themeStylesheet');
    
    body.classList.remove('adult-mode', 'kids-mode');
    body.classList.add(`${mode}-mode`);
    
    if (mode === 'kids') {
        themeStylesheet.setAttribute('href', 'css/kids-theme.css');
    } else {
        themeStylesheet.setAttribute('href', 'css/adult-theme.css');
    }
}

async function selectUserMode(mode) {
    try {
        showLoading();
        
        await db.collection('users').doc(currentUser.uid).update({
            'profile.mode': mode
        });
        
        currentUserData.profile.mode = mode;
        
        // Hide modal
        document.getElementById('modeSelectionModal').classList.add('hidden');
        
        // Apply theme
        applyTheme(mode);
        
        // Initialize dashboard
        await loadEnvelopes();
        await loadTransactions();
        updateDashboardSummary();
        initializeChart();
        
        showToast('Modo seleccionado correctamente', 'success');
    } catch (error) {
        console.error('Error selecting mode:', error);
        showToast('Error al seleccionar modo', 'error');
    } finally {
        hideLoading();
    }
}

function setupDashboardEventListeners() {
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error signing out:', error);
                showToast('Error al cerrar sesión', 'error');
            }
        });
    }
    
    // Mode toggle button
    const modeToggle = document.getElementById('modeToggle');
    if (modeToggle) {
        modeToggle.addEventListener('click', () => {
            document.getElementById('modeSelectionModal').classList.remove('hidden');
        });
    }
}

// Make selectUserMode globally accessible
window.selectUserMode = selectUserMode;
