const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const fs = require('fs');
const { db } = require('./database');

function generatePDFReport(table, callback) {
  const doc = new PDFDocument();
  const filePath = `report_${table}_${Date.now()}.pdf`;
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      callback(err);
      return;
    }

    doc.fontSize(20).text(`Report: ${table.toUpperCase()}`, { align: 'center' });
    doc.moveDown();
    
    rows.forEach(row => {
      Object.entries(row).forEach(([key, value]) => {
        doc.fontSize(12).text(`${key}: ${value}`);
      });
      doc.moveDown();
    });

    doc.end();
    stream.on('finish', () => callback(null, filePath));
  });
}

function generateExcelReport(table, callback) {
  const filePath = `report_${table}_${Date.now()}.xlsx`;
  db.all(`SELECT * FROM ${table}`, [], (err, rows) => {
    if (err) {
      callback(err);
      return;
    }

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, table);
    XLSX.writeFile(wb, filePath);
    callback(null, filePath);
  });
}

module.exports = { generatePDFReport, generateExcelReport };
