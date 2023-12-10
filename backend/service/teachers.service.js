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

/**
 * Get a teacher by its id
 */
exports.getTeacherById = async (id) => {
    try {
        const teacher = await db.query("SELECT * FROM teacher WHERE id = $1", [id]);

        if (teacher.rows.length === 0)
            return { data: undefined };

        return { data: teacher.rows[0] };
    } catch (err) {
        console.log(err);
        throw err;
    }
}
