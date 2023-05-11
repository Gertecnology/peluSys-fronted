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
  
  // Exportar la función
  module.exports = { getFechaActual };
  