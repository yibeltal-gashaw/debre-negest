let base64ProfilePic = null;
let id = null;
// JavaScript for functionality
export function init() {
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    const sections = document.querySelectorAll('.settings-section');

    // Handle sidebar navigation
    sidebarLinks.forEach((link, index) => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Hide all sections
            sections.forEach(section => section.classList.remove('active'));

            // Show corresponding section
            if (sections[index]) {
                sections[index].classList.add('active');
            }
        });
    });

    const username = localStorage.getItem("username") || "admin";
    window.api
        .getUser(username)
        .then((result) => {
            if (result.success && result.user) {
                id = result.user.id;
                const userNameElement = document.getElementById("username");
                // const userRoleElement = document.querySelector(".nav-user-role");
                const profile = document.getElementById("avatar-preview");
                const name = result.user.full_name
                if (userNameElement) {
                    userNameElement.value = name || "አበበ ከበደ";
                }

                // if (userRoleElement) {
                //   userRoleElement.textContent =
                //     result.user.role === "admin" ? "Admin" : "User";
                // }
                if (profile) {
                    profile.src = result.user.photo;
                }
            } else {
                console.log("No user found or error occurred");
            }
        })
        .catch((error) => {
            console.error("Error fetching user info:", error);
        });

    function previewAvatar(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                e.preventDefault();
                base64ProfilePic = e.target.result;
                document.getElementById('avatar-preview').src = e.target.result;
                window.api.updateProfile(id, base64ProfilePic);
            };
            reader.readAsDataURL(file);
        }
    }

    function changePassword() {
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        // Add your password change logic here
        alert('Password change functionality needs to be implemented');
    }

    function createUser() {
        const fullName = document.getElementById('full-name').value;
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password-user').value;
        // Add your user creation logic here
        alert('User creation functionality needs to be implemented');
    }

    function toggleTheme() {
        const toggle = document.getElementById('theme-toggle');
        toggle.classList.toggle('active');
        // Add theme switching logic (e.g., add/remove dark class on body)
        document.body.classList.toggle('dark-mode');
    }

    function saveSettings() {
        // Add save logic here
        alert('Settings saved!');
    }

    function resetSettings() {
        // Add reset logic here
        alert('Settings reset!');
    }

    // Initialize avatar input
    document.getElementById('avatar-input').addEventListener('change', previewAvatar);
}
