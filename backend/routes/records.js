const express = require('express');
const router = express.Router();
const db = require('../db/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Obtener todas las historias clínicas
router.get('/', (req, res) => {
  const sql = `
    SELECT 
      medical_records.id,
      medical_records.patient_id,
      patients.name as patient_name,
      medical_records.date,
      medical_records.weight,
      medical_records.diagnosis,
      medical_records.treatment,
      medical_records.antecedentes,
      medical_records.motivo_consulta,
      medical_records.examen_clinico,
      medical_records.examen_laboratorio,
      medical_records.temperatura,
      medical_records.frecuencia_respiratoria,
      medical_records.pulso,
      medical_records.spo2
    FROM medical_records
    JOIN patients ON medical_records.patient_id = patients.id
    ORDER BY medical_records.date DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener historias clínicas' });
    res.json(rows);
  });
});

// Obtener historias clínicas de un paciente específico
router.get('/patient/:patientId', (req, res) => {
  const patientId = req.params.patientId;
  const sql = `
    SELECT * FROM medical_records
    WHERE patient_id = ?
    ORDER BY date DESC
  `;
  db.all(sql, [patientId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener historias del paciente' });
    res.json(rows);
  });
});

// Obtener una historia clínica por ID
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM medical_records WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Error al obtener la historia clínica' });
    if (!row) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    res.json(row);
  });
});

// Crear una nueva historia clínica
router.post('/', (req, res) => {
  const {
    patient_id,
    date,
    weight,
    diagnosis,
    treatment,
    antecedentes,
    motivo_consulta,
    examen_clinico,
    examen_laboratorio,
    temperatura,
    frecuencia_respiratoria,
    pulso,
    spo2
  } = req.body;

  if (!patient_id || !date || !diagnosis) {
    return res.status(400).json({ error: 'patient_id, date y diagnosis son obligatorios' });
  }

  const sql = `
    INSERT INTO medical_records (
      patient_id, date, weight, diagnosis, treatment,
      antecedentes, motivo_consulta, examen_clinico, examen_laboratorio,
      temperatura, frecuencia_respiratoria, pulso, spo2
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    patient_id,
    date,
    weight,
    diagnosis,
    treatment,
    antecedentes,
    motivo_consulta,
    examen_clinico,
    examen_laboratorio,
    temperatura,
    frecuencia_respiratoria,
    pulso,
    spo2
  ], function (err) {
    if (err) {
      return res.status(500).json({
        error: 'Error al crear historia clínica',
        details: err.message
      });
    }
    res.status(201).json({ id: this.lastID });
  });
});


// Actualizar una historia clínica
router.put('/:id', (req, res) => {
  const {
    patient_id,
    date,
    weight,
    diagnosis,
    treatment,
    antecedentes,
    motivo_consulta,
    examen_clinico,
    examen_laboratorio,
    temperatura,
    frecuencia_respiratoria,
    pulso,
    spo2
  } = req.body;

  const id = req.params.id;

  if (!patient_id || !date || !diagnosis) {
    return res.status(400).json({ error: 'patient_id, date y diagnosis son obligatorios' });
  }

  const sql = `
    UPDATE medical_records
    SET patient_id = ?, date = ?, weight = ?, diagnosis = ?, treatment = ?,
        antecedentes = ?, motivo_consulta = ?, examen_clinico = ?, examen_laboratorio = ?,
        temperatura = ?, frecuencia_respiratoria = ?, pulso = ?, spo2 = ?
    WHERE id = ?
  `;

  db.run(sql, [
    patient_id,
    date,
    weight,
    diagnosis,
    treatment,
    antecedentes,
    motivo_consulta,
    examen_clinico,
    examen_laboratorio,
    temperatura,
    frecuencia_respiratoria,
    pulso,
    spo2,
    id
  ], function (err) {
    if (err) {
      return res.status(500).json({
        error: 'Error al actualizar la historia clínica',
        details: err.message
      });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Historia clínica no encontrada' });
    }
    res.json({ message: 'Historia clínica actualizada correctamente' });
  });
});

// Eliminar una historia clínica
router.delete('/:id', (req, res) => {
  const id = req.params.id;
  db.run('DELETE FROM medical_records WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: 'Error al eliminar la historia clínica' });
    if (this.changes === 0) return res.status(404).json({ error: 'Historia clínica no encontrada' });
    res.json({ message: 'Historia clínica eliminada correctamente' });
  });
});

// Subir archivo para una historia clínica específica
router.post('/:id/upload', upload.single('file'), (req, res) => {
  const recordId = req.params.id;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const sql = `
    INSERT INTO files (record_id, filename, filepath)
    VALUES (?, ?, ?)
  `;
  db.run(sql, [recordId, file.originalname, file.filename], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Error al guardar archivo en base de datos' });
    }
    res.status(201).json({ message: 'Archivo subido correctamente', filename: file.originalname });
  });
});

// Obtener archivos de una historia clínica
router.get('/:id/files', (req, res) => {
  const recordId = req.params.id;
  const sql = `SELECT * FROM files WHERE record_id = ?`;
  db.all(sql, [recordId], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Error al obtener archivos' });
    res.json(rows);
  });
});

module.exports = router;
