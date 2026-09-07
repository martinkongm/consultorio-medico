// Middleware de errores central: convierte cualquier error en una respuesta
// JSON coherente, ocultando detalles internos en errores no controlados.
module.exports = function errorHandler(err, req, res, next) {
  // Errores de multer (subida de archivos)
  if (err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }

  const status = err.statusCode || 500;

  if (status >= 500) {
    console.error('Error interno:', err);
  }

  res.status(status).json({
    error:
      status >= 500 ? 'Error interno del servidor' : err.message,
  });
};
