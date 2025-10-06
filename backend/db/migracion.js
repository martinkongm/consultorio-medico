const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../clinic.sqlite');

db.serialize(() => {
  const alter = (sql) => {
    db.run(sql, (err) => {
      if (err && !err.message.includes('duplicate column name')) {
        console.error('Error ejecutando:', sql, err.message);
      }
    });
  };

  alter('ALTER TABLE patients ADD COLUMN domicilio TEXT;');
  alter('ALTER TABLE medical_records ADD COLUMN temperatura REAL;');
  alter('ALTER TABLE medical_records ADD COLUMN frecuencia_respiratoria INTEGER;');
  alter('ALTER TABLE medical_records ADD COLUMN pulso INTEGER;');
  alter('ALTER TABLE medical_records ADD COLUMN spo2 INTEGER;');
});

db.close();
