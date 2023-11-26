"use strict";

const Application = require("../model/Application");
const Teacher = require("../model/Teacher");
const db = require("./db");

module.exports = {
    getAllApplicationsByStudentId: (student_id) => {
        return new Promise((resolve, reject) => {
            // check if student exists in student db table
            db.query('SELECT * FROM student WHERE id = $1;', [student_id])
                .then((rows) => {
                    if (rows.rowCount === 0) {
                        console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId Student with id ' + 
                            student_id + ' not found in table student');
                        reject({ status: 404, data: 'Student not found' });
                    }

                    return db.query('SELECT p.proposal_id, p.title, p.description, \
                        a.application_date, a.status \
                        FROM applications a \
                        JOIN proposals p ON a.proposal_id = p.proposal_id \
                        WHERE a.student_id = $1;', [student_id]);
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

    /**
     * Retrieve all applications for thesis proposals supervised by a teacher
     *
     * @param {number} id - The id of the teacher making the request.
     * @returns {Promise<
     * {
     *  status: number,
     *  data: {
     *      proposal_id: number,
     *      title: string,
     *      type: string,
     *      description: string,
     *      expiration_date: Date,
     *      level: string,
     *      applications: {
     *          application_id: number,
     *          status: string,
     *          application_date: Date,
     *          student_id: number,
     *          surname: string,
     *          name: string,
     *          email: string,
     *          enrollment_year: number,
     *          cod_degree: string
     *      }[]
     *  }
     * }>} - A promise that resolves to an object containing the HTTP status code and the retrieved data.
     * @throws {Promise<{status: number, data: string}>} - A promise that rejects with an object containing the HTTP status code and an error message.
     */
    getAllApplicationsByTeacherId: async (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { rows, rowCount } = await db.query(
                    "SELECT p.proposal_id, p.title, p.type, p.description, p.expiration_date, p.level, " +
                        "a.id as application_id, a.status as application_status, a.application_date, " +
                        "s.id as student_id, s.surname, s.name, s.email, s.enrollment_year, s.cod_degree " +
                    "FROM proposals p join applications a on a.proposal_id = p.proposal_id join student s ON s.id = a.student_id " +
                    "WHERE p.supervisor_id = $1 and p.expiration_date >= current_date and a.status = 'Pending'",
                    [id]);

                if (rowCount === 0) {
                    resolve({ status: 200, data: [] });
                }
                
                // each application is pushed into an array of applications related to the same thesis proposal
                let applications = rows.reduce((proposals, applicationRow) => {
                    const id = applicationRow.proposal_id;
                    if (!proposals[id]) {
                        proposals[id] = {
                            proposal_id: id,
                            title: applicationRow.title,
                            type: applicationRow.type,
                            description: applicationRow.description,
                            expiration_date: applicationRow.expiration_date,
                            level: applicationRow.level,
                            applications: []
                        }
                    }

                    const application = {
                        application_id: applicationRow.application_id,
                        status: applicationRow.application_status,
                        application_date: applicationRow.application_date,
                        student_id: applicationRow.student_id,
                        surname: applicationRow.surname,
                        name: applicationRow.name,
                        email: applicationRow.email,
                        enrollment_year: applicationRow.enrollment_year,
                        cod_degree: applicationRow.cod_degree,
                    }
                    
                    proposals[id].applications.push(application);
                    return proposals;
                }, {});

                resolve({ status: 200, data: Object.values(applications) });
            } catch (err) {
                console.error('[BACKEND-SERVER] Error in getAllApplicationsByTeacherId', err);
                reject({ status: 500, data: 'Internal server error' });
            }
        });
    },

    insertNewApplication: async(proposal_id, student_id) => {
     
        const status = 'Pending'
        const application_date = new Date().toISOString()

        try {

            const studentCheck = await db.query('SELECT * FROM student WHERE id = $1', [student_id]);
            const proposalCheck = await db.query('SELECT * FROM proposals WHERE proposal_id = $1', [proposal_id]);
            const applicationCheck = await db.query('SELECT * FROM applications WHERE proposal_id = $1 AND student_id = $2', [proposal_id, student_id]);

            if (studentCheck.rows.length === 0 || proposalCheck.rows.length === 0 ) {
              throw new Error(`Student with id ${student_id} not found or Proposal with id ${proposal_id} not found.`);
            } else if (applicationCheck.rows.length !== 0) {
                throw new Error(`Student with id ${student_id} has already applied to proposal with id ${proposal_id}.`);
            }
            else {
                const query = "INSERT INTO public.applications (proposal_id, student_id, status, application_date) VALUES ($1,$2,$3,$4) RETURNING * ;";
                const res = await db.query(query, [proposal_id, student_id, status, application_date])
                return res;

            }
            
        }
        catch (error) {
            console.error('[BACKEND-SERVER] Error in insertNewApplication service:', error);
            return error;
        }

    },

    /**
     * 
     * 
     * @param {number} application_id id of the application
     * @param {string} status new status; must be "Accepted" or "Rejected"
     * 
     * @returns {Promise<{ data: {Application} }>} Application updated with the new status value
     * 
     * @throws {Error} if proposal not found or student not found or 
     */
    setApplicationStatus: async (application_id, status) => {
        try {
            const query = "UPDATE applications SET status = $1 WHERE id = $2 RETURNING *;";
            
            const { rows, rowCount } = await db.query(query, [status, application_id]);

            if (rowCount === 0) {
                return { data: undefined };
            }

            const application = new Application(
                rows[0].id,
                rows[0].proposal_id,
                rows[0].student_id,
                rows[0].status,
                rows[0].application_date
            );
            
            return { data: application };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in setApplicationStatus service: ', error);
            throw error;
        }
    },
    /**
     * Set the status of the applications of a certain proposal identified by its id as Canceled if they are Pending
     * 
     * @param {string} proposal_id 
     * @param {string} teacher_id
     * 
     * @returns {Promise<{data: Number}>} Number of proposals modified
     * 
     * @throws {Error} if 
     */
    cancelPendingApplicationsByProposalId: async (proposal_id) => {
        try {
            const query = "UPDATE applications SET status = 'Canceled' WHERE id = $1 AND status = 'Pending';";

            const { rowCount } = await db.query(query, [proposal_id]);
            return { data: rowCount };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in cancelPendingApplicationsByProposalId service: ', error);
            throw error;
        }
    },

    /**
     * Get the application given its id
     * 
     * @param {string} application_id
     * 
     * @returns {Promise<{ data: Application }>}
     * 
     * @throws {Error} if application not found
     */
    getApplicationById: async (application_id) => {
        try {
            const query = "SELECT * FROM applications where id = $1";

            const { rows, rowCount } = await db.query(query, [application_id]);
            if (rowCount === 0) {
                return { data: undefined };
            }

            const application = new Application(
                rows[0].id,
                rows[0].proposal_id,
                rows[0].student_id,
                rows[0].status,
                rows[0].application_date
            );

            return { data: application };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in getApplicationById: ', error);
            throw error;
        }
    }
}