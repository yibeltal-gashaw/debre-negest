const { db } = require('./database');

function addPriest(data, callback) {
  db.run(`
    INSERT INTO priests (name, contact_info, assignment, service_history)
    VALUES (?, ?, ?, ?)`,
    [data.name, data.contact_info, data.assignment, data.service_history],
    callback
  );
}

function getPriests(search = '', callback) {
  db.all(`
    SELECT * FROM priests
    WHERE name LIKE ? OR contact_info LIKE ? OR assignment LIKE ?
  `, [`%${search}%`, `%${search}%`, `%${search}%`], callback);
}

function updatePriest(id, data, callback) {
  db.run(`
    UPDATE priests
    SET name = ?, contact_info = ?, assignment = ?, service_history = ?
    WHERE id = ?`,
    [data.name, data.contact_info, data.assignment, data.service_history, id],
    callback
  );
}

function deletePriest(id, callback) {
  db.run('DELETE FROM priests WHERE id = ?', [id], callback);
}

module.exports = { addPriest, getPriests, updatePriest, deletePriest };
