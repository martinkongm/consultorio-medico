const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = 3001;
const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patients');
const recordRoutes = require('./routes/records');

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas
app.use('/api/patients', patientRoutes);
app.use('/api/records', recordRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

app.use('/api', authRoutes);
