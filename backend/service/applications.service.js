"use strict";

const Teacher = require("../model/Teacher");
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
    },

    // TODO: commento
    getAllApplicationsByTeacherId: async (user) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!user instanceof Teacher) {
                    reject({ status: 401, data: 'Must be a teacher to make this request!' });
                }

                const applications = await db.query(
                    'SELECT p.proposal_id, p.title, p.type, p.description, p.expiration_date, p.level, a.application_id, a.status as application_status, a.application_date, s.id as student_id, s.surname, s.name, s.email, s.enrollment_year, s.cod_degree ' +
                    'FROM proposals p join applications a on a.proposal_id = p.proposal_id join student s ON s.id = a.id ' +
                    'WHERE p.supervisor_id = $1 and p.expiration_date >= current_date', [user.id]);

                if (applications.rows == 0) {
                    reject({ status: 404, data: 'No applications were found for your thesis proposals!' });
                }

                resolve({ status: 200, data: applications.rows });
            } catch (err) {
                console.error('[BACKEND-SERVER] Error in getAllApplicationsByTeacherId', err);
                reject({ status: 500, data: 'Internal server error' });
            }
        });
    }
}