"use strict";

const db = require("./db");

module.exports = {
    getAllApplicationsByStudentId: (student_id) => {
        return new Promise((resolve, reject) => {
            // check if student exists in student db table
            db.query('SELECT * FROM student WHERE id = $1;', [student_id])
                .then((rows) => {
                    if (rows.count == 0) {
                        console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId Student with id ' + student_id + ' not found in table student');
                        reject({ status: 404, data: 'Student not found' });
                    }

                    return db.query('SELECT p.proposal_id, p.title, p.description, a.application_date, a.status FROM applications a JOIN proposals p ON a.proposal_id = p.proposal_id WHERE a.id = $1;', [student_id]);
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