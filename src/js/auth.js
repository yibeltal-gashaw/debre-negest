// function createUser(username, password, role, callback) {
//   bcrypt.hash(password, 10, (err, hash) => {
//     db.run(
//       "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
//       [username, hash, role],
//       callback
//     );
//   });
// }

export function userLogin(event) {
  event.preventDefault(); // prevent page reload
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  window.api.login(username, password).then((result) => {
    if (result.success) {
      getUsers();
      localStorage.setItem("role", result.role);
      localStorage.setItem("username", username);
      window.location.href = "index.html";
    } else {
      error.style.display = "block";
    }
  });

}

window.userLogin = userLogin; // Expose the function globally

export function getUsers() {
  const username = localStorage.getItem("username") || "admin";
  return window.api
    .getUser(username)
    .then((result) => {
      if (result.success) {
        // You can use this function to get user data in other parts of the app
        return result.user;
      } else {
        console.log("No user found");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      return null;
    });
}
