"use strict";

const db = require("./db");
const Teacher = require("../model/Teacher");

/**
 * Get all teachers from the database
 */
exports.getTeachers = async () => {
  try {
    const teachers = await db.query("SELECT * FROM teacher");
    return teachers.rows.map(
      (row) =>
        new Teacher(
          row.teacher_id,
          row.surname,
          row.name,
          row.email,
          row.cod_group,
          row.cod_department
        )
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};
