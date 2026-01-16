# ✅ CHECKLIST DE CONFIGURACIÓN - Poop Salary + Supabase

## Fase 1: Preparación Local (Ya Completada ✅)

- [x] Instalar dependencias de Supabase
- [x] Crear archivo `.env.local` con variables de entorno
- [x] Crear contexto de autenticación
- [x] Crear componente de barra lateral
- [x] Crear servicio de cliente Supabase
- [x] Actualizar traducciones
- [x] Integrar Supabase en la app principal
- [x] Actualizar layout para AuthProvider y Sidebar
- [x] Verificar que no hay errores de compilación

---

## Fase 2: Configuración de Supabase (Por Hacer - 10 minutos)

### 2.1 Crear Proyecto en Supabase
- [ ] Ir a https://supabase.com
- [ ] Hacer clic en "Start your project for free"
- [ ] Iniciar sesión con GitHub o email
- [ ] Crear un nuevo proyecto
  - [ ] Nombre del proyecto: `poopsalary` (recomendado)
  - [ ] Región: Seleccionar la más cercana
  - [ ] Contraseña: Guardar en lugar seguro
- [ ] Esperar a que se cree el proyecto (~2-3 minutos)

### 2.2 Obtener Credenciales
- [ ] Abrir el proyecto en Supabase
- [ ] Ir a **Settings** (esquina inferior izquierda) → **API**
- [ ] Copiar **Project URL**
  - [ ] Pegar en `.env.local` → `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Copiar **Project API keys → anon public**
  - [ ] Pegar en `.env.local` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Guardar archivo `.env.local`

Ejemplo:
```env
NEXT_PUBLIC_SUPABASE_URL=https://myproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Crear Tablas en Supabase
- [ ] En Supabase, ir a **SQL Editor**
- [ ] Crear nueva consulta
- [ ] Copiar el código SQL de abajo
- [ ] Ejecutar la consulta (botón "Run")
- [ ] Esperar a que se creen las tablas

**SQL para copiar en Supabase:**

```sql
-- ============================================
-- TABLA: user_profiles
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

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ver_propio_perfil" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "actualizar_propio_perfil" ON user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "crear_propio_perfil" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- TABLA: poop_sessions
-- ============================================
CREATE TABLE poop_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  duration_seconds DECIMAL(10, 2) NOT NULL,
  earned_money DECIMAL(15, 4) NOT NULL,
  currency_code VARCHAR(3) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE poop_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "ver_propias_sesiones" ON poop_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "crear_propias_sesiones" ON poop_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_poop_sessions_user_id ON poop_sessions(user_id);
CREATE INDEX idx_poop_sessions_created_at ON poop_sessions(created_at);
```

---

## Fase 3: Verificación y Prueba (Por Hacer - 5 minutos)

### 3.1 Verificar Configuración
- [ ] Abrir `.env.local` y verificar que tiene valores
- [ ] Abrir terminal en la carpeta del proyecto
- [ ] Ejecutar: `npm run dev`
- [ ] Esperar a que compile (debería decir "ready on http://localhost:3000")
- [ ] Abrir http://localhost:3000 en el navegador

### 3.2 Prueba de Registro
- [ ] Ver la barra lateral (móvil: hacer clic en ☰)
- [ ] Hacer clic en pestaña "Registrarse"
- [ ] Ingresar:
  - [ ] Email: `test@example.com`
  - [ ] Contraseña: `TestPassword123!`
  - [ ] Moneda: EUR (o la que prefieras)
- [ ] Hacer clic en "Registrarse"
- [ ] Debería aparecer el perfil en la barra lateral
- [ ] Debería mostrar el email: `test@example.com`

### 3.3 Prueba de Sesión
- [ ] Ingresar salario: `40000`
- [ ] Hacer clic en botón grande 🚽
- [ ] Esperar 5 segundos
- [ ] Hacer clic en "¡HE TERMINADO!"
- [ ] Verá resumen de la sesión
- [ ] Debería decir "Guardando..." brevemente
- [ ] En la barra lateral, el total debería aumentar

### 3.4 Verificar en Supabase
- [ ] Ir a Supabase → **Table Editor**
- [ ] Abrir tabla `user_profiles`
  - [ ] Debería haber una fila con tu email
  - [ ] `total_earnings` debería tener el valor ganado
  - [ ] `currency_code` debería ser "EUR"
- [ ] Abrir tabla `poop_sessions`
  - [ ] Debería haber una fila con tu sesión
  - [ ] `duration_seconds` debería estar cerca de 5
  - [ ] `earned_money` debería tener el valor

---

## Fase 4: Uso Normal (Después de Configurar)

- [ ] Reiniciar servidor (`npm run dev`)
- [ ] Hacer clic en "Iniciar Sesión"
- [ ] Ingresar mismo email y contraseña
- [ ] Debería mostrar el perfil con datos guardados
- [ ] Hacer otra sesión y verificar que se actualiza
- [ ] El total debería aumentar cada sesión

---

## 🆘 Solución Rápida de Problemas

### "Module not found @supabase/supabase-js"
```bash
npm install
npm run dev
```

### ".env.local no funciona"
- [ ] Verificar que archivo está en raíz del proyecto
- [ ] Reiniciar servidor: `Ctrl+C` luego `npm run dev`
- [ ] Verificar que valores no estén vacíos

### "Error de autenticación / Login falla"
- [ ] Verificar que credenciales de Supabase son correctas
- [ ] Verificar que URL comienza con `https://`
- [ ] Verificar que tablas fueron creadas en Supabase

### "No aparece barra lateral en móvil"
- [ ] Hacer clic en icono ☰ en esquina superior izquierda
- [ ] Debería deslizar desde la izquierda

### "Sesiones no se guardan"
- [ ] Verificar que estés logueado (ver email en sidebar)
- [ ] Abrir consola de navegador (F12)
- [ ] Buscar mensajes de error rojo
- [ ] Verificar que tablas existen en Supabase

---

## 📞 Ayuda Rápida

| Pregunta | Respuesta |
|----------|----------|
| ¿Dónde obtengo credenciales? | Settings → API en Supabase |
| ¿Dónde pego credenciales? | En archivo `.env.local` |
| ¿Dónde ejecuto SQL? | SQL Editor en Supabase |
| ¿Cómo veo datos guardados? | Table Editor en Supabase |
| ¿Dónde empiezo? | Lee `INICIO_RAPIDO.md` |
| ¿Cómo me registro? | Abre sidebar y haz clic "Registrarse" |

---

## 📋 Documentación Útil

- 📖 **INICIO_RAPIDO.md** - Guía paso a paso (lee primero)
- 📖 **SUPABASE_SETUP.md** - Detalles técnicos
- 📖 **CAMBIOS.md** - Qué se modificó
- 📖 **README.md** - Información general

---

## ✨ Una Vez Completado

Una vez termines este checklist:

✅ Tienes una app completamente funcional  
✅ Con autenticación de usuarios  
✅ Con base de datos en Supabase  
✅ Que guarda automáticamente las sesiones  
✅ Que muestra estadísticas de usuarios  
✅ Lista para usar en producción  

**¡Felicidades!** 🎉

---

**Tiempo total estimado**: 15-20 minutos  
**Complejidad**: Fácil (solo copiar y pegar)  
**Resultado**: App profesional con BD en la nube
