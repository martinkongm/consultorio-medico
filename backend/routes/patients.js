const express = require('express');
const router = express.Router();
const db = require('../db/database');

// Obtener todos los pacientes
router.get('/', (req, res) => {
  db.all('SELECT * FROM patients', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener pacientes' });
    }
    res.json(rows);
  });
});

// Obtener un paciente por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  db.get('SELECT * FROM patients WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Error al obtener el paciente' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json(row);
  });
});

// Crear un nuevo paciente
router.post('/', (req, res) => {
  const { name, dni, birthdate, gender, phone, edad, domicilio } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nombre es obligatorio.' });
  }

  if(edad <= 0) {
    return res.status(400).json({ error: 'La edad no puede ser menor o igual a cero.' });
  }

  const sql = 'INSERT INTO patients (name, dni, birthdate, gender, phone, edad, domicilio) VALUES (?, ?, ?, ?, ?)';
  db.run(sql, [name, dni, birthdate, gender, phone, edad, domicilio], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al crear paciente', details: err.message });
    }
    res.status(201).json({ id: this.lastID });
  });
});

// Actualizar paciente
router.put('/:id', (req, res) => {
  const { name, dni, birthdate, gender, phone, edad, domicilio } = req.body;
  const id = req.params.id;

  const sql = `
    UPDATE patients
    SET name = ?, dni = ?, birthdate = ?, gender = ?, phone = ?, edad = ?, domicilio = ?
    WHERE id = ?
  `;
  db.run(sql, [name, dni, birthdate, gender, phone, edad, domicilio, id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al actualizar paciente', details: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente actualizado correctamente' });
  });
});

// Eliminar paciente
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM patients WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al eliminar paciente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Paciente no encontrado' });
    }
    res.json({ message: 'Paciente eliminado correctamente' });
  });
});

module.exports = router;
