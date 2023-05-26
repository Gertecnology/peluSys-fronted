export const fetchUser = async (data) => {
    try {
        const respuesta = await fetch(`${process.env.API_URL}auth/signin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
    
        const datosRespuesta = await respuesta.json();
        return datosRespuesta;
      } catch (error) {
        console.error('Ha ocurrido un error:', error);
      }
}