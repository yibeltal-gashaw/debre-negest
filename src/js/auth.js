
export function userLogin(event) {
  event.preventDefault(); // prevent page reload
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const error = document.getElementById("error");
  const button = document.getElementById('login-btn');
  const btnText = button.querySelector('.btn-text');
  const spinner = button.querySelector('.loading-spinner');

  // Show loading state
  button.disabled = true;
  btnText.style.display = 'none';
  spinner.style.display = 'inline-block';

  if (!username || !password) {
    alert("Please fill in all fields.");
    return;
  }

  setTimeout(() => {
    window.api.login(username, password).then((result) => {
      if (result.success) {
        getUsers();
        localStorage.setItem("role", result.role);
        localStorage.setItem("username", username);
        window.location.href = "index.html";
      } else {
        error.style.display = "block";
        button.disabled = false;
        btnText.style.display = 'inline-block';
        spinner.style.display = 'none';
      }
    });
  }, 1000);

  const style = document.createElement('style');
  style.textContent = `
  #login-btn {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  
  #login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .loading-spinner svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
  document.head.appendChild(style);

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
