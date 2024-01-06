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

exports.getCurrentResume = async (student_id) => {
  try {
    const { rows, rowCount }  = await db.query('SELECT * FROM uploaded_resume WHERE student_id = $1',
    [student_id]
  );  
  if (rowCount != 0) {

    return { success: true, data: rows[0] };  
  }
  else {
    return { success: false, data: undefined };  
  }
  }
  catch (error){
    console.error("[BACKEND-SERVER] Cannot upload a file", error);
    return { error: "Internal server error has occurred" };
  }

};

exports.addResume = async (student_id,filename,date_uploaded) => {
  try {
    const isResume = await this.getCurrentResume(student_id);
    if (isResume.success ===  false){
      const result = await db.query('INSERT INTO uploaded_resume (filename, student_id, date_uploaded) VALUES ($1, $2, $3)',
      [filename, student_id, date_uploaded]
      );
      return { success: true, result };
    }
    else {
      return { success: false, undefined }
    }
    
  } catch (error) {
    console.error(error);
    return { success: false, error: 'Internal Server Error' };
  }

};
