// Crea un error HTTP con su código de estado. Permite que los controladores
// indiquen el status y que el middleware de errores lo traduzca en respuesta.
function httpError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { httpError };
