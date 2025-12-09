# 🤝 Guía de Contribución

¡Gracias por tu interés en contribuir a Presupuesto Familiar! Esta guía te ayudará a empezar.

## 🌟 Formas de Contribuir

- 🐛 Reportar bugs
- 💡 Sugerir nuevas características
- 📝 Mejorar la documentación
- 🔧 Enviar pull requests con mejoras
- 🌍 Traducciones a otros idiomas
- 🎨 Mejorar el diseño y UX

## 📋 Antes de Empezar

1. **Revisa los issues existentes** para evitar duplicados
2. **Lee el README.md** para entender el proyecto
3. **Configura tu entorno** siguiendo FIREBASE_SETUP.md
4. **Familiarízate con el código** explorando la estructura

## 🚀 Proceso de Contribución

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub
# Luego clona tu fork
git clone https://github.com/TU_USUARIO/presupuesto-familiar.git
cd presupuesto-familiar
```

### 2. Crea una Rama

```bash
# Crea una rama descriptiva
git checkout -b feature/nueva-funcionalidad
# o
git checkout -b fix/correccion-bug
```

### 3. Realiza tus Cambios

- Escribe código limpio y bien comentado
- Sigue las convenciones del proyecto
- Prueba tus cambios localmente
- Asegúrate de que no rompes funcionalidad existente

### 4. Commit

```bash
# Commits descriptivos y atómicos
git add .
git commit -m "feat: agregar calculadora de interés compuesto"
# o
git commit -m "fix: corregir cálculo de porcentaje en sobres"
```

**Convención de commits:**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (sin afectar código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

### 5. Push y Pull Request

```bash
git push origin feature/nueva-funcionalidad
```

Luego crea un Pull Request en GitHub con:
- Título descriptivo
- Descripción detallada de los cambios
- Referencias a issues relacionados
- Screenshots si hay cambios visuales

## 📝 Estándares de Código

### JavaScript

```javascript
// Usa nombres descriptivos
const calculateMonthlyBudget = (income) => {
    // Comenta lógica compleja
    const needs = income * 0.50; // 50% para necesidades
    return needs;
};

// Evita
const calc = (i) => i * 0.5;
```

### HTML

```html
<!-- Usa clases semánticas -->
<div class="envelope-card">
    <h3 class="envelope-title">Comida</h3>
</div>

<!-- Evita -->
<div class="card1">
    <h3 class="t1">Comida</h3>
</div>
```

### CSS

```css
/* Organiza por componentes */
/* Envelope Card Styles */
.envelope-card {
    border-radius: 0.5rem;
    padding: 1rem;
}

/* Usa variables CSS cuando sea posible */
.button-primary {
    background-color: var(--primary-color);
}
```

## 🎯 Áreas Prioritarias

Estas son áreas donde más necesitamos ayuda:

### Alta Prioridad
- [ ] Sistema de metas de ahorro
- [ ] Exportación a PDF
- [ ] Transacciones recurrentes
- [ ] Tests unitarios
- [ ] Análisis de tendencias

### Media Prioridad
- [ ] Gamificación completa para niños
- [ ] Módulo educativo
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Compartir reportes

### Baja Prioridad
- [ ] Soporte multi-idioma
- [ ] Temas personalizados
- [ ] Integración con bancos
- [ ] App móvil nativa

## 🐛 Reportar Bugs

Usa el siguiente template:

```markdown
### Descripción del Bug
Descripción clara del problema.

### Pasos para Reproducir
1. Ve a '...'
2. Haz clic en '...'
3. Observa el error

### Comportamiento Esperado
Qué debería pasar.

### Comportamiento Actual
Qué pasa actualmente.

### Screenshots
Si aplica, agrega capturas de pantalla.

### Entorno
- Navegador: [ej: Chrome 120]
- SO: [ej: Windows 11]
- Versión de la app: [ej: 1.0.0]

### Información Adicional
Cualquier otro contexto relevante.
```

## 💡 Sugerir Funcionalidades

Usa el siguiente template:

```markdown
### Descripción de la Funcionalidad
Descripción clara de lo que propones.

### Problema que Resuelve
¿Qué problema o necesidad aborda?

### Solución Propuesta
Cómo funcionaría la funcionalidad.

### Alternativas Consideradas
Otras formas de resolver el problema.

### Contexto Adicional
Mockups, ejemplos, referencias, etc.
```

## 🧪 Testing

Antes de enviar tu PR:

1. **Prueba manualmente** todas las funcionalidades afectadas
2. **Verifica en múltiples navegadores**:
   - Chrome/Edge
   - Firefox
   - Safari (si es posible)
3. **Prueba responsive** en diferentes tamaños:
   - Móvil (375px)
   - Tablet (768px)
   - Desktop (1024px+)
4. **Revisa la consola** para errores JavaScript
5. **Valida el HTML** si modificaste estructura

## 📚 Documentación

Si agregas funcionalidades:

1. **Actualiza README.md** si es una funcionalidad mayor
2. **Actualiza USAGE_GUIDE.md** con instrucciones de uso
3. **Comenta el código** especialmente lógica compleja
4. **Agrega ejemplos** en la documentación

## 🎨 Diseño y UX

### Principios de Diseño

- **Simplicidad**: Interfaces limpias y fáciles de usar
- **Consistencia**: Mantén el estilo coherente
- **Accesibilidad**: Considera usuarios con discapacidades
- **Responsive**: Funciona en todos los dispositivos
- **Performance**: Optimiza para carga rápida

### Colores

Respeta las paletas definidas:

**Modo Adulto:**
- Primario: `#2563eb` (azul)
- Éxito: `#10b981` (verde)
- Advertencia: `#f59e0b` (amarillo)
- Peligro: `#ef4444` (rojo)

**Modo Niños:**
- Primario: `#a855f7` (morado)
- Secundario: `#ec4899` (rosa)
- Acento: `#fbbf24` (amarillo)

## 🔍 Revisión de Código

Los mantenedores revisarán tu PR considerando:

- ✅ Calidad del código
- ✅ Tests y validación
- ✅ Documentación
- ✅ Compatibilidad
- ✅ Performance
- ✅ Seguridad

Podemos solicitar cambios. ¡No te desanimes! Es parte del proceso.

## 🌍 Internacionalización

Si quieres agregar soporte para otro idioma:

1. Crea archivos de traducción en `/i18n/`
2. Usa la estructura de Bolivia/español como referencia
3. Considera diferencias culturales en:
   - Formatos de fecha
   - Formatos de moneda
   - Ejemplos y terminología

## 📜 Código de Conducta

### Nuestro Compromiso

Mantener un ambiente inclusivo, respetuoso y acogedor.

### Comportamientos Esperados

- ✅ Ser respetuoso con diferentes opiniones
- ✅ Aceptar críticas constructivas
- ✅ Enfocarse en lo mejor para la comunidad
- ✅ Mostrar empatía hacia otros

### Comportamientos Inaceptables

- ❌ Lenguaje ofensivo o inapropiado
- ❌ Ataques personales
- ❌ Acoso en cualquier forma
- ❌ Publicar información privada sin permiso

## 📞 Contacto

- **Issues**: Para bugs y sugerencias
- **Discussions**: Para preguntas generales
- **Email**: (Si tienes uno público)

## ⭐ Reconocimiento

Todos los contribuidores serán reconocidos en:
- README.md (sección de contribuidores)
- Changelog del release
- Commits del proyecto

## 📄 Licencia

Al contribuir, aceptas que tus contribuciones se licenciarán bajo la licencia MIT del proyecto.

---

**¡Gracias por hacer de Presupuesto Familiar una mejor herramienta para todos! 🙏**
