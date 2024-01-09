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

/**
 * Get the career of a student by student id.
 *
 */
exports.getStudentCareer = async (student_id) => {
  try {
    const query = "SELECT * FROM career WHERE id = $1";
    const { rows } = await db.query(query, [student_id]);

    return { data: rows };
  } catch (error) {
    console.log("Error in getStudentCareer: ", error);
    throw error;
  }
};

/**
 * Check if a given student has applied to some proposals of a given teacher.
 *
 */
exports.hasStudentAppliedForTeacher = async (student_id, teacher_id) => {
  try {
    const query =
      "SELECT * FROM applications a " +
      "JOIN proposals p ON a.proposal_id = p.proposal_id " +
      "WHERE p.supervisor_id = $1 AND a.student_id = $2;";
    const { rowCount } = await db.query(query, [teacher_id, student_id]);

    return rowCount > 0;
  } catch (error) {
    console.log("Error in hasStudentAppliedForTeacher: ", error);
    throw error;
  }
};
