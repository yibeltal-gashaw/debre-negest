const { db } = require('./database');

function addStudent(data, callback) {
  db.run(`
    INSERT INTO sunday_school (student_name, attendance, lesson_plan)
    VALUES (?, ?, ?)`,
    [data.student_name, data.attendance, data.lesson_plan],
    callback
  );
}

function getStudents(search = '', callback) {
  db.all(`
    SELECT * FROM sunday_school
    WHERE student_name LIKE ? OR lesson_plan LIKE ?
  `, [`%${search}%`, `%${search}%`], callback);
}

function updateStudent(id, data, callback) {
  db.run(`
    UPDATE sunday_school
    SET student_name = ?, attendance = ?, lesson_plan = ?
    WHERE id = ?`,
    [data.student_name, data.attendance, data.lesson_plan, id],
    callback
  );
}

function deleteStudent(id, callback) {
  db.run('DELETE FROM sunday_school WHERE id = ?', [id], callback);
}

module.exports = { addStudent, getStudents, updateStudent, deleteStudent };
