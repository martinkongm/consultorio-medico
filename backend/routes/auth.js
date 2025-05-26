const express = require('express');
const router = express.Router();

// Usuario fijo (para entorno local sin base de datos)
const doctorCredentials = {
  username: 'doctor',
  password: '123'  // Puedes cambiar esto a algo más seguro
};

// Ruta para login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === doctorCredentials.username && password === doctorCredentials.password) {
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  } else {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

module.exports = router;
