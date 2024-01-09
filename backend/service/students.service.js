"use strict";

const db = require("./db");
const Student = require("../model/Student");

exports.rowToStudent = (row) => {
  return new Student(
    row.id,
    row.surname,
    row.name,
    row.gender,
    row.nationality,
    row.email,
    row.cod_degree,
    row.enrollment_year
  );
};

/**
 * Get a student by his Id
 *
 */
exports.getStudentById = async (student_id) => {
  try {
    const query = "SELECT * FROM student WHERE id = $1";
    const { rows, rowCount } = await db.query(query, [student_id]);

    if (rowCount === 0) {
      return { data: undefined };
    }

    const student = this.rowToStudent(rows[0]);
    return { data: student };
  } catch (error) {
    console.log("Error in getStudentById: ", error);
    throw error;
  }
};