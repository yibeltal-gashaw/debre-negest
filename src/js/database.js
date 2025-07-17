const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");

let db;

function initDatabase() {
  db = new sqlite3.Database(
    path.join(__dirname, "../../assets/debre_negest.db"),
    (err) => {
      if (err) console.error(err.message);
      console.log("Connected to SQLite database.");
      createTables();
      createDefaultAdmin();
    }
  );
}

function createTables() {
  db.serialize(() => {
    // Users table for role-based access
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT CHECK(role IN ('admin', 'viewer'))
      )
    `);

    // Priests table
    db.run(`
      CREATE TABLE IF NOT EXISTS priests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        contact_info TEXT,
        assignment TEXT,
        service_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Deacons table
    db.run(`
      CREATE TABLE IF NOT EXISTS deacons (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        role TEXT,
        certification TEXT,
        activity_log TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Sunday School table
    db.run(`
      CREATE TABLE IF NOT EXISTS sunday_school (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_name TEXT,
        attendance TEXT,
        lesson_plan TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Servants table
    db.run(`
      CREATE TABLE IF NOT EXISTS servants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        responsibility TEXT,
        schedule TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}
function createDefaultAdmin() {
  const defaultUsername = 'admin';
  const defaultPassword = 'admin123';
  db.get('SELECT * FROM users WHERE username = ?', [defaultUsername], (err, row) => {
    if (err) {
      console.error('Error checking for admin user:', err.message);
      return;
    }
    if (!row) {
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing default admin password:', err.message);
          return;
        }
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
          [defaultUsername, hash, 'admin'], (err) => {
            if (err) {
              console.error('Error creating default admin:', err.message);
            } else {
              console.log('Default admin user created: admin/admin123');
            }
          });
      });
    }
  });
}
function backupDatabase() {
  const backupPath = path.join(__dirname, "../../assets/db_backup/");
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  const backupFile = path.join(backupPath, `backup_${Date.now()}.db`);
  fs.copyFileSync(
    path.join(__dirname, "../../assets/debre_negest.db"),
    backupFile
  );
  return backupFile;
}

function restoreDatabase(backupFile) {
  const dbPath = path.join(__dirname, "../../assets/debre_negest.db");
  fs.copyFileSync(backupFile, dbPath);
}

module.exports = { initDatabase, db, backupDatabase, restoreDatabase };
