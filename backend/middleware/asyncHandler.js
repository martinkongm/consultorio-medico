// Envuelve un controlador async para que sus rechazos lleguen al middleware
// de errores sin repetir try/catch en cada ruta (DRY).
module.exports = function asyncHandler(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
};
