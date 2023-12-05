'use strict';

const db = require("./db");

const Student = require("../model/Student");
const Teacher = require("../model/Teacher");

/**
 * Map a database object to a Student model.
 *
 * @function
 * @name mapObjToStudent
 * @param {Object} student - Database object representing a student
 * @returns {Student} - Student model instance
 */
const mapObjToStudent = (student) => {
    return new Student(student.id, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrollment_year);
}

/**
 * Map a database object to a Teacher model.
 *
 * @function
 * @name mapObjToTeacher
 * @param {Object} teacher - Database object representing a teacher
 * @returns {Teacher} - Teacher model instance
 */
const mapObjToTeacher = (teacher) => {
    return new Teacher(teacher.id, teacher.surname, teacher.name, teacher.email, teacher.cod_group, teacher.cod_department);
}

/**
 * Authenticate a user from their email and password.
 *
 * @function
 * @name authUser
 * @param {string} email - Email of the user to authenticate
 * @param {string} password - Password of the user to authenticate
 * @returns {Promise<Student|Teacher|null>} - Resolves to a Student or Teacher model instance if authentication is successful, otherwise null
 * @throws {Error} - Throws an error if an exception occurs during the authentication process
 */
exports.authUser = async (email, password) => {
    try {
        let user;

        let students = await db.query('SELECT * FROM student WHERE email = $1 and id = $2;', [email, password]);        // it gets the user from the db
        if (students.rows.length > 0) {
            user = mapObjToStudent(students?.rows[0]);
        } else {
            let teachers = await db.query('SELECT * FROM teacher WHERE email = $1 and id = $2;', [email, password]);    // it gets the user from the db
            if (teachers.rows.length > 0) {
                user = mapObjToTeacher(teachers?.rows[0]);
            }
        }
        return user;
    } catch (err) {
        console.error("[BACKEND-ERROR] Error in authUser service function: ", err);
        throw err;
    }
};

/**
 * Authenticate a user from his id.
 *
 * @function
 * @name getUserById
 * @param {string} id - Id of the user to authenticate
 * @returns {Promise<Student|Teacher|null>} - Resolves to a Student or Teacher model instance if authentication is successful, otherwise null
 * @throws {Error} - Throws an error if an exception occurs during the authentication process
 */
exports.getUserById = async (id) => {
    try {
        let user;

        let students = await db.query('SELECT * FROM student WHERE id = $1;', [id]);        // it gets the user from the db
        if (students.rows.length > 0) {
            user = mapObjToStudent(students?.rows[0]);
        } else {
            let teachers = await db.query('SELECT * FROM teacher WHERE id = $1;', [id]);    // it gets the user from the db
            if (teachers.rows.length > 0) {
                user = mapObjToTeacher(teachers?.rows[0]);
            }
        }

        return user;
    } catch (err) {
        console.error("[BACKEND-ERROR] Error in getUserById service function: ", err);
        throw err;
    }
};

/**
 * Authenticate a user from his email.
 *
 * @function
 * @name getUserByEmail
 * @param {string} email - Email of the user to authenticate
 * @returns {Promise<Student|Teacher|null>} - Resolves to a Student or Teacher model instance if authentication is successful, otherwise null
 * @throws {Error} - Throws an error if an exception occurs during the authentication process
 */
exports.getUserByEmail = async (id) => {
    try {
        let user;

        let students = await db.query('SELECT * FROM student WHERE email = $1;', [id]);        // it gets the user from the db
        if (students.rows.length > 0) {
            user = mapObjToStudent(students?.rows[0]);
        } else {
            let teachers = await db.query('SELECT * FROM teacher WHERE email = $1;', [id]);    // it gets the user from the db
            if (teachers.rows.length > 0) {
                user = mapObjToTeacher(teachers?.rows[0]);
            }
        }

        return user;
    } catch (err) {
        console.error("[BACKEND-ERROR] Error in getUserByEmail service function: ", err);
        throw err;
    }
};

/**
 * Authenticate a user from his email or id.
 *
 * @function
 * @name getUser
 * @param {string} element - Email or ID of the user to get
 * @returns {Promise<Student|Teacher|null>} - Resolves to a Student or Teacher model instance if authentication is successful, otherwise null
 * @throws {Error} - Throws an error if an exception occurs during the authentication process
 */
exports.getUser = async (element) => {
    try {
        let user = await this.getUserByEmail(element);
        if (!user) {
            user = await this.getUserById(element);
        }
        return user;
    } catch (err) {
        console.error("[BACKEND-ERROR] Error in getUser service function: ", err);
        throw err;
    }
};