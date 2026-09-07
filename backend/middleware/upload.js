const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Normaliza el nombre original para que nunca incluya separadores de ruta
// (evita que un nombre tipo "a/b.txt" cree carpetas inesperadas).
function sanitizeFileName(name = '') {
  return name.replace(/[\\/]/g, '_');
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (!fs.existsSync(config.uploadsDir)) {
      fs.mkdirSync(config.uploadsDir, { recursive: true });
    }
    cb(null, config.uploadsDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${sanitizeFileName(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

module.exports = { upload, sanitizeFileName };
