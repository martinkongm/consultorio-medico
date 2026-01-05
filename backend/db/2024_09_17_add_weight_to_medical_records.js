const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ajusta la ruta si es necesario
const dbPath = path.resolve(__dirname, '../clinic.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  const alter = (sql) => {
    db.run(sql, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('❌ Error ejecutando:', sql, err.message);
      } else {
        console.log('✅ Ejecutado:', sql);
      }
    });
  };

  // Nueva columna: peso del paciente en la consulta
  alter('ALTER TABLE medical_records ADD COLUMN weight REAL;');
});

db.close();
