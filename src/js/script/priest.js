// priest.js
const samplePriests = [
    { name: "መንስተ እምነት", phone: "0912345678", age: 45, role: "ዋና ካህን" },
    { name: "አቡነ ተክለሃይማኖት", phone: "0923456789", age: 60, role: "ምእመናን መምሪያ" },
    { name: "መምህር ዮሐንስ", phone: "0934567890", age: 39, role: "መዘምራን ተአምር" },
    { name: "አቡነ ጴጥሮስ", phone: "0945678901", age: 52, role: "ተዋዋይ ካህን" },
    { name: "አባ ጊዮርጊስ", phone: "0956789012", age: 47, role: "የልጆች መምህር" },
    { name: "መምህር ዮሐንስ", phone: "0934567890", age: 39, role: "መዘምራን ተአምር" },
    { name: "አቡነ ጴጥሮስ", phone: "0945678901", age: 52, role: "ተዋዋይ ካህን" },
];

function renderPriests(priests) {
    const table = document.getElementById("priest-data");
    if (!table) return;
    table.innerHTML = ""; // Clear existing rows
    priests.forEach((priest, idx) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${idx + 1}</td>
            <td>${priest.name}</td>
            <td>${priest.phone}</td>
            <td>${priest.age}</td>
            <td>${priest.role}</td>
            <td>
                <button>Edit</button>
                <button>Delete</button>
            </td>
        `;
        // Add click event to row (excluding the action buttons)
        row.addEventListener("click", (e) => {
            // Prevent click if Edit/Delete button is clicked
            if (e.target.tagName === "BUTTON") return;
            localStorage.setItem("selectedPriest", JSON.stringify(priest));
            window.loadPage("kahinat/priest-detail.html");
        });
        table.appendChild(row);
    });
}

export function init(loadPage) {
  const fab = document.getElementById('fab-add-priest');
  const modal = document.getElementById('add-priest-modal');
  const closeBtn = document.getElementById('close-modal');
  const form = document.getElementById('addPriestForm');
  const tbody = document.querySelector('table.scrollable-table tbody');

  // Open modal on FAB click
  if (fab && modal) {
    fab.addEventListener("click", () => {
      modal.style.display = "flex";
    });
  };

  // Close modal on X click
  closeBtn.addEventListener('click', () => {
    console.log("close btn clicked")
    modal.style.display = 'none';
  });

  // Close modal on clicking outside modal-content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Handle form submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get values
    const name = document.getElementById('priestName').value.trim();
    const phone = document.getElementById('priestPhone').value.trim();
    const age = document.getElementById('priestAge').value.trim();
    const service = document.getElementById('priestService').value.trim();

    // Basic validation
    if (!name || !phone || !age || !service) {
      alert('ሙሉ መረጃ ያስገቡ!');
      return;
    }

    // Calculate new serial number (ተ.ቁ)
    const newIndex = tbody.children.length + 1;

    // Create new row
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
  <td>${newIndex}</td>
  <td>${name}</td>
  <td>${phone}</td>
  <td>${age}</td>
  <td>${service}</td>
  <td>
    <button onclick="editRow(this)">Edit</button>
    <button onclick="deleteRow(this)">Delete</button>
  </td>
`;

    tbody.appendChild(newRow);

    // Reset form and close modal
    form.reset();
    modal.style.display = 'none';
  });

  // Optional: simple edit/delete handlers
  window.editRow = function (btn) {
    alert('Implement edit logic!');
  };
  window.deleteRow = function (btn) {
    if (confirm('Delete this priest?')) {
      const row = btn.closest('tr');
      row.remove();

      // Re-index ተ.ቁ after delete
      const rows = tbody.querySelectorAll('tr');
      rows.forEach((row, idx) => {
        row.cells[0].textContent = idx + 1;
      });
    }
  };

  // Render sample priests on page load
  renderPriests(samplePriests);
}
