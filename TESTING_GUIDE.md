# Guía de Testing - Historial de Sesiones y Salario Anual

## 📋 Pre-requisitos

✅ Base de datos Supabase con tablas:
- `user_profiles` (con campo `annual_salary`)
- `poop_sessions`

✅ RPC function `create_user_profile` actualizada para aceptar `annual_salary`

✅ Aplicación corriendo en desarrollo o producción

## 🧪 Test 1: Registarse con Salario Anual

### Pasos:
1. Abre la aplicación
2. Haz clic en el botón ☰ (menú) en la esquina superior izquierda
3. Click en la pestaña "Registrarse"
4. Completa el formulario:
   - **Email**: usa una dirección válida (ej: test@gmail.com)
   - **Contraseña**: ingresa una contraseña segura
   - **Moneda**: selecciona la que prefieras (EUR, USD, etc.)
   - **Salario Anual**: ingresa tu salario bruto (ej: 40000, 50000, etc.)
5. Haz clic en "Registrarse"

### Esperado:
- ✅ El registro debe completarse sin errores
- ✅ La barra lateral debe mostrarte conectado con tu email
- ✅ Debes ver tus estadísticas (Total ganado, Ganancia Anual Bruta, Moneda)
- ✅ Debes ver una sección "Salario Anual Configurado" con el valor que ingresaste

### Verificación en Supabase:
1. Ve a tu proyecto Supabase
2. Abre la tabla `user_profiles`
3. Busca el registro con tu email
4. Verifica que el campo `annual_salary` tiene el valor que ingresaste

---

## 🧪 Test 2: Logout y Login - Cargar Salario Guardado

### Pasos:
1. Con la sesión activa, abre la barra lateral
2. Haz clic en "Cerrar Sesión" (botón rojo)
3. La barra lateral debe mostrarte el formulario de login
4. Ingresa tus credenciales:
   - **Email**: la misma que registraste
   - **Contraseña**: la que ingresaste
5. Haz clic en "Iniciar Sesión"
6. Una vez dentro, ve a la pantalla principal (cierra la barra lateral)

### Esperado:
- ✅ El login debe ser exitoso
- ✅ Tu salario anual debe estar **precargado en el input** sin que hayas escrito nada
- ✅ Podrás ver tus estadísticas en la barra lateral
- ✅ En la barra lateral debes ver "Salario Anual Configurado" con tu valor

### Comprobación:
- El input de salario en la pantalla principal debe tener tu valor
- No deberías necesitar escribir el salario nuevamente

---

## 🧪 Test 3: Registrar una Sesión

### Pasos:
1. Asegúrate de estar autenticado
2. En la pantalla principal, el input de salario debe estar precargado
3. Haz clic en "EMPEZAR SESIÓN"
4. El cronómetro debe comenzar (espera al menos 5 segundos)
5. Haz clic en "¡HE TERMINADO!"
6. Verifica el resumen de la sesión
7. Haz clic en "Nueva Sesión"

### Esperado:
- ✅ La sesión debe completarse sin errores
- ✅ Debe guardarse en Supabase automáticamente
- ✅ La tabla `poop_sessions` debe tener un nuevo registro con:
  - `user_id`: tu ID de usuario
  - `duration_seconds`: el tiempo que grabaste
  - `earned_money`: el dinero calculado
  - `currency_code`: tu moneda seleccionada
  - `created_at`: la fecha y hora actual

---

## 🧪 Test 4: Ver Historial de Sesiones

### Pasos:
1. Asegúrate de tener al menos UNA sesión registrada (ver Test 3)
2. Abre la barra lateral haciendo clic en el botón ☰
3. Desplázate hacia abajo en la barra lateral

### Esperado:
- ✅ Debes ver una sección "Historial de Sesiones"
- ✅ Si hay sesiones, debes ver una tarjeta por cada sesión con:
  - **Fecha y Hora**: formato legible (ej: "Jan 16, 2:30 PM")
  - **Dinero ganado**: con símbolo de moneda (ej: "EUR 1.25")
  - **Duración**: en formato h/m/s (ej: "5m 30s")
- ✅ Las sesiones deben estar ordenadas más recientes primero
- ✅ Si el historial es muy largo, debe tener scroll

### Ejemplo de sesión en historial:
```
Jan 16, 2:30 PM
EUR 1.25
Duración: 5m 30s
```

---

## 🧪 Test 5: Múltiples Sesiones y Scroll

### Pasos:
1. Registra 3-5 sesiones más (repite Test 3)
2. Abre la barra lateral
3. Desplázate en la sección "Historial de Sesiones"

### Esperado:
- ✅ Debes ver todas tus sesiones listadas
- ✅ Las más recientes deben aparecer primero
- ✅ Si hay muchas sesiones, la sección debe tener scroll
- ✅ El total ganado en la barra lateral debe ser la suma de todas las sesiones

---

## 🧪 Test 6: Cambio de Salario (Opcional)

### Pasos:
1. Abre la barra lateral
2. Haz clic en "Cerrar Sesión"
3. Haz clic en "Registrarse"
4. Regístrate con un email diferente y DIFERENTE salario
5. Completa una sesión
6. Verifica que en la barra lateral aparezca tu NUEVO salario

### Esperado:
- ✅ El nuevo usuario debe tener su propio salario
- ✅ El historial de sesiones debe ser vacío para el nuevo usuario
- ✅ El total ganado debe ser solo de la nueva sesión

---

## 🔍 Debugging

### Si el salario NO se carga:
1. Verifica que en Supabase el campo `annual_salary` existe en `user_profiles`
2. Verifica que el RPC `create_user_profile` está pasando el parámetro correctamente
3. Abre la consola del navegador (F12) y busca errores

### Si el historial NO aparece:
1. Verifica que hay al menos una sesión en `poop_sessions`
2. Verifica que `user_id` en la sesión coincide con el usuario autenticado
3. Abre la consola (F12) y busca el error en "Error cargando sesiones:"

### Si las fechas NO se ven correctas:
1. Verifica que la zona horaria del navegador es correcta
2. Las fechas se formatean según la configuración local del navegador

---

## 📱 Casos de Uso Adicionales

### Usuario sin sesiones aún:
- Debe ver "No hay sesiones registradas aún" en el historial

### Usuario sin salario configurado:
- El input de salario estará vacío al login
- La sección "Salario Anual Configurado" NO debe aparecer
- El usuario deberá ingresar el salario manualmente antes de iniciar sesión

### Cambio de idioma:
- Todas las etiquetas (fechas, duraciones) se adaptan al idioma del navegador
- Las traducciones se aplican correctamente

---

## ✅ Checklist Final

- [ ] Puedo registrarme con un salario anual
- [ ] Al login, el salario se carga automáticamente
- [ ] Puedo completar sesiones y se guardan
- [ ] El historial muestra todas mis sesiones
- [ ] Las fechas son legibles
- [ ] Las duraciones están bien formateadas
- [ ] El dinero ganado muestra con la moneda correcta
- [ ] El total en la barra lateral es correcto
- [ ] Puedo hacer scroll en el historial si hay muchas sesiones
- [ ] Los nuevos usuarios tienen su propio historial

---

## 🐛 Reportar Bugs

Si encuentras un problema:
1. Toma una captura de pantalla
2. Abre la consola del navegador (F12) y copia los errores
3. Verifica los datos en Supabase manualmente
4. Reporta los detalles

