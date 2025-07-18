const { db } = require('./database');

function addPriest(data, callback) {
  db.run(`
    INSERT INTO priests (name, contact_info, assignment, service_history)
    VALUES (?, ?, ?, ?)`,
    [data.name, data.contact_info, data.assignment, data.service_history],
    callback
  );
}

function getPriests(search = '', callback) {
  db.all(`
    SELECT * FROM priests
    WHERE name LIKE ? OR contact_info LIKE ? OR assignment LIKE ?
  `, [`%${search}%`, `%${search}%`, `%${search}%`], callback);
}

function updatePriest(id, data, callback) {
  db.run(`
    UPDATE priests
    SET name = ?, contact_info = ?, assignment = ?, service_history = ?
    WHERE id = ?`,
    [data.name, data.contact_info, data.assignment, data.service_history, id],
    callback
  );
}

function deletePriest(id, callback) {
  db.run('DELETE FROM priests WHERE id = ?', [id], callback);
}

module.exports = { addPriest, getPriests, updatePriest, deletePriest };


// const { addPriest, getPriests, updatePriest, deletePriest } = require('../js/priests');
// const { generatePDFReport, generateExcelReport } = require('../js/reports');

// document.addEventListener('DOMContentLoaded', () => {
//   if (localStorage.getItem('role') === 'admin') {
//     document.getElementById('admin-controls').style.display = 'block';
//   }
//   loadPriests();
// });

// function loadPriests() {
//   const search = document.getElementById('search').value;
//   getPriests(search, (err, priests) => {
//     const tbody = document.querySelector('#priests-table tbody');
//     tbody.innerHTML = '';
//     priests.forEach(priest => {
//       const row = document.createElement('tr');
//       row.innerHTML = `
//         <td>${priest.name}</td>
//         <td>${priest.contact_info}</td>
//         <td>${priest.assignment}</td>
//         <td>${priest.service_history}</td>
//         <td>
//           ${localStorage.getItem('role') === 'admin' ? `
//             <button onclick="editPriest(${priest.id})">Edit</button>
//             <button onclick="deletePriest(${priest.id})">Delete</button>
//           ` : ''}
//         </td>
//       `;
//       tbody.appendChild(row);
//     });
//   });
// }

// function addPriest() {
//   const data = {
//     name: document.getElementById('name').value,
//     contact_info: document.getElementById('contact_info').value,
//     assignment: document.getElementById('assignment').value,
//     service_history: document.getElementById('service_history').value
//   };
//   addPriest(data, () => {
//     loadPriests();
//     clearForm();
//   });
// }

// function editPriest(id) {
//   // Implement edit functionality
// }

// function deletePriest(id) {
//   if (confirm('Are you sure?')) {
//     deletePriest(id, loadPriests);
//   }
// }

// function generateReport(table, format) {
//   if (format === 'pdf') {
//     generatePDFReport(table, (err, filePath) => {
//       if (!err) alert(`Report generated: ${filePath}`);
//     });
//   } else {
//     generateExcelReport(table, (err, filePath) => {
//       if (!err) alert(`Report generated: ${filePath}`);
//     });
//   }
// }

// function clearForm() {
//   document.getElementById('name').value = '';
//   document.getElementById('contact_info').value = '';
//   document.getElementById('assignment').value = '';
//   document.getElementById('service_history').value = '';
// }

