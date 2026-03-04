# 🔄 ScrollForce → v1.3 Reestructurado (Plantilla)

## 🎯 Nueva Estructura

ScrollForce ahora sigue la estructura de la plantilla PWA v1.3:

```
scrollforce/
├── index.html          # ← NUEVO: Solo activación
├── auth.js             # ← ACTUALIZADO: v1.3 Safari compatible
├── manifest.json       # (mantener el actual)
├── sw.js               # (mantener el actual)
├── fenix.html          # (mantener el actual)
├── config.html         # (mantener el actual)
└── core/
    └── index.html      # ← NUEVO: Toda la aplicación
```

---

## 📂 Cambios principales:

### ✅ Antes (estructura antigua):
```
scrollforce/
└── index.html    # Todo mezclado: activación + validación + app (932 líneas)
```

### ✅ Ahora (estructura plantilla):
```
scrollforce/
├── index.html          # Solo activación (limpio, 156 líneas)
└── core/
    └── index.html      # Solo la app con validación (limpio)
```

---

## 🚀 Instrucciones de migración:

### Paso 1: Backup completo
```bash
# Haz backup de todo el proyecto
cp -r scrollforce scrollforce-backup
```

### Paso 2: Reemplazar archivos

**A. Archivos NUEVOS (crear):**
1. Crear carpeta `core/`
2. Poner `core/index.html` (el nuevo) en `core/`

**B. Archivos a REEMPLAZAR:**
1. `index.html` (raíz) → Reemplazar con el nuevo (solo activación)
2. `auth.js` → Reemplazar con v1.3

**C. Archivos a MANTENER (no tocar):**
- `manifest.json`
- `sw.js`
- `fenix.html`
- `config.html`
- Cualquier carpeta de imágenes o recursos

### Paso 3: Actualizar Service Worker (IMPORTANTE)

En `sw.js`, actualizar el array PRECACHE para incluir `core/`:

```javascript
const PRECACHE = [
  BASE,
  BASE + 'index.html',
  BASE + 'auth.js',
  BASE + 'core/index.html',  // ← AGREGAR ESTA LÍNEA
  BASE + 'fenix.html',
  BASE + 'config.html',
  BASE + 'manifest.json',
  // ... tus otros recursos
];
```

### Paso 4: Subir a GitHub
```bash
git add .
git commit -m "Restructure to v1.3 template - Safari iOS compatible"
git push
```

### Paso 5: Probar
1. Abre con código: `https://tudominio.com/?k=CODIGO`
2. Debe activar y redirigir a `/core/`
3. La app debe cargar normalmente
4. **Probar en Safari iOS** ✅

---

## ✅ Beneficios de la nueva estructura:

1. ✅ **Compatible Safari iOS** (sin módulos ES6)
2. ✅ **Más fácil de mantener** (separación clara)
3. ✅ **Homogéneo con otras PWAs** (misma estructura que Calculadora y MercadoForzado)
4. ✅ **Fácil de actualizar** (cambios aislados por archivo)
5. ✅ **Menos propenso a errores** (código más simple y separado)

---

## 🔍 Verificación post-migración:

- [ ] `index.html` solo muestra página de activación
- [ ] Al activar con código, redirige a `/core/`
- [ ] `/core/` carga la galería normalmente
- [ ] Validación de sesión funciona
- [ ] Botón de config lleva a `../config.html`
- [ ] Funcionamiento offline correcto
- [ ] **Todo funciona en Safari iOS** ✅

---

## ⚠️ Notas importantes:

### URLs actualizadas en core/:
- `./fenix.html` → `../fenix.html`
- `./activate.html` → `../` (index raíz)
- `./config.html` → `../config.html`

### Flujo de activación:
```
Usuario recibe: /?k=CODIGO
    ↓
index.html valida
    ↓
Redirige a: /core/
    ↓
core/index.html valida sesión
    ↓
Carga galería
```

---

## 🐛 Si algo sale mal:

### Problema: "No se encuentra core/index.html"
**Solución:** Verifica que creaste la carpeta `core/` y pusiste el archivo ahí

### Problema: "Loop de redirección"
**Solución:** Verifica que las rutas en `core/index.html` usan `../` correctamente

### Problema: "Config no funciona"
**Solución:** Verifica que `config.html` siga en la raíz (no en core/)

### Restaurar backup:
```bash
rm -rf scrollforce
mv scrollforce-backup scrollforce
```

---

## 📋 Archivos incluidos en esta actualización:

1. ✅ `index.html` - Activación (raíz)
2. ✅ `auth.js` - Autenticación v1.3 (raíz)
3. ✅ `core/index.html` - Aplicación completa

---

**✅ Después de esta reestructuración, ScrollForce será:**
- Compatible con Safari iOS
- Homogéneo con las otras PWAs
- Más fácil de mantener
- Siguiendo las mejores prácticas

🎬 ¡Scroll Force v1.3 listo!
