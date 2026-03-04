# 🔄 Actualización ScrollForce → v1.3 (Safari compatible)

## 📂 Archivos a reemplazar:

### 1. `auth.js` (raíz del proyecto)
✅ **Reemplaza completamente** el archivo actual con el nuevo

**Cambio principal:**
- Fix de `crypto.randomUUID` → Compatible Safari iOS

---

### 2. `index.html` (raíz del proyecto - archivo principal)
✅ **Reemplaza completamente** el archivo actual con el nuevo

**Cambios principales:**
- Sin import de módulos ES6 (línea 516)
- Funciones de auth integradas inline (líneas 516-578)
- Todo el código de ScrollForce se mantiene igual
- Compatible Safari iOS

**🔧 Cambio específico:**
- **Antes:** `import { validateSession, clearSession } from "./auth.js";` ❌
- **Ahora:** Funciones inline sin import ✅

---

## 🚀 Instrucciones de actualización:

### Paso 1: Backup (recomendado)
```bash
# Haz backup de tus archivos actuales
cp auth.js auth.js.backup
cp index.html index.html.backup
```

### Paso 2: Reemplazar archivos
1. Reemplaza `auth.js` con el nuevo
2. Reemplaza `index.html` con el nuevo

### Paso 3: Subir a GitHub
```bash
git add auth.js index.html
git commit -m "Update to v1.3 - Safari iOS compatible"
git push
```

### Paso 4: Probar
1. Abre en Chrome/Android → Debe seguir funcionando
2. Abre en Safari/iOS → **Debe funcionar ahora** ✅

---

## ✅ Verificación

Después de actualizar, verifica que:
- [ ] La app se abre en Chrome
- [ ] La app se abre en Safari iOS
- [ ] La validación de sesión funciona
- [ ] El scroll funciona
- [ ] Las imágenes cargan correctamente
- [ ] Todas las funcionalidades de ScrollForce siguen igual

---

## ⚠️ Notas importantes

1. **NO** modifiques las funciones de auth inline (líneas 516-578)
2. Todo tu código personalizado de ScrollForce se mantiene intacto
3. Solo cambia el sistema de autenticación

---

## 🐛 Si algo sale mal

1. Restaura los backups:
```bash
cp auth.js.backup auth.js
cp index.html.backup index.html
```

2. Revisa los archivos y comparte el error

---

## 📝 Estructura de ScrollForce

ScrollForce usa una estructura simple:
```
scrollforce/
├── index.html         # Archivo principal (TODO en uno)
├── auth.js            # Autenticación (v1.3)
├── config.html        # Configuración
├── activate.html      # Activación
├── fenix.html         # Revocación
└── manifest.json      # PWA config
```

---

**✅ Después de esta actualización, ScrollForce funcionará perfectamente en Safari iOS**
