// Función para obtener la fecha actual en el formato "yyyy-mm-dd"
function getFechaActual() {
  // Crear un nuevo objeto de fecha
  var fechaActual = new Date();

  // Obtener los componentes de la fecha
  var dia = fechaActual.getDate();
  var mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0'); // Los meses comienzan desde 0
  var año = fechaActual.getFullYear();

  // Formatear la fecha como "yyyy-mm-dd"
  var fechaFormateada = año + '-' + mes + '-' + dia.toString().padStart(2, '0');

  // Devolver la fecha actual
  return fechaFormateada;
}

function convertirHora(horaString) {
  const [hora, minuto] = horaString.split(':');

  return {
    hour: parseInt(hora),
    minute: parseInt(minuto),
    second: 0,
    nano: 0
  }

}

function formatearFecha(dateString) {

  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${day}/${month}/${year}`;

}

function formatearDecimales(number, decimalLimit) {
  const power = Math.pow(10, decimalLimit);
  return Math.floor(number * power) / power;
}

// Exportar la función
module.exports = { getFechaActual, convertirHora, formatearFecha, formatearDecimales };
