document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("priest-detail-container");
    const priest = JSON.parse(localStorage.getItem("selectedPriest"));
    if (!priest) {
        container.innerHTML = "<p>No priest data found.</p>";
        return;
    }
    container.innerHTML = `
        <p><strong>Name:</strong> ${priest.name}</p>
        <p><strong>Phone:</strong> ${priest.phone}</p>
        <p><strong>Age:</strong> ${priest.age}</p>
        <p><strong>Role:</strong> ${priest.role}</p>
    `;
});
