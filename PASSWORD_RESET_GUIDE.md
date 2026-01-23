# Sistema de Reseteo de Contraseña - Guía de Configuración

## Descripción General

Se ha implementado un sistema completo de reseteo de contraseña usando Supabase que permite a los usuarios recuperar acceso a sus cuentas de forma segura.

## Archivos Creados/Modificados

### Archivos Nuevos
1. **`app/components/forgot-password.tsx`** - Componente para solicitar reseteo de contraseña
2. **`app/auth/reset-password/page.tsx`** - Página donde el usuario confirma la nueva contraseña

### Archivos Modificados
1. **`app/lib/supabase-client.ts`** - Agregadas funciones de reseteo:
   - `requestPasswordReset(email)` - Solicita un enlace de reseteo
   - `updatePassword(newPassword)` - Actualiza la contraseña
   - `verifyPasswordToken(token)` - Verifica el token de recuperación

2. **`app/context/auth-context.tsx`** - Agregada función al contexto:
   - `requestPasswordReset(email)` - Expuesta en el AuthContext

3. **`app/components/sidebar.tsx`** - Integración de UI:
   - Nuevo estado `isAuthMode` con opción "forgot"
   - Enlace "¿Olvidaste tu contraseña?" en el formulario de login
   - Componente `ForgotPassword` integrado en el sidebar

## Configuración en Supabase

### 1. Habilitar Email Confirmation

Para que funcione el sistema de reseteo, necesitas configurar las plantillas de email en Supabase:

1. Ve a **Authentication → Email Templates**
2. Configura la plantilla de **Password Recovery** con algo similar a:

```
<h2>Resetear tu contraseña</h2>
<p>Haz clic en el enlace de abajo para resetear tu contraseña:</p>
<a href="{{ .ConfirmationURL }}">Resetear Contraseña</a>
<p>Este enlace expira en 24 horas.</p>
```

### 2. Configurar Redirect URLs

1. Ve a **Authentication → URL Configuration**
2. Agrega tu URL de reseteo a **Redirect URLs**:
   ```
   http://localhost:3000/auth/reset-password
   ```
   
   Para producción:
   ```
   https://tudominio.com/auth/reset-password
   ```

### 3. Variables de Entorno

Asegúrate de tener en tu `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Flujo de Uso

### 1. Usuario Solicita Reseteo

```
Usuario → Sidebar (Login) → "¿Olvidaste tu contraseña?" 
→ Componente ForgotPassword → Ingresa email → Envía solicitud
```

**Resultado**: Supabase envía email con enlace de reseteo

### 2. Usuario Accede al Enlace

Usuario recibe email con enlace similar a:
```
https://tudominio.com/auth/reset-password?code=XXXXX&type=recovery
```

### 3. Usuario Confirma Nueva Contraseña

```
Página reset-password (validación del token) 
→ Usuario ingresa nueva contraseña 
→ Confirma contraseña 
→ Sistema actualiza contraseña
→ Redirige al login
```

## Validaciones Implementadas

- ✅ Validación de token de recuperación
- ✅ Contraseña mínimo 8 caracteres
- ✅ Las contraseñas deben coincidir
- ✅ Validación de email válido
- ✅ Manejo de errores y mensajes claros
- ✅ Toggle mostrar/ocultar contraseña

## Componentes UI Utilizados

- `Button` - Botones reutilizables
- `Input` - Campos de entrada
- `Alert` - Mensajes de error/éxito
- Iconos de `lucide-react`:
  - `Eye` / `EyeOff` - Mostrar/ocultar contraseña
  - `CheckCircle` - Confirmación exitosa
  - `AlertCircle` - Errores
  - `ArrowLeft` - Botón atrás

## Testing

### 1. Prueba Local

```bash
npm run dev
# Abre http://localhost:3000
# Haz clic en el menú (☰)
# Selecciona "Iniciar Sesión"
# Haz clic en "¿Olvidaste tu contraseña?"
# Ingresa un email registrado
```

### 2. Prueba de Email (Supabase)

Si estás usando Supabase en modo desarrollo:
- Los emails se envían a través de Supabase
- Verifica en la consola de Supabase → Authentication → Logs

## Manejo de Errores

El sistema maneja:

1. **Token expirado/inválido** → Muestra enlace inválido
2. **Email no encontrado** → Muestra mensaje de error
3. **Contraseñas no coinciden** → Validación local
4. **Contraseña muy corta** → Requisitos mínimos

## Seguridad

- ✅ Contraseñas nunca se almacenan en texto plano
- ✅ Tokens de recuperación expiran después de 24 horas (configurable en Supabase)
- ✅ HTTPS requerido en producción
- ✅ Validación en cliente y servidor

## Próximos Pasos Opcionales

1. **Agregar reCAPTCHA** en el formulario de solicitud
2. **Rate limiting** para prevenir abuso
3. **Notificación en email** cuando se cambia contraseña
4. **Autenticación de dos factores (2FA)**
5. **Historial de cambios de contraseña**

## Troubleshooting

### El email no se recibe

1. Verifica que SMTP esté configurado en Supabase
2. Revisa la carpeta de spam/correo no deseado
3. Verifica los logs en Supabase → Authentication

### El enlace de reseteo no funciona

1. Asegúrate de que la URL está configurada en Redirect URLs
2. Verifica que `window.location.origin` es correcto
3. Comprueba que el token no está expirado (24 horas)

### Error de contraseña

1. Mínimo 8 caracteres requeridos
2. Las contraseñas deben coincidir exactamente
3. No puede ser la misma que la actual

## API Reference

```typescript
// Solicitar reseteo de contraseña
await requestPasswordReset(email: string)

// Actualizar contraseña (después de validar token)
await updatePassword(newPassword: string)

// Verificar token (uso interno)
await verifyPasswordToken(token: string)
```

## Documentación de Referencia

- [Supabase Auth - Password Recovery](https://supabase.com/docs/guides/auth/password-reset)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-smtp)
- [Next.js Search Params](https://nextjs.org/docs/app/api-reference/functions/use-search-params)
