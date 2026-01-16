# 🚀 Inicio Rápido - Poop Salary con Supabase

## Paso 1: Preparación (5 minutos)

```bash
# 1. Instalar dependencias (ya hecho)
npm install

# 2. Copiar variables de entorno
cp .env.local.example .env.local
```

## Paso 2: Configurar Supabase (10 minutos)

### 2.1 Crear proyecto en Supabase

1. Ve a https://supabase.com
2. Clic en "Start your project for free"
3. Inicia sesión con GitHub o email
4. Crea un nuevo proyecto

### 2.2 Obtener credenciales

1. En tu proyecto, ve a **Settings** (esquina inferior izquierda)
2. Abre pestaña **API**
3. Copia:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys → anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2.3 Configurar .env.local

Abre `.env.local` y pega:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 3: Crear Tablas (5 minutos)

En Supabase, ve a **SQL Editor** y copia/pega esto:

```sql
-- ============================================
-- TABLA DE PERFILES DE USUARIO
-- ============================================
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  annual_gross DECIMAL(15, 2) DEFAULT 0,
  currency_code VARCHAR(3) DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "ver_propio_perfil" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "actualizar_propio_perfil" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "crear_propio_perfil" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLA DE SESIONES DE POOP
-- ============================================
CREATE TABLE poop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds DECIMAL(10, 2) NOT NULL,
  earned_money DECIMAL(15, 4) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security
ALTER TABLE poop_sessions ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad
CREATE POLICY "ver_propias_sesiones" ON poop_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "crear_propias_sesiones" ON poop_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Índices para mejor rendimiento
CREATE INDEX idx_poop_sessions_user_id ON poop_sessions(user_id);
CREATE INDEX idx_poop_sessions_created_at ON poop_sessions(created_at);
```

Haz clic en "Run" para ejecutar el SQL.

## Paso 4: Ejecutar la App

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

## ¡Listo! 🎉

La app está lista. Ahora puedes:

1. **Sin autenticar**: Usa la app normalmente, los datos se guardan en localStorage
2. **Registrarse**: 
   - Abre la barra lateral (icono ☰ en móvil)
   - Haz clic en "Registrarse"
   - Ingresa email y contraseña
   - Elige tu moneda
   - ¡Listo!
3. **Iniciar sesión**: Usa tus credenciales para conectarte

## Estructura de la Barra Lateral

### Sin autenticar:
- Formulario de login/signup
- Toggle entre las dos opciones
- Selector de moneda al registrarse

### Con sesión activa:
- Email del usuario
- Total ganado en la vida
- Ganancias anuales brutas
- Moneda actual
- Botón de logout

## Comportamiento de las Sesiones

- **Locales** (sin autenticar): Se guardan en `localStorage`
- **En Supabase** (autenticado): Se guardan automáticamente en la BD
- **Moneda**: Se guarda con cada sesión
- **Total**: Se actualiza automáticamente en el perfil

## Prueba Rápida

1. Regístrate con email: `test@example.com`
2. Contraseña: `TestPassword123!`
3. Selecciona EUR como moneda
4. Ingresa salario: `40000`
5. ¡Inicia una sesión!
6. Verás los datos guardarse en el sidebar

## Solución Rápida de Problemas

| Problema | Solución |
|----------|----------|
| "Module not found" | Ejecuta `npm install` |
| .env.local no funciona | Reinicia el servidor con `npm run dev` |
| Autenticación falla | Verifica que copiaste bien las credenciales |
| Sidebar no aparece (móvil) | Haz clic en el icono ☰ |
| Sesión no se guarda | Verifica que estés autenticado |
| Error de SQL | Asegúrate de copiar TODO el código SQL |

## Próximos Pasos

✅ **Sistema funcionando**

Ahora puedes:
- Agregar más funcionalidades
- Crear un panel de histórico
- Agregar gráficos
- Implementar notificaciones
- Etc.

Ver archivo `CAMBIOS.md` para más detalles técnicos.

---

**¿Necesitas ayuda?** Revisa `SUPABASE_SETUP.md` para detalles técnicos completos.
