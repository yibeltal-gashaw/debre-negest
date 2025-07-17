const { db } = require('./database.js');
const bcrypt = require('bcrypt');
const { ipcRenderer } = require('electron');

export function login(username, password, callback) {
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err || !row) {
      callback(false);
      return;
    }
    bcrypt.compare(password, row.password, (err, result) => {
      if (result) {
        callback(true, row.role);
      } else {
        callback(false);
      }
    });
  });
}

export function createUser(username, password, role, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hash, role], callback);
  });
}
