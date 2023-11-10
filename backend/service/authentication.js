'use strict';

const db = require("./db");

const Student = require("../model/Student");
const Teacher = require("../model/Teacher");

const mapObjToStudent = (student) => {
    return new Student(student.student_id, student.surname, student.name, student.gender, student.nationality, student.email, student.cod_degree, student.enrollment_year);
}

const mapObjToTeacher = (teacher) => {
    return new Teacher(teacher.teacher_id, teacher.surname, teacher.name, teacher.email, teacher.cod_group, teacher.cod_department);
}

/**
   * Authenticate a user from their email and password
   * 
   * @param email email of the user to authenticate
   * @param password password of the user to authenticate
   */
exports.authUser = async (email, password) => {
    try {
        let user = undefined;

        let students = await db.query('SELECT * FROM student WHERE email = $1 and student_id = $2;', [email, password]);        // it gets the user from the db
        if (students.rows.length > 0) {
            user = mapObjToStudent(students?.rows[0]);
        } else {
            let teachers = await db.query('SELECT * FROM teacher WHERE email = $1 and teacher_id = $2;', [email, password]);    // it gets the user from the db
            if (teachers.rows.length > 0) {
                user = mapObjToTeacher(teachers?.rows[0]);
            }
        }
        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

/**
   * Get the user from the db from his id
   * 
   * @param id user id
   * 
   * */
exports.getUserById = async (id) => {
    try {
        let user = undefined;

        let students = await db.query('SELECT * FROM student WHERE student_id = $1;', [id]);        // it gets the user from the db
        if (students.rows.length > 0) {
            user = mapObjToStudent(students?.rows[0]);
        } else {
            let teachers = await db.query('SELECT * FROM teacher WHERE teacher_id = $1;', [id]);    // it gets the user from the db
            if (teachers.rows.length > 0) {
                user = mapObjToTeacher(teachers?.rows[0]);
            }
        }

        return user;
    } catch (err) {
        console.log(err);
        throw err;
    }
};