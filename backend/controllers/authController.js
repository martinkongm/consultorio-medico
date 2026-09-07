const config = require('../config');

function login(req, res) {
  const { username, password } = req.body;
  const { auth } = config;

  if (username === auth.username && password === auth.password) {
    return res.status(200).json({ message: 'Inicio de sesión exitoso' });
  }

  return res.status(401).json({ error: 'Credenciales inválidas' });
}

module.exports = { login };
