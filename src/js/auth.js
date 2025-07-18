const { db, initDatabase } = require("./database");
const bcrypt = require("bcrypt");
const { ipcRenderer } = require("electron");

function login(username, password, callback) {
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

function createUser(username, password, role, callback) {
  bcrypt.hash(password, 10, (err, hash) => {
    db.run(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hash, role],
      callback
    );
  });
}

function userLogin(event) {
  event.preventDefault(); // prevent page reload
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error  = document.getElementById("error");

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }
  console.log(username, password);

  if (username == "admin" && password == "admin123") {
    localStorage.setItem("role", "admin");
    window.location.href = "index.html";
  } else {
    error.style.display = "block";
  }
}
