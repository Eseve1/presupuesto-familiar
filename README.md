# 💰 Presupuesto Familiar

Aplicación web moderna y educativa para la gestión de presupuesto mensual, ahorros y gastos, diseñada para ser utilizada tanto por adultos como por niños. Implementa la **metodología de ahorro Suiza/Alemana** (sistema de sobres o "Umschlagmethode").

## 🎯 ¿Qué es la Metodología Suiza/Alemana?

La metodología Suiza/Alemana de gestión financiera se basa en tres principios fundamentales:

### 1. Sistema de Sobres (Umschlagmethode)
Divide tu presupuesto en categorías virtuales o físicas. Cada "sobre" representa una categoría de gasto (comida, transporte, entretenimiento, etc.) con un presupuesto asignado.

### 2. Regla 50/30/20
- **50% Necesidades básicas**: Vivienda, comida, transporte, servicios básicos
- **30% Gastos personales**: Entretenimiento, hobbies, salidas
- **20% Ahorros e inversiones**: Fondo de emergencia, metas futuras

### 3. Disciplina y Planificación
Asigna tu dinero antes de gastarlo. Cada peso tiene un propósito específico, promoviendo el ahorro consciente.

## ✨ Características Principales

### ✅ MVP Implementado

- **🔐 Sistema de autenticación** con Firebase Auth
- **👤 Dos modos de usuario**: Adulto (profesional) y Niños (gamificado)
- **📨 Sistema de sobres virtuales** con CRUD completo
- **💸 Gestión de transacciones** (ingresos y gastos)
- **📊 Calculadora automática 50/30/20**
- **📈 Visualización con gráficos** (Chart.js)
- **💾 Persistencia en la nube** con Firebase Firestore
- **📱 Diseño responsive** (móvil, tablet, desktop)
- **🎨 Temas personalizados** para cada modo

### 🚀 Características Adicionales (Roadmap)

- Sistema de metas de ahorro
- Gamificación completa para niños
- Exportación a PDF
- Transacciones recurrentes
- Análisis de tendencias
- Módulo educativo con lecciones

## 🛠️ Tecnologías Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Estilos**: Tailwind CSS
- **Backend**: Firebase
  - Firebase Authentication (autenticación)
  - Cloud Firestore (base de datos)
- **Gráficos**: Chart.js
- **Iconos**: Emojis nativos

## 📋 Requisitos Previos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet
- Cuenta de Firebase (gratuita)

## 🔧 Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Eseve1/presupuesto-familiar.git
cd presupuesto-familiar
```

### 2. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. Habilita **Authentication** con Email/Password
4. Crea una base de datos **Cloud Firestore** en modo de prueba
5. Copia las credenciales de configuración

### 3. Configurar Credenciales

Abre el archivo `js/app.js` y reemplaza las credenciales de Firebase:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROJECT_ID.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROJECT_ID.appspot.com",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
};
```

### 4. Configurar Reglas de Seguridad de Firestore

En Firebase Console, ve a Firestore Database > Rules y configura:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /envelopes/{envelopeId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /transactions/{transactionId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    match /goals/{goalId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

### 5. Ejecutar la Aplicación

Abre `index.html` en tu navegador. Para desarrollo local, usa un servidor HTTP:

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx http-server

# Opción 3: PHP
php -S localhost:8000
```

Luego visita: `http://localhost:8000`

## 📖 Guía de Uso

### Primer Uso

1. **Registrarse**: En la pantalla de inicio, haz clic en "Registrarse"
2. **Completar datos**: 
   - Nombre completo
   - Correo electrónico
   - Contraseña (mínimo 6 caracteres)
   - Ingreso mensual en Bs.
3. **Seleccionar modo**: Elige entre Modo Adulto o Modo Niños
4. **¡Listo!**: Se crearán sobres predeterminados basados en la regla 50/30/20

### Crear un Sobre

1. En el dashboard, haz clic en **"+ Nuevo Sobre"**
2. Completa:
   - Nombre del sobre
   - Categoría (Necesidades, Personales, Ahorros)
   - Presupuesto mensual
   - Icono
3. Haz clic en **"Crear"**

### Registrar una Transacción

1. Haz clic en **"+ Nueva"** en la sección de transacciones
2. Selecciona:
   - Tipo (Gasto o Ingreso)
   - Monto en Bs.
   - Sobre (solo para gastos)
   - Descripción
   - Fecha
3. Haz clic en **"Guardar"**

### Interpretar el Dashboard

- **Tarjetas superiores**: Resumen de ingresos, gastos y disponible
- **Sección 50/30/20**: Visualiza cómo distribuyes tu dinero según la regla
- **Sobres**: Cada sobre muestra presupuesto, gastado y disponible con barra de progreso
- **Gráfico circular**: Distribución de gastos por categoría

### Cambiar de Modo

Haz clic en el botón **"Cambiar Modo"** en la esquina superior derecha para alternar entre modo adulto y niños.

## 🎨 Personalización

### Colores del Tema Adulto
```css
--primary-color: #2563eb;
--secondary-color: #10b981;
--accent-color: #f59e0b;
--danger-color: #ef4444;
```

### Colores del Tema Niños
```css
--kid-primary: #a855f7;
--kid-secondary: #ec4899;
--kid-accent: #fbbf24;
--kid-success: #10b981;
```

## 📂 Estructura del Proyecto

```
presupuesto-familiar/
├── index.html              # Página de inicio/login
├── dashboard.html          # Dashboard principal
├── css/
│   ├── main.css           # Estilos base
│   ├── adult-theme.css    # Tema adulto
│   └── kids-theme.css     # Tema niños
├── js/
│   ├── app.js             # Configuración Firebase e inicialización
│   ├── auth.js            # Autenticación
│   ├── envelope-system.js # Sistema de sobres
│   ├── transaction-manager.js # Gestión de transacciones
│   ├── analytics.js       # Análisis y gráficos
│   └── utils.js           # Funciones utilitarias
├── assets/
│   ├── icons/             # Iconos (placeholder)
│   └── avatars/           # Avatares (placeholder)
└── README.md              # Este archivo
```

## 🔒 Seguridad

- Autenticación mediante Firebase Authentication
- Reglas de seguridad en Firestore para proteger datos de usuarios
- Cada usuario solo puede acceder a sus propios datos
- Contraseñas hasheadas y almacenadas de forma segura por Firebase

## 🌍 Localización para Bolivia

- **Moneda**: Bolivianos (Bs.)
- **Formato**: Bs. 1.234,50
- **Fecha**: DD/MM/YYYY
- **Idioma**: Español

## 🐛 Solución de Problemas

### Error: Firebase no está configurado
**Solución**: Asegúrate de haber configurado correctamente las credenciales en `js/app.js`

### No se guardan los datos
**Solución**: Verifica que las reglas de Firestore estén configuradas correctamente

### La aplicación no carga
**Solución**: Abre la consola del navegador (F12) para ver errores específicos

### Error de CORS
**Solución**: Usa un servidor HTTP local en lugar de abrir el archivo directamente

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Eseve1**

## 🙏 Agradecimientos

- Metodología basada en el sistema de sobres Suizo/Alemán
- Inspiración de diseño de YNAB y Mint
- Iconos: Emojis nativos
- Gráficos: Chart.js

## 📞 Soporte

Si tienes preguntas o problemas, abre un issue en GitHub.

---

**¡Que cada familia pueda tomar control de sus finanzas! 💪💰**
