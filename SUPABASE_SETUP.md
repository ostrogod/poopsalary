# 🚀 Guía de Configuración de Supabase para Poop Salary

## Paso 1: Crear una cuenta en Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Haz clic en "Start your project for free"
3. Inicia sesión con GitHub o tu email
4. Crea un nuevo proyecto

## Paso 2: Obtener las credenciales

1. Una vez creado el proyecto, ve a **Project Settings** (en la parte inferior izquierda)
2. En la pestaña **API**, busca:
   - **Project URL**: Copia este valor
   - **Project API keys** > **anon public key**: Copia este valor

## Paso 3: Configurar variables de entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=tu_proyecto_url_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
```

Por ejemplo:
```env
NEXT_PUBLIC_SUPABASE_URL=https://myproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Paso 4: Crear las tablas en Supabase

En Supabase, ve a **SQL Editor** y ejecuta el siguiente SQL:

### Tabla de Perfiles de Usuario

```sql
-- Crear tabla de perfiles de usuario
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  total_earnings DECIMAL(15, 2) DEFAULT 0,
  annual_gross DECIMAL(15, 2) DEFAULT 0,
  currency_code VARCHAR(3) DEFAULT 'EUR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Crear política para que cada usuario vea solo su perfil
CREATE POLICY "Users can view their own profile" 
  ON user_profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON user_profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
```

### Tabla de Sesiones de Poop

```sql
-- Crear tabla de sesiones de poop
CREATE TABLE poop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds DECIMAL(10, 2) NOT NULL,
  earned_money DECIMAL(15, 4) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE poop_sessions ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
CREATE POLICY "Users can view their own sessions" 
  ON poop_sessions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
  ON poop_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Crear índice para mejorar rendimiento
CREATE INDEX idx_poop_sessions_user_id ON poop_sessions(user_id);
CREATE INDEX idx_poop_sessions_created_at ON poop_sessions(created_at);
```

## Paso 5: Configurar la Autenticación

1. En Supabase, ve a **Authentication** > **Providers**
2. Activa **Email** (debería estar ya activo)
3. Configura las opciones según prefieras

## Estructura del Proyecto

### Nuevo archivo: `.env.local`
- Contiene las credenciales de Supabase (NO subir a git)

### Nuevo archivo: `app/lib/supabase-client.ts`
- Cliente de Supabase con funciones para:
  - Autenticación (login, signup, logout)
  - Gestión de perfiles de usuario
  - Crear y gestionar sesiones de poop
  - Actualizar ganancias

### Nuevo archivo: `app/context/auth-context.tsx`
- Contexto de React que proporciona:
  - Estado del usuario actual
  - Perfil del usuario
  - Funciones de autenticación
  - Estado de carga y errores

### Nuevo componente: `app/components/sidebar.tsx`
- Barra lateral con:
  - Formulario de login/signup
  - Información del perfil del usuario
  - Estadísticas (ganancias totales, ganancias anuales, moneda)
  - Botón de logout
  - Responsive para móvil

### Cambios en componentes existentes:
- `app/components/poop-salary-app.tsx`: Integración con Supabase
- `app/components/session-summary.tsx`: Indica cuando se está guardando
- `app/i18n.ts`: Nuevas traducciones para autenticación
- `app/layout.tsx`: Envuelve la app con AuthProvider y Sidebar

## Funcionalidades

✅ **Autenticación**
- Registro con email y contraseña
- Login con email y contraseña
- Logout
- Sesión persistente

✅ **Perfil de Usuario**
- Email del usuario
- Moneda preferida
- Total de dinero ganado en la vida
- Ganancias anuales brutas (calculadas dinámicamente)

✅ **Sesiones de Poop**
- Registro de cada sesión con:
  - Duración en segundos
  - Dinero ganado
  - Moneda
  - Fecha/hora de creación
- Actualización automática de ganancias totales

✅ **Interfaz de Usuario**
- Barra lateral responsiva (oculta en móvil, visible en desktop)
- Menú toggle para móvil
- Mantiene el estilo visual existente
- Soporte multiidioma

## Próximos Pasos (Opcionales)

1. **Historial de sesiones**: Crear una página para ver todas las sesiones guardadas
2. **Gráficos**: Mostrar ganancias por día, semana, mes
3. **Exportar datos**: Descargar historial en CSV/PDF
4. **Compartir logros**: Crear links para compartir estadísticas
5. **Notificaciones**: Enviar emails con resúmenes semanales

## Solución de Problemas

### Error: "Missing Supabase environment variables"
- Verifica que `.env.local` esté configurado correctamente
- Reinicia el servidor de desarrollo

### Error: "User already registered"
- Este email ya está registrado en Supabase
- Intenta con otro email o haz login

### Las sesiones no se guardan
- Verifica que estés logueado
- Revisa la consola del navegador para errores
- Comprueba las políticas RLS en Supabase

### El sidebar no aparece en móvil
- Haz clic en el icono ☰ en la esquina superior izquierda
- El sidebar debería deslizarse desde la izquierda

## Notas de Seguridad

⚠️ **IMPORTANTE**: 
- Nunca subas el archivo `.env.local` a GitHub
- Está incluido en `.gitignore`
- Las credenciales que usas aquí son públicas (anon key), que es seguro
- El Row Level Security (RLS) protege los datos de cada usuario
