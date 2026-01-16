# 💩 Poop Salary - Descubre cuánto ganas mientras haces tus necesidades

Una aplicación web divertida que calcula cuánto dinero ganas mientras estás en el baño. ¡Convierte tus momentos en el trono en ingresos medibles!

## ✨ Características

### 🔐 Sistema de Autenticación y Sesiones
- **Login/Signup** con email y contraseña
- **Base de datos en Supabase** para guardar datos permanentes
- **Perfiles de usuario** con estadísticas personalizadas
- **Barra lateral responsiva** con información del usuario

### 💾 Almacenamiento de Datos
- **Registro automático** de cada sesión en la base de datos
- **Total de dinero ganado** en la vida (persiste en BD)
- **Ganancias anuales brutas** calculadas dinámicamente
- **Selección de moneda** con soporte para más de 150 monedas

### 📱 Interfaz de Usuario
- **Diseño responsive** que funciona en móvil y desktop
- **Barra lateral inteligente** que se oculta en móvil
- **Tema visual coherente** con colores cálidos (marrón/dorado)
- **Multiidioma** (Español e Inglés)

### 🎯 Funcionalidades Principales
- Calcula ganancias en tiempo real basado en el salario anual
- Muestra equivalentes divertidos (tazas de café, hojas de papel)
- Mensajes motivacionales aleatorios
- Animación confeti al completar sesión
- Datos persistentes para usuarios no autenticados (localStorage)

## 🚀 Inicio Rápido

### 1. Instalación

```bash
# Clonar repositorio
git clone <repo>
cd poopsalary

# Instalar dependencias
npm install
```

### 2. Configurar Supabase (5 minutos)

Ver archivo **`INICIO_RAPIDO.md`** para instrucciones paso a paso.

Resumen:
1. Crear cuenta en https://supabase.com
2. Obtener URL y API key
3. Copiar credenciales a `.env.local`
4. Ejecutar SQL para crear tablas

### 3. Ejecutar

```bash
npm run dev
```

Abre http://localhost:3000

## 📚 Documentación

- **`INICIO_RAPIDO.md`** - Guía paso a paso (Recomendado)
- **`SUPABASE_SETUP.md`** - Configuración técnica completa de Supabase
- **`CAMBIOS.md`** - Detalles técnicos de todas las modificaciones

## 🏗️ Estructura del Proyecto

```
app/
├── components/
│   ├── poop-salary-app.tsx          # Componente principal
│   ├── sidebar.tsx                  # Barra lateral con auth ✨ NUEVO
│   ├── salary-input.tsx
│   ├── session-timer.tsx
│   ├── session-summary.tsx
│   └── language-selector.tsx
├── context/
│   ├── language-context.tsx
│   └── auth-context.tsx             # Autenticación ✨ NUEVO
├── lib/
│   └── supabase-client.ts           # Cliente de Supabase ✨ NUEVO
├── layout.tsx                       # Actualizado con AuthProvider
├── page.tsx
├── globals.css
└── i18n.ts                          # Traducciones actualizadas

public/
└── assets/

.env.local                           # Variables de entorno (gitignored)
.env.local.example                   # Plantilla
package.json                         # Actualizado con @supabase/supabase-js
```

## 🔧 Stack Tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript
- **Estilos**: Tailwind CSS, Radix UI
- **Backend/BD**: Supabase (PostgreSQL)
- **Autenticación**: Supabase Auth
- **Librería de UI**: Lucide icons
- **Efectos**: Canvas Confetti

## 📊 Datos Guardados

### Perfil de Usuario
- Email
- Total ganado en la vida
- Ganancias anuales brutas
- Moneda preferida
- Fechas de creación/actualización

### Sesiones
- Duración en segundos
- Dinero ganado
- Moneda utilizada
- Fecha/hora de creación
- Referencia al usuario

## 🔒 Seguridad

- ✅ **Row Level Security (RLS)** en Supabase
- ✅ **Credenciales seguras** en `.env.local` (gitignored)
- ✅ **Validación de formularios** en cliente
- ✅ **Manejo de errores** con feedback al usuario

## 📱 Responsividad

- **Móvil**: Barra lateral oculta con menú toggle (☰)
- **Tablet**: Diseño adaptado
- **Desktop**: Barra lateral visible permanentemente

## 🌍 Idiomas Soportados

- 🇪🇸 Español
- 🇬🇧 Inglés

## 💱 Monedas Soportadas

Más de 150 monedas del mundo:
- Europa (EUR, GBP, CHF, etc)
- América (USD, CAD, MXN, etc)
- Asia (JPY, CNY, INR, etc)
- Y muchas más...

## 🎮 Cómo Usar

### Usuario Sin Autenticar
1. Ingresa tu salario anual
2. Selecciona moneda
3. ¡Inicia sesión!
4. Los datos se guardan localmente

### Usuario Autenticado
1. Registrate con email y contraseña
2. Elige tu moneda
3. Cada sesión se guarda automáticamente en Supabase
4. Tus estadísticas se actualizan en tiempo real

## 🚀 Deploy

### En Vercel (Recomendado)

```bash
# Conectar repositorio en vercel.com
# Agregar variables de entorno:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### En otro hosting
- Asegurar que Node.js esté disponible
- Configurar variables de entorno
- Ejecutar `npm run build` luego `npm start`

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la licencia MIT.

## 🎨 Créditos

- Diseño inspirado en tendencias modernas
- Emojis para una experiencia divertida
- Supabase para backend confiable

## 📧 Soporte

¿Preguntas o problemas?
- Revisa `INICIO_RAPIDO.md` para ayuda rápida
- Consulta `SUPABASE_SETUP.md` para configuración técnica
- Abre un issue en GitHub

---

**Versión**: 1.0.0 con Sistema de Autenticación  
**Última actualización**: 16 de enero de 2026  
**Estado**: ✅ Funcional y Listo para Usar

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
