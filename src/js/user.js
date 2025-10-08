let base64ProfilePic = null;
let id = null;
// Function to fetch and display user information
export function loadUserInfo() {
  // Get username from localStorage or use default
  const username = localStorage.getItem("username") || "admin";

  window.api
    .getUser(username)
    .then((result) => {
      if (result.success && result.user) {
        id = result.user.id;
        const userNameElement = document.getElementById("user-name");
        const userRoleElement = document.querySelector(".nav-user-role");
        const profile = document.getElementById("nav-user-profile");
        const name = result.user.full_name
        if (userNameElement) {
          userNameElement.textContent = name|| "አበበ ከበደ";
        }

        if (userRoleElement) {
          userRoleElement.textContent =
            result.user.role === "admin" ? "Admin" : "User";
        }
        if(profile){
          profile.src = result.user.photo;
        }
      } else {
        console.log("No user found or error occurred");
      }
    })
    .catch((error) => {
      console.error("Error fetching user info:", error);
    });
}

// Initialize user info when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  loadUserInfo();
});