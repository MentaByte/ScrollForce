# Scroll Force v2.0 - Sistema de Autenticación Actualizado

App profesional de forzaje de imágenes con **nuevo sistema de autenticación mejorado**.

## 🆕 ¿Qué cambió?

### Sistema Anterior ❌
- Códigos gestionados manualmente en tabla `active_codes`
- Funciones edge `loginWithCode` y `validate-session`
- Un código = un dispositivo (límite de cambios diarios)
- Pantalla de activación integrada en la app

### Sistema Nuevo ✅
- **Tabla `licenses`** unificada (compatible con todas las PWAs)
- **Funciones `activate` y `validate`** estándar
- Un código = un dispositivo (sin límite de cambios)
- **Página de activación separada** (`activate.html`)
- **Detección automática de revocación** (`fenix.html`)
- **Mejor manejo offline**

---

## 📁 Estructura del Proyecto

```
scroll-force/
├── index.html          # Galería principal (PROTEGIDA)
├── activate.html       # Página de activación (NUEVA)
├── fenix.html          # Página de acceso revocado (NUEVA)
├── auth.js             # Sistema de autenticación (NUEVO)
├── config.html         # Configuración de imágenes
├── manifest.json       # PWA manifest
├── sw.js              # Service Worker (ACTUALIZADO)
├── images/            # Imágenes por defecto
│   ├── 1.jpg
│   ├── 2.jpg
│   ├── 3.jpg
│   ├── 4.jpg (forzaje por defecto)
│   ├── 5.jpg
│   ...
│   └── 20.jpg
├── icon-192.png       # Ícono PWA 192x192
└── icon-512.png       # Ícono PWA 512x512
```

---

## 🔐 Sistema de Autenticación

### 1. Generar Códigos en Supabase

```sql
-- Genera un código nuevo
INSERT INTO licenses DEFAULT VALUES
RETURNING code;

-- Genera múltiples códigos
INSERT INTO licenses DEFAULT VALUES
FROM generate_series(1, 10)
RETURNING code;
```

Los códigos tienen el formato: `MF-XXXX-XXXX-XXXX`

### 2. Compartir Link de Activación

```
https://tudominio.com/activate.html?k=MF-XXXX-XXXX-XXXX
```

### 3. Flujo del Usuario

```
Usuario abre link con código
    ↓
activate.html valida el código
    ↓
    ├─ ✅ Válido → Guarda sesión → Redirige a index.html
    ├─ ❌ Inválido → Muestra error
    ├─ 🚫 Revocado → Muestra error
    └─ 📱 Ya usado en otro device → Muestra error
    
    ↓
index.html valida sesión al cargar
    ↓
    ├─ ✅ Válida → Carga galería
    ├─ 🚫 Revocada → Redirige a fenix.html
    ├─ ⚠️ Sin internet → Usa caché (si hay sesión previa válida)
    └─ ❌ Sin sesión → Redirige a activate.html
```

---

## 🚀 Deploy en GitHub Pages

### Paso 1: Crear Repositorio

```bash
git init
git add .
git commit -m "Scroll Force v2.0 con nuevo sistema de auth"
git remote add origin https://github.com/TU-USUARIO/scroll-force.git
git branch -M main
git push -u origin main
```

### Paso 2: Activar GitHub Pages

1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: main → / (root)
4. Save

URL: `https://TU-USUARIO.github.io/scroll-force/`

---

## 📸 Preparar Imágenes

Coloca 20 imágenes en `/images/`:
- Nombradas: 1.jpg, 2.jpg, ... 20.jpg
- Tamaño recomendado: 1080x1920 (vertical)
- Formato: JPG o PNG

Los usuarios pueden personalizarlas desde el botón ⚙️ (se guardan en IndexedDB local).

---

## ⚙️ Configuración

### Cambiar Imagen de Forzaje

En `index.html`, línea ~699:
```javascript
let FORCE_IMAGE_INDEX = 4; // Cambiar a 1-20
```

### Cambiar Cantidad de Toques

En `index.html`, línea ~700:
```javascript
let TOUCH_THRESHOLD = 10; // Cambiar a cualquier número
```

### Cambiar Total de Imágenes

En `index.html`, línea ~698:
```javascript
const TOTAL_IMAGES = 20; // Cambiar si tienes más/menos imágenes
```

---

## 🛡️ Revocar Acceso

```sql
UPDATE licenses
SET revoked = TRUE
WHERE code = 'MF-XXXX-XXXX-XXXX';
```

La próxima vez que el usuario abra la app (con internet), será redirigido automáticamente a `fenix.html`.

---

## 📱 Instalación como PWA

### iOS (Safari)
1. Abrir en Safari
2. Botón compartir
3. "Agregar a pantalla de inicio"

### Android (Chrome)
1. Abrir en Chrome
2. Botón "Instalar App"
3. O menú → "Añadir a pantalla de inicio"

---

## 🔧 Testing Local

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx serve

# Luego abrir: http://localhost:8000/activate.html?k=TU-CODIGO
```

---

## ✅ Checklist Pre-Deploy

- [ ] 20 imágenes en `/images/` (1.jpg - 20.jpg)
- [ ] Iconos PWA (icon-192.png, icon-512.png)
- [ ] Códigos generados en Supabase (tabla `licenses`)
- [ ] Funciones edge `activate` y `validate` desplegadas
- [ ] Testeado con código válido en móvil
- [ ] Probado flujo de revocación
- [ ] Verificado funcionamiento offline

---

## 🎯 Diferencias Clave con el Sistema Anterior

| Característica | Anterior | Nuevo |
|----------------|----------|-------|
| Tabla | `active_codes` | `licenses` |
| Funciones | `loginWithCode`, `validate-session` | `activate`, `validate` |
| Activación | Integrada en `index.html` | Página separada `activate.html` |
| Revocación | Manual | Automática + página `fenix.html` |
| Cambio de dispositivo | Límite diario | Sin límite |
| Offline | Básico | Mejorado con `last_known_status` |
| Compatibilidad | Solo Scroll Force | Todas las PWAs con esta plantilla |

---

## 📊 Ventajas del Nuevo Sistema

✅ **Más robusto**: Mejor manejo de errores y estados  
✅ **Más flexible**: Sin límites de cambio de dispositivo  
✅ **Mejor UX**: Mensajes claros en cada paso  
✅ **Offline mejorado**: Funciona sin internet después de primera carga  
✅ **Reutilizable**: Mismo sistema para múltiples PWAs  
✅ **Mantenible**: Código más limpio y separación de responsabilidades  

---

## 🆘 Migración desde el Sistema Anterior

Si ya tienes usuarios con el sistema anterior:

1. **Opción A - Migración gradual:**
   - Mantén ambos sistemas activos temporalmente
   - Genera nuevos códigos en tabla `licenses`
   - Comunica a usuarios que deben usar nuevo link

2. **Opción B - Migración de datos:**
   ```sql
   -- Copiar códigos existentes a la nueva tabla
   INSERT INTO licenses (code, device_id, revoked, created_at)
   SELECT code, NULL, is_activated, created_at
   FROM active_codes;
   ```

---

## 💡 Tips

- Los códigos se crean automáticamente con formato `MF-XXXX-XXXX-XXXX`
- Las imágenes personalizadas NO se sincronizan entre dispositivos
- La validación es **siempre fresca** cuando hay internet
- El caché permite uso **100% offline** después de primera carga
- Si cambias de teléfono, solo ingresa el código nuevamente

---

**Creado con ❤️ para magos profesionales**  
Versión 2.0 - Sistema de autenticación mejorado
