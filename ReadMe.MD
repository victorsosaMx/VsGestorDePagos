# 📅 Gestor de Pagos - Google Calendar & Sheets

Automatiza la creación de eventos de calendario para el seguimiento de pagos y fechas de corte desde Google Sheets.

## 🎯 Características

- ✅ **Eventos de fecha de corte** con alertas 24h antes
- ✅ **Eventos de fecha de pago** con alertas 24h antes  
- ✅ **Calendario dedicado** "Pagos" para mejor organización
- ✅ **Notificaciones automáticas** (email y popup)
- ✅ **Prevención de duplicados** inteligente
- ✅ **Solo fechas futuras** (omite fechas pasadas)
- ✅ **Sincronización con GNOME Calendar** en Linux

## 📊 Estructura de la hoja de cálculo

### Columnas requeridas (en orden):

| Columna | Campo | Tipo | Descripción | Ejemplo |
|---------|-------|------|-------------|---------|
| **A** | Detalles de los gastos | `Texto` | Nombre del gasto/servicio | "Tarjeta de crédito BBVA" |
| **B** | Categoría | `Texto` | Clasificación del gasto | "Finanzas" |
| **C** | Frecuencia | `Texto` | Periodicidad del pago | "Mensual" |
| **D** | PagoMínimo | `Número` | Monto mínimo a pagar | 150.00 |
| **E** | PagoReal | `Número` | Monto real a pagar | 500.00 |
| **F** | FechaCorte | `Fecha` | Fecha límite de corte | 2025-01-15 |
| **G** | FechaPago | `Fecha` | Fecha límite de pago | 2025-01-20 |
| **H** | PagadoPorNotas | `Texto` | Notas adicionales | "Pagado" |

### Vista previa de ejemplo:

| Detalles de los gastos | Categoría | Frecuencia | PagoMínimo | PagoReal | FechaCorte | FechaPago | PagadoPorNotas |
|------------------------|-----------|------------|------------|-----------|------------|-----------|----------------|
| Tarjeta BBVA          | Finanzas  | Mensual    | 150.00     | 500.00    | 2025-01-15 | 2025-01-20 | Pendiente     |
| Netflix               | Entretenimiento | Mensual | 199.00     | 199.00    | 2025-01-10 | 2025-01-15 | Pagado        |
| Seguro Auto           | Seguros   | Mensual    | 1200.00    | 1200.00   | 2025-01-25 | 2025-01-30 | Pendiente     |
| Renta                 | Vivienda  | Mensual    | 8000.00    | 8000.00   | 2025-01-28 | 2025-02-01 | Pendiente     |

## 🛠️ Instalación

### 1. Preparar Google Sheets
- Crea una hoja llamada **"Pagos"** en tu Google Sheets
- Configura las columnas exactamente como se muestra arriba
- Completa tus datos de gastos

### 2. Crear calendario en Google Calendar
- Ve a [Google Calendar](https://calendar.google.com)
- Crea un nuevo calendario llamado **"Pagos"**
- Asegúrate de que esté visible

### 3. Configurar Google Apps Script
- Ve a [Google Apps Script](https://script.google.com)
- Crea un nuevo proyecto
- Pega el código del archivo `crearEventosDePagos.js`
- Guarda el proyecto

### 4. Autorizar permisos
- Ejecuta la función una vez para autorizar permisos
- Acepta los permisos de Google Calendar y Sheets

## 🚀 Uso

### Ejecutar manualmente
1. Abre tu proyecto de Google Apps Script
2. Selecciona la función `crearEventosDePagos`
3. Haz clic en **Ejecutar** ▶️

### Automatizar (opcional)
1. Ve a **Activadores** (Triggers) en Apps Script
2. Crea un nuevo activador
3. Configura para ejecutar mensualmente o según necesites

## 📱 Sincronización con GNOME Calendar (Linux)

Si usas GNOME Calendar en Linux y no ves el calendario "Pagos":

1. **Configuración** → **Cuentas en línea**
2. Selecciona tu cuenta de Google
3. **Desactiva** el toggle de "Calendar"
4. Espera 5 segundos
5. **Reactiva** el toggle de "Calendar"
6. Abre GNOME Calendar y verifica que aparezca "Pagos"

## 🎯 Eventos creados

### 📅 Eventos de Fecha de Corte
- **Título**: `📅 Fecha de corte: [Nombre del gasto]`
- **Fecha**: Columna F (FechaCorte)
- **Alerta**: 24 horas antes
- **Descripción**: Incluye monto y fecha de pago

### 💸 Eventos de Fecha de Pago
- **Título**: `💸 Pagar [Nombre del gasto] ($[Monto])`
- **Fecha**: Columna G (FechaPago)
- **Alerta**: 24 horas antes
- **Descripción**: Incluye monto y fecha de corte

## 🔧 Personalización

### Cambiar calendario de destino
Modifica la línea:
```javascript
calendarioPagos = CalendarApp.getCalendarsByName("Pagos")[0];
```
Si deases que utilice tu calendario por defecto reemplaza la linea aterior por esta:
```javascript
calendarioPagos =  CalendarApp.getDefaultCalendar();
```


### Ajustar tiempo de notificación
Cambia `1440` (24 horas) por los minutos deseados:
```javascript
evento.addEmailReminder(1440); // 24 horas = 1440 minutos
evento.addPopupReminder(720);   // 12 horas = 720 minutos
```

### Modificar emojis
Personaliza los emojis en los títulos:
```javascript
const tituloCorte = `⏰ Fecha de corte: ${nombreGasto}`;
const tituloPago = `💳 Pagar ${nombreGasto} ($${pagoReal})`;
```

## 📋 Validaciones incluidas

- ✅ **Fechas válidas**: Solo procesa fechas bien formateadas
- ✅ **Fechas futuras**: Omite fechas pasadas automáticamente
- ✅ **Datos completos**: Requiere nombre, monto y fechas
- ✅ **Sin duplicados**: Verifica eventos existentes antes de crear
- ✅ **Calendario válido**: Confirma que el calendario "Pagos" existe

## 🚨 Solución de problemas

### El calendario "Pagos" no aparece
1. Verifica que el calendario existe en Google Calendar
2. Confirma que el nombre es exactamente "Pagos"
3. Revisa que tengas permisos de lectura/escritura

### No se crean eventos
1. Revisa que las fechas estén en formato correcto
2. Confirma que las fechas sean futuras
3. Verifica que los campos obligatorios no estén vacíos

### Errores de permisos
1. Vuelve a ejecutar la función para re-autorizar
2. Acepta todos los permisos solicitados
3. Verifica que tu cuenta tenga acceso a Google Calendar

## 📄 Licencia

MIT License - Libre para usar y modificar

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Haz fork del proyecto
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Envía un pull request

## 📞 Soporte

Si tienes problemas o sugerencias:
- Abre un **Issue** en GitHub
- Describe el problema detalladamente
- Incluye screenshots si es posible

---

⭐ **¡No olvides dar una estrella si te fue útil!** ⭐
