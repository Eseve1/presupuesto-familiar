// app.js - Aplicación de Presupuesto Familiar

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyAIqzMwqJ8hI-9AWFfWYLBHEa2kxmkEZk4",
    authDomain: "presupuestofamiliar-b290f.firebaseapp.com",
    projectId: "presupuestofamiliar-b290f",
    storageBucket: "presupuestofamiliar-b290f.firebasestorage.app",
    messagingSenderId: "909741248494",
    appId: "1:909741248494:web:476c410df0ce06b80488ff"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Variables globales
let currentUser = null;
let presupuesto = 0;
let gastos = [];

// Elementos del DOM
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterBtn = document.getElementById('show-register');
const showLoginBtn = document.getElementById('show-login');
const logoutBtn = document.getElementById('logout-btn');
const presupuestoForm = document.getElementById('presupuesto-form');
const gastoForm = document.getElementById('gasto-form');
const gastosList = document.getElementById('gastos-list');
const totalPresupuesto = document.getElementById('total-presupuesto');
const totalGastos = document.getElementById('total-gastos');
const saldoRestante = document.getElementById('saldo-restante');

// Autenticación
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        authSection.style.display = 'none';
        appSection.style.display = 'block';
        cargarDatos();
    } else {
        currentUser = null;
        authSection.style.display = 'block';
        appSection.style.display = 'none';
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert('Error al iniciar sesión: ' + error.message);
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
        alert('Error al registrarse: ' + error.message);
    }
});

showRegisterBtn.addEventListener('click', () => {
    loginForm.parentElement.style.display = 'none';
    registerForm.parentElement.style.display = 'block';
});

showLoginBtn.addEventListener('click', () => {
    registerForm.parentElement.style.display = 'none';
    loginForm.parentElement.style.display = 'block';
});

logoutBtn.addEventListener('click', () => {
    signOut(auth);
});

// Gestión de presupuesto
presupuestoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    presupuesto = parseFloat(document.getElementById('presupuesto-input').value);
    guardarDatos();
    actualizarResumen();
    presupuestoForm.reset();
});

// Gestión de gastos
gastoForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('gasto-nombre').value;
    const cantidad = parseFloat(document.getElementById('gasto-cantidad').value);
    
    const gasto = {
        id: Date.now(),
        nombre,
        cantidad,
        fecha: new Date().toLocaleDateString()
    };
    
    gastos.push(gasto);
    guardarDatos();
    actualizarGastos();
    actualizarResumen();
    gastoForm.reset();
});

function actualizarGastos() {
    gastosList.innerHTML = '';
    
    gastos.forEach(gasto => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${gasto.nombre}</span>
            <span>${gasto.fecha}</span>
            <span>$${gasto.cantidad.toFixed(2)}</span>
            <button onclick="eliminarGasto(${gasto.id})">Eliminar</button>
        `;
        gastosList.appendChild(li);
    });
}

window.eliminarGasto = function(id) {
    gastos = gastos.filter(gasto => gasto.id !== id);
    guardarDatos();
    actualizarGastos();
    actualizarResumen();
};

function actualizarResumen() {
    const total = gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
    const saldo = presupuesto - total;
    
    totalPresupuesto.textContent = `$${presupuesto.toFixed(2)}`;
    totalGastos.textContent = `$${total.toFixed(2)}`;
    saldoRestante.textContent = `$${saldo.toFixed(2)}`;
    
    if (saldo < 0) {
        saldoRestante.style.color = '#e74c3c';
    } else {
        saldoRestante.style.color = '#27ae60';
    }
}

// Guardar y cargar datos
function guardarDatos() {
    if (currentUser) {
        const datos = {
            presupuesto,
            gastos
        };
        localStorage.setItem(`presupuesto_${currentUser.uid}`, JSON.stringify(datos));
    }
}

function cargarDatos() {
    if (currentUser) {
        const datos = localStorage.getItem(`presupuesto_${currentUser.uid}`);
        if (datos) {
            const { presupuesto: p, gastos: g } = JSON.parse(datos);
            presupuesto = p || 0;
            gastos = g || [];
            actualizarGastos();
            actualizarResumen();
        }
    }
}