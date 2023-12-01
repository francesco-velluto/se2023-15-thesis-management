"use strict";

const db = require("./db");
const Teacher = require("../model/Teacher");

/**
 * Get the list of all teachers from the database
 *
 * @returns {Promise<Teacher[]>} Array of Teacher objects
 *
 * @throws {Error} - If there was some error in the database.
 */
exports.getTeachers = async () => {
  try {
    const teachers = await db.query("SELECT * FROM teacher");
    return teachers.rows.map(
      (row) =>
        new Teacher(
          row.id,
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
