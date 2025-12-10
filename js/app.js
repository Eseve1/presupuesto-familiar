// app.js - Versión mejorada: validación, manejo de errores, Firestore optimizado
// Requiere: firebase inicializado en firebase-config.js y elemento #mensajes en HTML

const db = firebase.firestore();
const auth = firebase.auth();

/* ---------- Helpers ---------- */
function mostrarMensaje(texto, tipo = "info") {
  const cont = document.getElementById("mensajes");
  if (cont) {
    cont.innerText = texto;
    cont.className = `msg ${tipo}`;
    setTimeout(() => { cont.innerText = ""; cont.className = ""; }, 3500);
  } else {
    console[type === "error" ? "error" : "log"](texto);
  }
}

function esFechaValida(fecha) {
  const d = new Date(fecha);
  return !isNaN(d.getTime());
}

/* ---------- Validaciones ---------- */
function validarTransaccion(nombre, monto, fecha) {
  if (!nombre || String(nombre).trim() === "") return "Nombre obligatorio";
  monto = Number(monto);
  if (!Number.isFinite(monto) || monto <= 0) return "Monto inválido";
  if (!fecha || !esFechaValida(fecha)) return "Fecha inválida";
  return null;
}

/* ---------- Cálculo 50/30/20 ---------- */
function calcularPresupuesto(ingresoTotal) {
  ingresoTotal = Number(ingresoTotal);
  if (!Number.isFinite(ingresoTotal) || ingresoTotal <= 0) return null;
  return {
    necesidades: Math.round(ingresoTotal * 0.5),
    deseos: Math.round(ingresoTotal * 0.3),
    ahorro: Math.round(ingresoTotal * 0.2)
  };
}

/* ---------- Firestore: paths y helpers ---------- */
function refUsuario(uid) {
  return db.collection("usuarios").doc(uid);
}
function refSobres(uid) {
  return refUsuario(uid).collection("sobres");
}
function refTransacciones(uid, sobreId) {
  return refSobres(uid).doc(sobreId).collection("transacciones");
}

/* ---------- CRUD Sobres ---------- */
async function crearSobre(uid, nombre, presupuesto = 0) {
  if (!uid) throw new Error("Usuario no autenticado");
  if (!nombre || !nombre.trim()) throw new Error("Nombre de sobre obligatorio");
  const data = { nombre: nombre.trim(), presupuesto: Number(presupuesto) || 0, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
  const docRef = await refSobres(uid).add(data);
  return docRef.id;
}

async function editarSobre(uid, sobreId, datos) {
  if (!uid) throw new Error("Usuario no autenticado");
  await refSobres(uid).doc(sobreId).update({ ...datos, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
}

async function eliminarSobre(uid, sobreId) {
  if (!uid) throw new Error("Usuario no autenticado");
  // eliminar transacciones primero (batch)
  const txCol = refTransacciones(uid, sobreId);
  const snap = await txCol.get();
  const batch = db.batch();
  snap.docs.forEach(d => batch.delete(d.ref));
  batch.delete(refSobres(uid).doc(sobreId));
  await batch.commit();
}

/* ---------- CRUD Transacciones ---------- */
async function agregarTransaccion(uid, sobreId, nombre, monto, fecha, tipo = "gasto") {
  if (!uid) throw new Error("Usuario no autenticado");
  const err = validarTransaccion(nombre, monto, fecha);
  if (err) throw new Error(err);
  const doc = {
    nombre: nombre.trim(),
    monto: Number(monto),
    fecha: firebase.firestore.Timestamp.fromDate(new Date(fecha)),
    tipo,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };
  const docRef = await refTransacciones(uid, sobreId).add(doc);
  return docRef.id;
}

async function obtenerTransacciones(uid, sobreId, limit = 100) {
  if (!uid) throw new Error("Usuario no autenticado");
  const snapshot = await refTransacciones(uid, sobreId).orderBy("fecha", "desc").limit(limit).get();
  return snapshot.docs.map(d => ({ id: d.id, ...d.data(), fecha: d.data().fecha?.toDate?.() || d.data().fecha }));
}

/* ---------- Lectura optimizada: cargar todo de una vez ---------- */
async function cargarDatosUsuario(uid) {
  if (!uid) throw new Error("Usuario no autenticado");
  const sobresSnap = await refSobres(uid).orderBy("createdAt", "asc").get();
  const sobres = [];
  for (const s of sobresSnap.docs) {
    const sobre = { id: s.id, ...s.data() };
    // opcional: cargar últimas 10 transacciones por sobre
    const txSnap = await refTransacciones(uid, s.id).orderBy("fecha", "desc").limit(10).get();
    sobre.transacciones = txSnap.docs.map(d => ({ id: d.id, ...d.data(), fecha: d.data().fecha?.toDate?.() || d.data().fecha }));
    sobres.push(sobre);
  }
  return { sobres };
}

/* ---------- Manejo Auth (listeners) ---------- */
auth.onAuthStateChanged(async user => {
  if (user) {
    try {
      const datos = await cargarDatosUsuario(user.uid);
      // función que actualiza UI con datos (definila en tu front)
      actualizarUIConDatos(datos);
    } catch (e) {
      mostrarMensaje("Error cargando datos: " + e.message, "error");
    }
  } else {
    // mostrar pantalla de login
    mostrarLogin();
  }
});

/* ---------- Ejemplo de uso seguro (invocado desde UI) ---------- */
async function accionAgregarGasto(sobreId, nombre, monto, fecha) {
  const user = auth.currentUser;
  if (!user) return mostrarMensaje("Inicia sesión primero", "error");
  try {
    await agregarTransaccion(user.uid, sobreId, nombre, monto, fecha, "gasto");
    mostrarMensaje("Gasto agregado");
    // refrescar datos del sobre
    const trans = await obtenerTransacciones(user.uid, sobreId, 20);
    renderTransacciones(trans); // función UI
  } catch (err) {
    mostrarMensaje(err.message, "error");
  }
}