# ✅ Checklist - Sistema de Reseteo de Contraseña

## Implementación (✅ Completado)

- [x] Crear componente `forgot-password.tsx`
- [x] Crear página `auth/reset-password/page.tsx`
- [x] Agregar funciones en `supabase-client.ts`
- [x] Actualizar `auth-context.tsx`
- [x] Integrar en `sidebar.tsx`
- [x] Verificar que compila sin errores
- [x] Crear documentación

## Configuración en Supabase (⏳ SIGUIENTE)

- [ ] **1. Configurar Email Recovery Template**
  - Ir a: `Supabase Console → Authentication → Email Templates`
  - Buscar: "Password Recovery" (o crear si no existe)
  - Personalizar el template (opcional):
    ```html
    <h2>Recuperar tu contraseña</h2>
    <p>Haz clic en el enlace de abajo para resetear tu contraseña:</p>
    <a href="{{ .ConfirmationURL }}">Resetear Contraseña</a>
    ```

- [ ] **2. Agregar URLs de Redirección**
  - Ir a: `Supabase Console → Authentication → URL Configuration`
  - Scroll hasta "Redirect URLs"
  - Agregar una nueva URL:
    - **Para desarrollo**: `http://localhost:3000/auth/reset-password`
    - **Para producción**: `https://tudominio.com/auth/reset-password`
  - Hacer clic en "Save"

- [ ] **3. Verificar SMTP (si es necesario)**
  - Si usas Supabase en desarrollo, los emails se envían automáticamente
  - Para producción con dominio propio:
    - Ir a: `Authentication → Email → SMTP Settings`
    - Configurar credenciales SMTP
    - Probar conexión

## Pruebas Locales (🧪 DESPUÉS)

- [ ] **1. Iniciar el servidor**
  ```bash
  npm run dev
  ```

- [ ] **2. Probar flujo completo**
  - Acceder a `http://localhost:3000`
  - Hacer clic en menú (☰)
  - Seleccionar "Iniciar Sesión"
  - Hacer clic en "¿Olvidaste tu contraseña?"
  - Ingresar email registrado
  - Hacer clic en "Enviar enlace de reseteo"
  - Esperar confirmación

- [ ] **3. Verificar email** (en desarrollo)
  - Revisar logs de Supabase: `Authentication → Logs`
  - En producción, revisar tu cliente de email

- [ ] **4. Hacer clic en el enlace**
  - Copiar enlace del email
  - Abrir en navegador
  - Debe mostrar página de reseteo

- [ ] **5. Confirmar nueva contraseña**
  - Ingresar nueva contraseña (mín. 8 caracteres)
  - Confirmar contraseña
  - Hacer clic en "Actualizar contraseña"
  - Debe redirigir al login

- [ ] **6. Iniciar sesión con nueva contraseña**
  - Email: el que usaste
  - Contraseña: la nueva
  - Debe iniciar sesión correctamente

## Pruebas Casos de Error (🧪 DESPUÉS)

- [ ] **1. Email no registrado**
  - Ingresar email que no existe
  - Debe mostrar error o mensaje "Revisa tu email"

- [ ] **2. Contraseña muy corta**
  - Ingresar contraseña con < 8 caracteres
  - Debe mostrar error "Mínimo 8 caracteres"

- [ ] **3. Contraseñas no coinciden**
  - Ingresar diferentes contraseñas
  - Hacer clic en actualizar
  - Debe mostrar error

- [ ] **4. Token expirado**
  - Esperar > 24 horas (o falsificar token)
  - Acceder a URL de reseteo
  - Debe mostrar "Enlace inválido o expirado"

- [ ] **5. Volver desde forgot-password**
  - En pantalla de olvido, hacer clic en "Volver"
  - Debe volver a login

## Despliegue a Producción (🚀 FINAL)

- [ ] **1. Variables de entorno**
  - Verificar `.env.local` tiene credenciales Supabase
  - O agregarlas en plataforma de hosting

- [ ] **2. Configurar URL de producción**
  - Agregar URL de producción en Supabase Redirect URLs
  - Ejemplo: `https://poopsalary.com/auth/reset-password`

- [ ] **3. Configurar SMTP (opcional)**
  - Si quieres usar tu propio servidor de email
  - O usar el SMTP de Supabase (recomendado)

- [ ] **4. Build y deploy**
  ```bash
  npm run build
  npm run start
  # O usar tu plataforma de hosting (Vercel, Netlify, etc)
  ```

- [ ] **5. Prueba en producción**
  - Acceder a la URL de producción
  - Seguir mismo flujo de pruebas

## Documentos Creados

- 📄 `PASSWORD_RESET_GUIDE.md` - Guía detallada de configuración
- 📄 `RESUMEN_RESETEO_CONTRASEÑA.md` - Resumen de implementación
- 📄 `CHECKLIST_RESETEO.md` - Este archivo

## Archivos Modificados

- `app/lib/supabase-client.ts` - Agregadas 3 funciones
- `app/context/auth-context.tsx` - Agregada función de reseteo
- `app/components/sidebar.tsx` - Integrada UI de reseteo

## Archivos Creados

- `app/components/forgot-password.tsx` - Componente de solicitud
- `app/auth/reset-password/page.tsx` - Página de confirmación

## Contacto/Ayuda

Si tienes problemas:

1. **Verifica los logs de Supabase**: `Authentication → Logs`
2. **Lee la documentación**: `PASSWORD_RESET_GUIDE.md`
3. **Revisa el resumen**: `RESUMEN_RESETEO_CONTRASEÑA.md`
4. **Compila el proyecto**: `npm run build`

## Notas Importantes ⚠️

- ⏰ Los tokens de recuperación expiran en **24 horas**
- 🔒 Las contraseñas se validan en **lado del servidor** por Supabase
- 📧 Necesitas **SMTP configurado** para que lleguen los emails
- 🌐 En **producción**, siempre usa **HTTPS**
- 🔑 Nunca expongas tus credenciales de Supabase

## Estado Actual

```
✅ Código: Completado
⏳ Configuración Supabase: Pendiente
🧪 Pruebas: No iniciadas
🚀 Producción: No desplegado
```

---

**Última actualización**: 23 de enero de 2026
**Versión**: 1.0 ✅
