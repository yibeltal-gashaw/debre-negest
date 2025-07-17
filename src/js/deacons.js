const { db } = require('./database');

function addDeacon(data, callback) {
  db.run(`
    INSERT INTO deacons (name, role, certification, activity_log)
    VALUES (?, ?, ?, ?)`,
    [data.name, data.role, data.certification, data.activity_log],
    callback
  );
}

function getDeacons(search = '', callback) {
  db.all(`
    SELECT * FROM deacons
    WHERE name LIKE ? OR role LIKE ? OR certification LIKE ?
  `, [`%${search}%`, `%${search}%`, `%${search}%`], callback);
}

function updateDeacon(id, data, callback) {
  db.run(`
    UPDATE deacons
    SET name = ?, role = ?, certification = ?, activity_log = ?
    WHERE id = ?`,
    [data.name, data.role, data.certification, data.activity_log, id],
    callback
  );
}

function deleteDeacon(id, callback) {
  db.run('DELETE FROM deacons WHERE id = ?', [id], callback);
}

module.exports = { addDeacon, getDeacons, updateDeacon, deleteDeacon };
