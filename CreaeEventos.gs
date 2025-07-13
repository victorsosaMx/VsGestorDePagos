function crearEventosDePagos() {
  const hoja = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Pagos");
  const datos = hoja.getDataRange().getValues();
  
  // Obtener el calendario específico "Pagos"
  let calendarioPagos;
  try {
    calendarioPagos = CalendarApp.getCalendarsByName("Pagos")[0];
    if (!calendarioPagos) {
      throw new Error("Calendario 'Pagos' no encontrado");
    }
  } catch (error) {
    Logger.log(`❌ Error al obtener calendario: ${error.message}`);
    return;
  }

  let eventosPagoCreados = 0;
  let eventosCorteCreados = 0;
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Establecer a medianoche para comparación

  for (let i = 1; i < datos.length; i++) {
    const nombreGasto = datos[i][0];    // Columna A (nombre del gasto)
    const pagoReal = datos[i][3];       // Columna D (monto del pago)
    const fechaCorteTexto = datos[i][5]; // Columna F (fecha de corte)
    const fechaPagoTexto = datos[i][6];  // Columna G (fecha de pago)
    
    const fechaCorte = new Date(fechaCorteTexto);
    const fechaPago = new Date(fechaPagoTexto);

    // Validar que los datos básicos estén presentes
    if (nombreGasto && pagoReal !== null && pagoReal !== "") {
      
      // === CREAR EVENTO DE FECHA DE CORTE ===
      if (fechaCorte instanceof Date && !isNaN(fechaCorte.getTime()) && fechaCorte >= hoy) {
        const tituloCorte = `📅 Fecha de corte: ${nombreGasto}`;

        // Verificar si ya existe un evento de corte
        const eventosCorte = calendarioPagos.getEventsForDay(fechaCorte);
        const existeCorte = eventosCorte.some(evento => evento.getTitle().includes(`Fecha de corte: ${nombreGasto}`));

        if (!existeCorte) {
          const eventoCorte = calendarioPagos.createAllDayEvent(tituloCorte, fechaCorte);
          
          // Agregar notificación un día antes del corte
          eventoCorte.addEmailReminder(1440); // 1440 minutos = 24 horas antes
          eventoCorte.addPopupReminder(1440);  // También notificación popup
          
          // Descripción del evento de corte
          eventoCorte.setDescription(`⚠️ Fecha límite de corte para: ${nombreGasto}\nMonto: $${pagoReal}\nFecha de pago programada: ${fechaPago.toDateString()}`);
          
          eventosCorteCreados++;
          Logger.log(`✅ Evento de corte creado: ${tituloCorte} → ${fechaCorte.toDateString()}`);
        } else {
          Logger.log(`⚠️ Ya existe evento de corte para ${nombreGasto} el ${fechaCorte.toDateString()}`);
        }
      } else if (fechaCorte < hoy) {
        Logger.log(`📅 Fecha de corte pasada omitida: ${nombreGasto} → ${fechaCorte.toDateString()}`);
      }

      // === CREAR EVENTO DE FECHA DE PAGO ===
      if (fechaPago instanceof Date && !isNaN(fechaPago.getTime()) && fechaPago >= hoy) {
        const tituloPago = `💸 Pagar ${nombreGasto} ($${pagoReal})`;

        // Verificar si ya existe un evento de pago
        const eventosPago = calendarioPagos.getEventsForDay(fechaPago);
        const existePago = eventosPago.some(evento => evento.getTitle().includes(`Pagar ${nombreGasto}`));

        if (!existePago) {
          const eventoPago = calendarioPagos.createAllDayEvent(tituloPago, fechaPago);
          
          // Agregar notificación un día antes del pago
          eventoPago.addEmailReminder(1440); // 1440 minutos = 24 horas antes
          eventoPago.addPopupReminder(1440);  // También notificación popup
          
          // Descripción del evento de pago
          eventoPago.setDescription(`💰 Recordatorio de pago para: ${nombreGasto}\nMonto: $${pagoReal}\nFecha de corte: ${fechaCorte.toDateString()}`);
          
          eventosPagoCreados++;
          Logger.log(`✅ Evento de pago creado: ${tituloPago} → ${fechaPago.toDateString()}`);
        } else {
          Logger.log(`⚠️ Ya existe evento de pago para ${nombreGasto} el ${fechaPago.toDateString()}`);
        }
      } else if (fechaPago < hoy) {
        Logger.log(`📅 Fecha de pago pasada omitida: ${nombreGasto} → ${fechaPago.toDateString()}`);
      }

    } else {
      Logger.log(`⛔ Datos inválidos para fila ${i + 1}: ${nombreGasto} → $${pagoReal}`);
    }
  }

  Logger.log(`🎉 Total de eventos de corte creados: ${eventosCorteCreados}`);
  Logger.log(`🎉 Total de eventos de pago creados: ${eventosPagoCreados}`);
  
  // Mostrar mensaje de confirmación en la interfaz
  let mensaje = "";
  if (eventosCorteCreados > 0) {
    mensaje += `📅 Se crearon ${eventosCorteCreados} eventos de fecha de corte\n`;
  }
  if (eventosPagoCreados > 0) {
    mensaje += `✅ Se crearon ${eventosPagoCreados} eventos de pago\n`;
  }
  
  if (mensaje) {
    SpreadsheetApp.getUi().alert(mensaje + "\n\n🔔 Todos los eventos incluyen notificaciones 24 horas antes");
  } else {
    SpreadsheetApp.getUi().alert(`ℹ️ No se crearon eventos nuevos. Revisa que haya fechas futuras sin elementos existentes.`);
  }
}