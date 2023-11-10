"use strict";

const db = require("./db");

module.exports = {
    getAllApplicationsByStudentId: (student_id) => {
        return new Promise((resolve, reject) => {
            // check if student exists in student db table
            db.query('SELECT * FROM student WHERE student_id = $1;', [student_id])
                .then((rows) => {
                    if (rows.count == 0) {
                        console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId Student with id ' + student_id + ' not found in table student');
                        reject({ status: 404, data: 'Student not found' });
                    }

                    return db.query('SELECT T.thesis_id, T.title, T.description, a.application_date, a.status FROM applications a JOIN thesis T ON a.thesis_id = T.thesis_id WHERE a.student_id = $1;', [student_id]);
                })
                .then((rows) => {
                    resolve({ status: 200, data: rows.rows });
                })
                .catch((err) => {
                    console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId', err);
                    reject({ status: 500, data: 'Internal server error' });
                });
        });
    }
}