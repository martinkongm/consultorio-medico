const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../clinic.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // 1. Renombrar tabla original
  db.run(`ALTER TABLE patients RENAME TO patients_old;`, (err) => {
    if (err) {
      console.error('Error al renombrar tabla:', err.message);
      return;
    }

    console.log('Tabla original renombrada a patients_old');

    // 2. Crear nueva tabla sin UNIQUE en dni
    db.run(
      `
      CREATE TABLE patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dni TEXT NOT NULL, -- sin UNIQUE
        birthdate TEXT,
        gender TEXT,
        phone TEXT
      );
    `,
      (err) => {
        if (err) {
          console.error('Error al crear nueva tabla:', err.message);
          return;
        }

        console.log('Nueva tabla patients creada sin UNIQUE en dni');

        // 3. Copiar datos desde la tabla antigua
        db.run(
          `
        INSERT INTO patients (id, name, dni, birthdate, gender, phone)
        SELECT id, name, dni, birthdate, gender, phone FROM patients_old;
      `,
          (err) => {
            if (err) {
              console.error('Error al copiar datos:', err.message);
              return;
            }

            console.log('Datos copiados a la nueva tabla');

            // 4. Eliminar la tabla antigua
            db.run(`DROP TABLE patients_old;`, (err) => {
              if (err) {
                console.error('Error al eliminar tabla antigua:', err.message);
                return;
              }

              console.log('Tabla patients_old eliminada. UNIQUE eliminado.');
            });
          }
        );
      }
    );
  });
});
