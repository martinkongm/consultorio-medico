const { all, get, run } = require('../db/connection');

async function add(recordId, filename, filepath) {
  const result = await run(
    'INSERT INTO files (record_id, filename, filepath) VALUES (?, ?, ?)',
    [recordId, filename, filepath]
  );
  return get('SELECT * FROM files WHERE id = ?', [result.lastID]);
}

async function listByRecord(recordId) {
  return all('SELECT * FROM files WHERE record_id = ? ORDER BY id DESC', [
    recordId,
  ]);
}

module.exports = { add, listByRecord };
