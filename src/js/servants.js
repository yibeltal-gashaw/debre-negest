const { db } = require('./database');

function addServant(data, callback) {
  db.run(`
    INSERT INTO servants (name, responsibility, schedule)
    VALUES (?, ?, ?)`,
    [data.name, data.responsibility, data.schedule],
    callback
  );
}

function getServants(search = '', callback) {
  db.all(`
    SELECT * FROM servants
    WHERE name LIKE ? OR responsibility LIKE ?
  `, [`%${search}%`, `%${search}%`], callback);
}

function updateServant(id, data, callback) {
  db.run(`
    UPDATE servants
    SET name = ?, responsibility = ?, schedule = ?
    WHERE id = ?`,
    [data.name, data.responsibility, data.schedule, id],
    callback
  );
}

function deleteServant(id, callback) {
  db.run('DELETE FROM servants WHERE id = ?', [id], callback);
}

module.exports = { addServant, getServants, updateServant, deleteServant };