import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import sqlite3pkg from "sqlite3";
import { fileURLToPath } from "url";
const sqlite3 = sqlite3pkg.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let db;

export function initDatabase() {
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

export function login(username, password, callback) {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
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

export function createTables() {
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
      CREATE TABLE IF NOT EXISTS dnpriest (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        cname TEXT,
        photo BLOB,
        phone NUMBER,
        role TEXT,
        age NUMBER,
        servicestartyear TIMESTAMP,
        dicona TIMESTAMP,
        qsna TIMESTAMP,
        qumsna TIMESTAMP,
        ppsna TIMESTAMP,
        gabcha BOOL,
        yeglsira TEXT,
        maereg TEXT,
        sallary NUMBER,
        yetmrtdereja TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    // Servant table
    db.run(`
      CREATE TABLE IF NOT EXISTS servant (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      christian_name TEXT NOT NULL,
      christian_father TEXT NOT NULL,
      phone TEXT,
      work TEXT,
      job TEXT,
      wife_name TEXT,
      wife_christian_name TEXT,
      wife_phone TEXT,
      wife_work TEXT,
      wife_job TEXT,
      address TEXT,
      ketena TEXT,
      fee REAL,
      photo TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
    // Create babies table
    db.run(`CREATE TABLE IF NOT EXISTS babies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      dob TEXT,
      gender TEXT,
      father_name TEXT,
      mother_name TEXT,
      baptism_date TEXT,
      church_name TEXT
    )`);

    // Marriage
    db.run(`
    CREATE TABLE IF NOT EXISTS marriages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      husband_name_am TEXT,
      husband_name_en TEXT,
      husband_christian_name_am TEXT,
      husband_christian_name_en TEXT,
      husband_dob TEXT,
      husband_birth_place_am TEXT,
      husband_birth_place_en TEXT,
      husband_residence_am TEXT,
      husband_residence_en TEXT,
      husband_nationality_am TEXT,
      husband_nationality_en TEXT,
      husband_father_name_am TEXT,
      husband_father_name_en TEXT,
      husband_mother_name_am TEXT,
      husband_mother_name_en TEXT,
      wife_name_am TEXT,
      wife_name_en TEXT,
      wife_christian_name_am TEXT,
      wife_christian_name_en TEXT,
      wife_dob TEXT,
      wife_birth_place_am TEXT,
      wife_birth_place_en TEXT,
      wife_residence_am TEXT,
      wife_residence_en TEXT,
      wife_nationality_am TEXT,
      wife_nationality_en TEXT,
      wife_father_name_am TEXT,
      wife_father_name_en TEXT,
      wife_mother_name_am TEXT,
      wife_mother_name_en TEXT,
      church_name TEXT,
      officiating_priest TEXT,
      marriage_date TEXT,
      marriage_day TEXT,
      spiritual_father TEXT,
      husband_photo BLOB,
      wife_photo BLOB
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

    // Nwayekdusan (Sacred Items) table
    db.run(`
      CREATE TABLE IF NOT EXISTS nwayekdusan (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        entry_date TEXT NOT NULL,
        gifter_name TEXT NOT NULL,
        price REAL NOT NULL,
        service TEXT NOT NULL,
        action TEXT NOT NULL,
        item_photo BLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Nwayekdusan (Sacred Items) table
    db.run(`
      CREATE TABLE IF NOT EXISTS babtism (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        item_name TEXT NOT NULL,
        entry_date TEXT NOT NULL,
        gifter_name TEXT NOT NULL,
        price REAL NOT NULL,
        service TEXT NOT NULL,
        action TEXT NOT NULL,
        item_photo BLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Ensure item_photo column exists (for migrations)
    db.all(`PRAGMA table_info(nwayekdusan)`, [], (err, columns) => {
      if (columns && !columns.some((col) => col.name === "item_photo")) {
        db.run(`ALTER TABLE nwayekdusan ADD COLUMN item_photo BLOB`);
      }
    });
  });
}
export function createDefaultAdmin() {
  const defaultUsername = "admin";
  const defaultPassword = "admin123";
  db.get(
    "SELECT * FROM users WHERE username = ?",
    [defaultUsername],
    (err, row) => {
      if (err) {
        console.error("Error checking for admin user:", err.message);
        return;
      }
      if (!row) {
        bcrypt.hash(defaultPassword, 10, (err, hash) => {
          if (err) {
            console.error("Error hashing default admin password:", err.message);
            return;
          }
          db.run(
            "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [defaultUsername, hash, "admin"],
            (err) => {
              if (err) {
                console.error("Error creating default admin:", err.message);
              } else {
                console.log("Default admin user created: admin/admin123");
              }
            }
          );
        });
      }
    }
  );
}
export function backupDatabase() {
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

export function restoreDatabase(backupFile) {
  const dbPath = path.join(__dirname, "../../assets/debre_negest.db");
  fs.copyFileSync(backupFile, dbPath);
}

// USERS
export function getUser(callback, username = "admin") {
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
    if (err || !row) {
      callback(false);
      return;
    }
    callback(true, row);
  });
}

export function updateProfile(id, photo, callback) {
  db.run(`UPDATE users SET photo=? WHERE id=?`, [photo, id], function (err) {
    if (err) callback(false, err.message);
    else callback(true);
  });
}

export function importExcelData(f) {
  return new Promise((resolve, reject) => {
    const query = `
          INSERT INTO marriages (
              id,husband_name_am, husband_name_en, husband_christian_name_am, husband_christian_name_en,
              husband_dob, husband_birth_place_am, husband_birth_place_en, husband_residence_am, husband_residence_en,
              husband_nationality_am, husband_nationality_en, husband_father_name_am, husband_father_name_en,
              husband_father_nationality_am,husband_father_nationality_en,
              husband_mother_name_am, husband_mother_name_en,husband_mother_nationality_am,husband_mother_nationality_en,
              wife_name_am, wife_name_en, wife_christian_name_am, wife_christian_name_en,
              wife_dob, wife_birth_place_am, wife_birth_place_en, wife_residence_am, wife_residence_en,
              wife_nationality_am, wife_nationality_en, wife_father_name_am, wife_father_name_en,wife_father_nationality_am,wife_father_nationality_en,
              wife_mother_name_am, wife_mother_name_en,wife_mother_nationality_am,wife_mother_nationality_en,
              church_name, officiating_priest, marriage_date, marriage_day, spiritual_father,
              emagn1,emagn2,emagn3
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;
    const values = [
      f.Id,
      f.Name_of_husband_am,
      f.Name_of_husband_en,
      f.Husband_christian_name_am,
      f.Husband_christian_name_en,
      f.Date_of_birth,
      f.Place_of_birth_am,
      f.Place_of_birth_en,
      f.Residence_am,
      f.Residence_en,
      f.Husband_nationality_am,
      f.Husband_nationality_en,
      f.Husband_father_name_am,
      f.Husband_father_name_en,
      f.Husband_father_nationality_am,
      f.Husband_father_nationality_en,
      f.Husband_mother_name_am,
      f.Husband_mother_name_en,
      f.Husband_mother_nationality_am,
      f.Husband_mother_nationality_en,
      f.Name_of_wife_am,
      f.Name_of_wife_en,
      f.wife_christian_name_am,
      f.wife_christian_name_en,
      f.Wife_date_of_birth,
      f.Wife_place_of_birth_am,
      f.Wife_place_of_birth_en,
      f.Wife_residence_am,
      f.Wife_residence_en,
      f.Wife_nationality_am,
      f.Wife_nationality_en,
      f.Wife_father_name_am,
      f.Wife_father_name_en,
      f.Wife_father_nationality_am,
      f.Wife_father_nationality_en,
      f.Wife_mother_name_am,
      f.Wife_mother_name_en,
      f.Wife_mother_nationality_am,
      f.Wife_mother_nationality_en,
      f.Church_name,
      f.Officiating_priest,
      f.Date_of_marriage,
      f.Day_of_marriage,
      f.Spiritual_father,
      f.First_witness,
      f.Second_witness,
      f.Third_witness,
    ];
    db.all(
      `SELECT COUNT(*) FROM marriages WHERE id = ?`,
      [f.Id],
      (err, data) => {
        if (err) {
          console.log("something wrong happened");
        } else {
          if (data != 0) {
            db.run(query, values, (err, data) => {
              if (err) reject({ success: false, error: err.message });
              else
                resolve({
                  success: true,
                  message: "Data inserted Successfully.",
                });
            });
          }
        }
      }
    );
  });
}

// NEWAYE KIDUSAN
export function saveNwayekdusanItem(itemData, callback) {
  const {
    itemName,
    itemEntrytDate,
    itemGifterName,
    itemsPrice,
    itemsService,
    action,
    itemPhoto,
  } = itemData;

  db.run(
    `
    INSERT INTO nwayekdusan (item_name, entry_date, gifter_name, price, service, action,item_photo)
    VALUES (?, ?, ?, ?, ?, ?,?)
  `,
    [
      itemName,
      itemEntrytDate,
      itemGifterName,
      itemsPrice,
      itemsService,
      action,
      itemPhoto,
    ],
    function (err) {
      if (err) {
        console.error("Error saving item:", err);
        callback(false, err.message);
      } else {
        callback(true, this.lastID);
      }
    }
  );
}

export function getAllNwayekdusanItems(callback) {
  db.all("SELECT * FROM nwayekdusan ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      callback(false, err.message);
    } else {
      callback(true, rows);
    }
  });
}
export function updateNwayekdusanItem(itemData, callback) {
  console.log("update is called.");
  const {
    id,
    itemName,
    itemEntrytDate,
    itemGifterName,
    itemsPrice,
    itemsService,
    action,
    itemPhoto,
  } = itemData;
  db.run(
    `UPDATE nwayekdusan SET item_name=?, entry_date=?, gifter_name=?, price=?, service=?, action=?,item_photo=? WHERE id=?`,
    [
      itemName,
      itemEntrytDate,
      itemGifterName,
      itemsPrice,
      itemsService,
      action,
      itemPhoto,
      id,
    ],
    function (err) {
      if (err) callback(false, err.message);
      else callback(true);
    }
  );
}

export function deleteNwayekdusanItem(id, callback) {
  db.run(`DELETE FROM nwayekdusan WHERE id=?`, [id], function (err) {
    if (err) callback(false, err.message);
    else callback(true);
  });
}
export function totalItems(name, callback) {
  db.all(`SELECT COUNT(*) FROM ${name}`),
    (err, items) => {
      if (err) {
        callback(false, err.message);
      } else {
        callback(true, items);
      }
    };
}
//  PRIEST
export function savePriest(data, callback) {
  const {
    name,
    photo,
    age,
    cname,
    servicestartyear,
    dicona,
    qsna,
    qumsna,
    ppsna,
    gabcha,
    yeglsira,
    maereg,
    sallary,
    yetmrtdereja,
    phone,
    role,
    dicona_certificate,
    qsna_certificate,
    ppsna_certificate,
  } = data;
  db.run(
    `
    INSERT INTO dnpriest (name, cname, photo, phone, role, age, servicestartyear, dicona, qsna, qumsna, ppsna, gabcha, yeglsira, maereg, sallary, yetmrtdereja,dicona_certificate,
    qsna_certificate,
    ppsna_certificate )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      name,
      cname,
      photo,
      phone,
      role,
      age,
      servicestartyear,
      dicona,
      qsna,
      qumsna,
      ppsna,
      gabcha,
      yeglsira,
      maereg,
      sallary,
      yetmrtdereja,
      dicona_certificate,
      qsna_certificate,
      ppsna_certificate,
    ],
    function (err) {
      if (err) {
        console.error("Error saving priest:", err);
        callback(false, err.message);
      } else {
        callback(true, this.lastID);
      }
    }
  );
}

export function getAllPriest(callback) {
  db.all("SELECT * FROM dnpriest ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      console.error("Error fetching items:", err);
      callback(false, err.message);
    } else {
      callback(true, rows);
    }
  });
}

export function deletePriest(id, callback) {
  db.run(`DELETE FROM dnpriest WHERE id=?`, [id], function (err) {
    if (err) callback(false, err.message);
    else callback(true);
  });
}

export function updatePhoto(id, photo, callback) {
  db.run(`UPDATE dnpriest SET photo=? WHERE id=?`, [photo, id], function (err) {
    if (err) callback(false, err.message);
    else callback(true);
  });
}

export function totalKahinat(callback) {
  db.run(`SELECT COUNT(*) FROM dnpriest where role="ካህን"`),
    (err, priests) => {
      if (err) {
        console.log("====================================");
        console.log(err);
        console.log("====================================");
        callback(false, err.message);
      } else {
        console.log("====================================");
        console.log(priests);
        console.log("====================================");
        callback(true, priests);
      }
    };
}

export function totalDeacons(callback) {
  db.run(`SELECT COUNT(*) FROM dnpriest where role="ዲያቆን"`),
    (err, priests) => {
      if (err) callback(false, err.message);
      else callback(true, priests);
    };
}

export function totalKomosat(callback) {
  db.run(`SELECT COUNT(*) FROM dnpriest where role="ቆሞስ" or role="መነኩሴ"`),
    (err, priests) => {
      if (err) callback(false, err.message);
      else callback(true, priests);
    };
}
// SERVANTS
export function saveServants(data, callback) {
  const {
    name,
    christianName,
    fatherName,
    phone,
    work,
    job,
    wifeName,
    wifeCname,
    wifePhone,
    wifeWork,
    wifeJob,
    address,
    ketena,
    fee,
    photo,
  } = data;
  db.run(
    `INSERT INTO servant (name, christian_name, christian_father, phone, work, job, wife_name, wife_christian_name, wife_phone, wife_work, wife_job, address, ketena, fee, photo)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      name,
      christianName,
      fatherName,
      phone,
      work,
      job,
      wifeName,
      wifeCname,
      wifePhone,
      wifeWork,
      wifeJob,
      address,
      ketena,
      fee,
      photo,
    ],
    function (err) {
      if (err) {
        console.log(err);
        callback(false, err.message);
      } else {
        callback(true, this.lastID);
      }
    }
  );
}

export function getAllServants() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM servant ORDER BY created_at DESC", (err, rows) => {
      if (err) reject(err.message);
      else resolve(rows);
    });
  });
}

export function updateServantInfo(data, callback) {
  const {
    name,
    christianName,
    fatherName,
    phone,
    work,
    job,
    wifeName,
    wifeCname,
    wifePhone,
    wifeWork,
    wifeJob,
    address,
    ketena,
    fee,
    photo,
    id,
  } = data;
  db.run(
    `UPDATE servant SET name=?, christian_name=?, christian_father=?, phone=?, work=?, job=?, wife_name=?, wife_christian_name=?, wife_phone=?, wife_work=?, wife_job=?, address=?, ketena=?, fee=?, photo=? WHERE id=?`,
    [
      name,
      christianName,
      fatherName,
      phone,
      work,
      job,
      wifeName,
      wifeCname,
      wifePhone,
      wifeWork,
      wifeJob,
      address,
      ketena,
      fee,
      photo,
      id,
    ],
    function (err) {
      if (err) {
        callback(false, err.message);
      } else {
        callback(true, "Update successful");
      }
    }
  );
}

export function getFathers(callback) {
  db.all(
    "SELECT id, name FROM dnpriest WHERE role = 'ካህን' OR role = 'kahin' ORDER BY created_at DESC",
    (err, data) => {
      if (err) {
        console.log("Error fetching fathers: ", err);
        callback(false, err.message);
      } else {
        callback(true, data);
      }
    }
  );
}

// MARRIAGES
export function saveMarriage(data) {
  return new Promise((resolve, reject) => {
    const query = `
          INSERT INTO marriages (
              husband_name_am, husband_name_en, husband_christian_name_am, husband_christian_name_en,
              husband_dob, husband_birth_place_am, husband_birth_place_en, husband_residence_am, husband_residence_en,
              husband_nationality_am, husband_nationality_en, husband_father_name_am, husband_father_name_en,
              husband_mother_name_am, husband_mother_name_en,
              wife_name_am, wife_name_en, wife_christian_name_am, wife_christian_name_en,
              wife_dob, wife_birth_place_am, wife_birth_place_en, wife_residence_am, wife_residence_en,
              wife_nationality_am, wife_nationality_en, wife_father_name_am, wife_father_name_en,
              wife_mother_name_am, wife_mother_name_en,
              church_name, officiating_priest, marriage_date, marriage_day, spiritual_father,
              emagn,emagn2,emagn3,
              husband_photo, wife_photo
          ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      `;

    const values = [
      data.husbandNameAm,
      data.husbandNameEn,
      data.husbandChristianNameAm,
      data.husbandChristianNameEn,
      data.husbandDob,
      data.husbandBirthPlaceAm,
      data.husbandBirthPlaceEn,
      data.husbandResidenceAm,
      data.husbandResidenceEn,
      data.husbandNationalityAm,
      data.husbandNationalityEn,
      data.husbandFatherNameAm,
      data.husbandFatherNameEn,
      data.husbandMotherNameAm,
      data.husbandMotherNameEn,
      data.wifeNameAm,
      data.wifeNameEn,
      data.wifeChristianNameAm,
      data.wifeChristianNameEn,
      data.wifeDob,
      data.wifeBirthPlaceAm,
      data.wifeBirthPlaceEn,
      data.wifeResidenceAm,
      data.wifeResidenceEn,
      data.wifeNationalityAm,
      data.wifeNationalityEn,
      data.wifeFatherNameAm,
      data.wifeFatherNameEn,
      data.wifeMotherNameAm,
      data.wifeMotherNameEn,
      data.churchName,
      data.officiatingPriest,
      data.marriageDate,
      data.marriageDay,
      data.spiritualFather,
      data.emagn1,
      data.emagn2,
      data.emagn3,
      data.husbandPhoto || null,
      data.wifePhoto || null,
    ];

    db.run(query, values, function (err) {
      if (err) reject({ success: false, error: err.message });
      else resolve({ success: true, message: this.lastID });
    });
  });
}

export function loadMarriage() {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM marriages ORDER BY id DESC`;

    db.all(query, [], (err, rows) => {
      if (err) {
        console.error("Error loading certificates:", err);
        reject({ success: false, error: err.message });
      } else {
        // Convert BLOB to base64 for front-end display
        const certificates = rows.map((row) => ({
          ...row,
          husbandPhoto: row.husband_photo
            ? row.husband_photo.toString("base64")
            : null,
          wifePhoto: row.wife_photo ? row.wife_photo.toString("base64") : null,
        }));
        resolve({ success: true, data: certificates });
      }
    });
  });
}

export function searchInCouples({ table, columns, query }) {
  return new Promise((resolve, reject) => {
    // Allowed tables and columns (for safety)
    const allowedTables = ["dnpriest", "nwayekdusan", "marriages", "servant"];
    const allowedColumns = [
      "name",
      "husband_name_am",
      "phone",
      "item_name",
      "role",
      "job",
      "wife_name",
      "wife_job",
      "address",
      "ketena",
    ];

    if (!allowedTables.includes(table)) {
      return reject({ success: false, error: "Invalid table name" });
    }
    const validColumns = columns.filter((c) => allowedColumns.includes(c));
    if (validColumns.length === 0) {
      return reject({ success: false, error: "No valid columns" });
    }
    const querystr = `
      SELECT * FROM ${table} WHERE ${validColumns
      .map((c) => `${c} LIKE ?`)
      .join(" OR ")}
    `;
    const args = validColumns.map((_) => `%${query}%`);
    db.all(querystr, args, (err, data) => {
      if (err) {
        // console.error("Error loading certificates:", err);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, data });
      }
    });
  });
}

// Priests
export function updatePriestInfo(data, callback) {
  const { id, name, role, phone } = data;
  db.run(
    `UPDATE dnpriest SET name=?, role=?, phone=? WHERE id=?`,
    [name, role, phone, id],
    function (err) {
      if (err) {
        callback(false, err.message);
      } else {
        callback(true, "Update successful");
      }
    }
  );
}

export function updatePriestServiceInfo(data, callback) {
  const { id, dicona, qsna, qumsna, ppsna } = data;
  db.run(
    `UPDATE dnpriest SET dicona=?, qsna=?, qumsna=?, ppsna=? WHERE id=?`,
    [dicona, qsna, qumsna, ppsna, id],
    function (err) {
      if (err) {
        callback(false, err.message);
      } else {
        callback(true, "Update successful");
      }
    }
  );
}

export function updatePriestSocialStatus(data, callback) {
  const { id, gabcha, yeglsira, maereg, sallary, yetmrtdereja } = data;
  db.run(
    `UPDATE dnpriest SET gabcha=?, yeglsira=?, maereg=?,sallary=?,yetmrtdereja=? WHERE id=?`,
    [gabcha, yeglsira, maereg, sallary, yetmrtdereja, id],
    function (err) {
      if (err) {
        callback(false, err.message);
      } else {
        callback(true, "Update successful");
      }
    }
  );
}

export function searchInPriests(q) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM dnptiest where name like ?`;
    const arg = "%" + q + "%";
    db.all(query, [arg], (err, data) => {
      if (err) {
        console.error("Error searchInPriests:", err);
        reject({ success: false, error: err.message });
      } else {
        resolve({ success: true, data });
      }
    });
  });
}

export function SaveDoc(file) {
  return promise((resolve, reject) => {
    let query = `INSERT INTO documents (file) VALUES (?)`;
    const values = [file];
    db.run(query, values, (err, last) => {
      if (err) reject({ success: false, error: err.message });
      else reject({ success: true, error: last.lastID });
    });
  });
}

// BABIES
// Register a new baby
  export function registerNewBaby(babyData, callback) {
    db.run(`INSERT INTO babies (name, dob, gender, father_name, mother_name, baptism_date, church_name) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [babyData.name, babyData.dob, babyData.gender, babyData.father_name, babyData.mother_name, babyData.baptism_date, babyData.church_name],
      function(err) {
        callback(err, this?.lastID);
      }
    );
  }

  // Update baby data
  export function updateBaby(id, babyData, callback) {
    db.run(`UPDATE babies SET name=?, dob=?, gender=?, father_name=?, mother_name=?, baptism_date=?, church_name=? WHERE id=?`,
      [babyData.name, babyData.dob, babyData.gender, babyData.father_name, babyData.mother_name, babyData.baptism_date, babyData.church_name, id],
      function(err) {
        callback(err);
      }
    );
  }

  // Delete baby data
  export function deleteBaby(id, callback) {
    db.run(`DELETE FROM babies WHERE id=?`, [id], function(err) {
      callback(err);
    });
  }

export { db };
