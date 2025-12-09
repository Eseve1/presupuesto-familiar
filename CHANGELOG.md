# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Versionado Semántico](https://semver.org/lang/es/).

## [1.0.0] - 2025-12-09

### 🎉 Lanzamiento Inicial - MVP

Primera versión funcional de Presupuesto Familiar con todas las características del MVP.

### ✨ Añadido

#### Autenticación y Usuario
- Sistema de autenticación con Firebase Auth
- Registro de usuarios con email y contraseña
- Inicio de sesión seguro
- Selección de modo de usuario (Adulto/Niños)
- Perfil de usuario con ingreso mensual
- Cambio de modo en cualquier momento
- Cierre de sesión

#### Sistema de Sobres
- Creación de sobres virtuales personalizados
- Categorización en tres grupos: Necesidades (50%), Personales (30%), Ahorros (20%)
- Asignación de presupuesto mensual a cada sobre
- Selección de iconos emoji para cada sobre
- Visualización del progreso con barras de colores (verde/amarillo/rojo)
- Edición de sobres existentes
- Eliminación de sobres
- Sobres predeterminados creados automáticamente en el registro

#### Gestión de Transacciones
- Registro de gastos asignados a sobres
- Registro de ingresos
- Descripción detallada de cada transacción
- Selección de fecha para cada transacción
- Visualización de transacciones recientes (últimas 10)
- Actualización automática de saldos en sobres
- Eliminación de transacciones con reversión de montos
- Formato de moneda boliviana (Bs.)

#### Dashboard y Análisis
- Dashboard principal con resumen financiero
- Tres tarjetas de resumen: Ingreso Total, Total Gastado, Disponible
- Sección de regla 50/30/20 con barras de progreso
- Cálculo automático de distribución por categoría
- Lista de sobres con información detallada
- Gráfico circular (dona) con Chart.js
- Distribución visual de gastos por sobre
- Actualización en tiempo real de estadísticas

#### Interfaz de Usuario
- Diseño responsive para móvil, tablet y desktop
- Modo Adulto con tema profesional (azul/gris)
- Modo Niños con tema colorido y divertido (morado/rosa/amarillo)
- Animaciones suaves y transiciones
- Notificaciones toast para feedback de acciones
- Modales para formularios (sobres y transacciones)
- Iconos emoji para mejor visualización
- Carga optimizada con overlay de loading

#### Persistencia de Datos
- Integración completa con Firebase Firestore
- Almacenamiento en la nube
- Sincronización automática
- Reglas de seguridad implementadas
- Datos organizados por usuario
- Consultas optimizadas con índices

#### Documentación
- README.md completo con guía de inicio
- FIREBASE_SETUP.md con instrucciones detalladas de configuración
- USAGE_GUIDE.md con guía de uso completa
- CONTRIBUTING.md para contribuidores
- Comentarios en el código fuente
- Estructura de archivos documentada

#### Configuración
- Archivo .gitignore configurado
- Archivo firestore.rules con reglas de seguridad
- Licencia MIT
- Estructura de carpetas organizada

### 🎨 Diseño

- Paleta de colores para modo adulto
- Paleta de colores para modo niños
- CSS modular (main.css, adult-theme.css, kids-theme.css)
- Uso de Tailwind CSS para utilidades
- Componentes reutilizables
- Diseño centrado en el usuario

### 🔒 Seguridad

- Autenticación segura con Firebase
- Reglas de Firestore para proteger datos
- Cada usuario solo accede a sus propios datos
- Validación en el cliente
- Manejo seguro de contraseñas (Firebase)

### 🌍 Localización

- Idioma: Español
- Formato de moneda: Boliviano (Bs. 1.234,50)
- Formato de fecha: DD/MM/YYYY
- Ejemplos contextualizados para Bolivia

### 📦 Dependencias

- Firebase 9.22.0 (Authentication y Firestore)
- Tailwind CSS (vía CDN)
- Chart.js 4.4.0

### 🐛 Correcciones

N/A - Primera versión

### 🔄 Cambios

N/A - Primera versión

### 🗑️ Eliminado

N/A - Primera versión

### 🔐 Seguridad

N/A - Primera versión

## [Futuras Versiones]

### [1.1.0] - Planeado

#### Metas de Ahorro
- Sistema de metas con progreso visual
- Calculadora de tiempo para alcanzar metas
- Sugerencias de ahorro
- Celebraciones al completar metas

#### Gamificación
- Sistema de puntos
- Niveles y badges
- Desafíos semanales
- Logros desbloqueables

### [1.2.0] - Planeado

#### Transacciones Recurrentes
- Configuración de gastos fijos
- Recordatorios de pagos
- Automatización de transacciones
- Calendario de pagos

#### Análisis Avanzado
- Tendencias mensuales/anuales
- Comparativa entre meses
- Identificación de gastos hormiga
- Proyecciones de ahorro

### [1.3.0] - Planeado

#### Exportación y Reportes
- Exportar a PDF
- Exportar a Excel/CSV
- Reportes personalizados
- Compartir resúmenes

#### Educación Financiera
- Tips diarios
- Lecciones interactivas
- Quizzes
- Glosario financiero

### [2.0.0] - Planeado

#### Características Avanzadas
- Modo offline
- Notificaciones push
- Multi-idioma
- Integración con bancos
- App móvil nativa

---

## Tipos de Cambios

- `✨ Añadido` para nuevas funcionalidades
- `🔄 Cambios` para cambios en funcionalidades existentes
- `🗑️ Eliminado` para funcionalidades eliminadas
- `🐛 Correcciones` para corrección de bugs
- `🔐 Seguridad` para vulnerabilidades corregidas

## Enlaces

- [GitHub Repository](https://github.com/Eseve1/presupuesto-familiar)
- [Issues](https://github.com/Eseve1/presupuesto-familiar/issues)
- [Pull Requests](https://github.com/Eseve1/presupuesto-familiar/pulls)
