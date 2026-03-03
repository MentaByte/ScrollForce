# 🔄 Guía de Migración - Scroll Force v2.0

## Migración del Sistema de Autenticación Antiguo al Nuevo

---

## 📋 Resumen de Cambios

### Archivos Eliminados ❌
- Ninguno (solo se modifican)

### Archivos Nuevos ✅
- `auth.js` - Sistema de autenticación compartido
- `activate.html` - Página de activación
- `fenix.html` - Página de acceso revocado

### Archivos Modificados 🔧
- `index.html` - Sistema de validación actualizado
- `sw.js` - Nuevas rutas y caché actualizado
- `manifest.json` - Start URL actualizado
- `README.md` - Documentación nueva

---

## 🎯 Pasos de Migración

### Paso 1: Verificar Funciones de Supabase

Asegúrate de que existen las funciones `activate` y `validate` en Supabase Edge Functions.

**Si NO existen:**
1. Ve a Supabase Dashboard → Edge Functions
2. Crea `activate` y `validate` usando el código de la plantilla
3. Despliega ambas funciones

**Verificar tabla `licenses`:**
```sql
SELECT * FROM licenses LIMIT 1;
```

Si no existe, créala según el schema en `DATABASE.md` de la plantilla.

---

### Paso 2: Backup del Proyecto Actual

```bash
# Crea una copia de seguridad
cp -r scroll-force scroll-force-backup

# O crea un commit de Git
git add .
git commit -m "Backup antes de migrar a v2.0"
```

---

### Paso 3: Reemplazar Archivos

#### 3.1 Agregar Archivos Nuevos

Copia estos archivos del paquete `scroll-force-updated/`:

```bash
# Copiar archivos nuevos
cp scroll-force-updated/auth.js scroll-force/
cp scroll-force-updated/activate.html scroll-force/
cp scroll-force-updated/fenix.html scroll-force/
```

#### 3.2 Reemplazar Archivos Existentes

```bash
# Reemplazar archivos modificados
cp scroll-force-updated/index.html scroll-force/
cp scroll-force-updated/sw.js scroll-force/
cp scroll-force-updated/manifest.json scroll-force/
cp scroll-force-updated/README.md scroll-force/
```

**⚠️ IMPORTANTE:** Mantén tu carpeta `/images/` y tus íconos (icon-192.png, icon-512.png).

---

### Paso 4: Generar Códigos Nuevos

#### Opción A: Códigos Nuevos (Recomendado)

```sql
-- Genera 10 códigos nuevos para tus usuarios
INSERT INTO licenses DEFAULT VALUES
FROM generate_series(1, 10)
RETURNING code;
```

#### Opción B: Migrar Códigos Existentes

Si quieres conservar los códigos de `active_codes`:

```sql
-- Migrar códigos existentes a la nueva tabla
INSERT INTO licenses (code, created_at)
SELECT code, created_at
FROM active_codes
WHERE is_activated = FALSE;
```

**Nota:** Los códigos migrados NO tendrán el `device_id` asignado, así que los usuarios deberán activarlos de nuevo.

---

### Paso 5: Actualizar Links de Activación

#### Formato Antiguo ❌
```
https://tudominio.com/?CODIGO
```

#### Formato Nuevo ✅
```
https://tudominio.com/activate.html?k=MF-XXXX-XXXX-XXXX
```

**Comunicación a usuarios:**
```
Hola! 👋

Hemos actualizado Scroll Force. Para seguir usándola:

1. Desinstala la app actual de tu pantalla de inicio
2. Abre este link en tu navegador: 
   https://tudominio.com/activate.html?k=TU-CODIGO-AQUI
3. Sigue las instrucciones para instalarla de nuevo

¡Gracias!
```

---

### Paso 6: Deploy

```bash
# Commit de los cambios
git add .
git commit -m "Actualizar a sistema de auth v2.0"

# Push a GitHub
git push origin main
```

GitHub Pages se actualizará automáticamente en 1-2 minutos.

---

### Paso 7: Validar la Migración

#### Test 1: Activación con código nuevo
1. Abre `https://tudominio.com/activate.html?k=CODIGO-VALIDO`
2. Verifica que activa correctamente
3. Verifica que redirige a `index.html`
4. Verifica que carga la galería

#### Test 2: Validación de sesión
1. Cierra y vuelve a abrir la app (desde el ícono instalado)
2. Verifica que NO pide código de nuevo
3. Verifica que carga directamente la galería

#### Test 3: Revocación
```sql
UPDATE licenses 
SET revoked = TRUE 
WHERE code = 'TU-CODIGO-DE-TEST';
```
4. Abre la app de nuevo (con internet)
5. Verifica que redirige a `fenix.html`

#### Test 4: Funcionamiento offline
1. Activa un código y carga la app
2. Activa modo avión
3. Abre la app desde el ícono
4. Verifica que funciona sin internet

---

## 🔧 Troubleshooting

### Problema: "No se proporcionó un código de activación"

**Causa:** El usuario abrió `index.html` directamente en lugar de `activate.html`

**Solución:**
```javascript
// En index.html, la validación ya redirige automáticamente
// Si no tiene sesión → redirige a activate.html
```

### Problema: Service Worker antiguo en caché

**Solución:**
```bash
# Cambia el CACHE_NAME en sw.js
const CACHE_NAME = 'ScrollForce-v2.1'; // Incrementa la versión
```

### Problema: Los usuarios no pueden activar sus códigos antiguos

**Solución:**
```sql
-- Verifica que el código existe en la tabla licenses
SELECT * FROM licenses WHERE code = 'CODIGO-ANTIGUO';

-- Si no existe, créalo manualmente
INSERT INTO licenses (code) VALUES ('CODIGO-ANTIGUO');
```

### Problema: La app se queda en pantalla de carga

**Solución:**
1. Abre DevTools → Console
2. Busca errores de red o JavaScript
3. Verifica que las funciones `activate` y `validate` estén desplegadas
4. Verifica las credenciales de Supabase en `auth.js`

---

## ✅ Checklist Post-Migración

- [ ] Funciones `activate` y `validate` desplegadas en Supabase
- [ ] Tabla `licenses` existe y tiene códigos
- [ ] Archivos nuevos copiados (`auth.js`, `activate.html`, `fenix.html`)
- [ ] Archivos modificados actualizados (`index.html`, `sw.js`, `manifest.json`)
- [ ] Service Worker actualizado (CACHE_NAME incrementado)
- [ ] Test de activación pasado
- [ ] Test de validación pasado
- [ ] Test de revocación pasado
- [ ] Test offline pasado
- [ ] Usuarios notificados del cambio
- [ ] Links de activación actualizados

---

## 📊 Comparación de Comportamiento

### Activación

| Aspecto | Antiguo | Nuevo |
|---------|---------|-------|
| URL | `/?CODIGO` | `/activate.html?k=CODIGO` |
| Página | Integrada en index.html | Página separada |
| Validación | `loginWithCode` | `activate` |
| Redirección | Galería directa | index.html → validación → galería |

### Validación Continua

| Aspecto | Antiguo | Nuevo |
|---------|---------|-------|
| Función | `validate-session` | `validate` |
| Frecuencia | Solo al abrir | Al abrir siempre |
| Offline | Sin manejo | Estado conocido guardado |
| Revocación | Sin redirección | Redirige a fenix.html |

---

## 💡 Recomendaciones

1. **Migra en horario de bajo tráfico** para minimizar impacto
2. **Notifica a usuarios con anticipación** (24-48 horas)
3. **Mantén backup por 1 semana** por si necesitas rollback
4. **Monitorea logs de Supabase** las primeras 24 horas
5. **Ten códigos de prueba listos** para validar todo funciona

---

## 🚨 Plan de Rollback

Si algo sale mal:

```bash
# Restaurar desde backup
rm -rf scroll-force
cp -r scroll-force-backup scroll-force

# O usar Git
git reset --hard HEAD~1
git push -f origin main
```

---

## 📞 Soporte

Si encuentras problemas durante la migración:

1. Revisa los logs de Supabase Edge Functions
2. Revisa la consola del navegador (DevTools)
3. Verifica que las credenciales de Supabase son correctas
4. Compara con los archivos de la plantilla original

---

**¡Éxito con la migración!** 🎉

La nueva versión es más robusta, mantenible y compatible con futuras PWAs.
