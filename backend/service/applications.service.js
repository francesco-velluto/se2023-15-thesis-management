"use strict";

const Application = require("../model/Application");
const db = require("./db");
const { rowToProposal } = require("./proposals.service");
const { getVirtualDate } = require("./virtualclock.service");

module.exports = {
    getAllApplicationsByStudentId: (student_id) => {
        return new Promise((resolve, reject) => {
            // check if student exists in student db table
            db.query('SELECT * FROM student WHERE id = $1;', [student_id])
                .then(({rows, rowCount}) => {
                    if (rowCount === 0) {
                        console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId Student with id ' +
                            student_id + ' not found in table student');
                        reject({ status: 404, data: 'Student not found' });
                    }

                    return db.query(
                        'SELECT a.*, p.title, t.name as supervisor_name, t.surname as supervisor_surname ' +
                            'FROM applications a JOIN proposals p ON a.proposal_id = p.proposal_id ' +
                            'JOIN teacher t ON p.supervisor_id = t.id WHERE a.student_id = $1;',
                        [student_id]
                    );
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
        return new Promise((resolve, reject) => {
            const query = "SELECT p.proposal_id, p.title, p.type, p.description, p.expiration_date, p.level, " +
                "a.id as application_id, a.status as application_status, a.application_date, " +
                "s.id as student_id, s.surname, s.name, s.email, s.enrollment_year, s.cod_degree " +
                "FROM proposals p JOIN applications a ON a.proposal_id = p.proposal_id JOIN student s ON s.id = a.student_id " +
                "JOIN virtual_clock vc ON vc.prop_name = 'virtual_date' AND p.expiration_date >= vc.prop_value " + //! VIRTUAL_CLOCK: remove this line in production
                "WHERE p.supervisor_id = $1 " +
                // "AND p.expiration_date >= current_date " + //! VIRTUAL_CLOCK: uncomment this line in production
                "AND a.status = 'Pending'";
            db.query(query, [id]).then(({ rows, rowCount }) => {
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
            }).catch((err) => {
                console.error('[BACKEND-SERVER] Error in getAllApplicationsByTeacherId', err);
                reject({ status: 500, data: 'Internal server error' });
            });
        });
    },

    insertNewApplication: async(proposal_id, student_id) => {
        const status = 'Pending'
        // const application_date = new Date().toISOString() //! VIRTUAL_CLOCK: uncomment this line in production

        try {

            const studentCheck = await db.query('SELECT * FROM student WHERE id = $1', [student_id]);
            const proposalCheck = await db.query('SELECT * FROM proposals WHERE proposal_id = $1', [proposal_id]);

            // Check that the student doesn't have any application pending or accepted
            const applicationCheck = await db.query('SELECT * FROM applications WHERE student_id = $1 AND status NOT IN ($2, $3)', [student_id, "Rejected", "Canceled"]);

            if (studentCheck.rows.length === 0 || proposalCheck.rows.length === 0 ) {
                throw new Error(`Student with id ${student_id} not found or Proposal with id ${proposal_id} not found.`);
            } else if (applicationCheck.rows.length !== 0) {
                throw new Error(`Student with id ${student_id} currently already has pending or accepted applications.`);
            } else {
                // okay it's another call to the DB but it will be removed in production so...
                const { data: application_date } = getVirtualDate();  //! VIRTUAL_CLOCK: remove this line in production
                const query = "INSERT INTO public.applications (proposal_id, student_id, status, application_date) VALUES ($1,$2,$3,$4) RETURNING * ;";
                const res = await db.query(query, [proposal_id, student_id, status, application_date])
                return res;
            }

        } catch (error) {
            console.error('[BACKEND-SERVER] Error in insertNewApplication service:', error);
            throw error;
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
     * Get all applications for a given proposal whose status is Pending
     * @param proposal_id
     * @returns {Promise<{data: *}>}
     */
    getAllPendingApplicationsByProposalId: async (proposal_id) => {
        try {
            const query = "SELECT * FROM applications WHERE proposal_id = $1 AND status = 'Pending';";

            const { rows } = await db.query(query, [proposal_id]);

            return { data: rows };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in getAllCanceledApplicationsByProposalId service: ', error);
            throw error;
        }
    },

    /**
     * Set the status of the applications of a certain proposal identified by its id as Canceled if they are Pending
     *
     * @param {string} proposal_id
     *
     * @returns {Promise<{data: Number}>} Number of proposals modified
     *
     * @throws {Error} if
     */
    cancelPendingApplicationsByProposalId: async (proposal_id) => {
        try {
            const query = "UPDATE applications SET status = 'Canceled' WHERE proposal_id = $1 AND status = 'Pending';";

            const { rowCount } = await db.query(query, [proposal_id]);
            return { data: rowCount };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in cancelPendingApplicationsByProposalId service: ', error);
            throw error;
        }
    },

    /**
     * Get the application given its id.
     * The returned object contains also the corresponding proposal
     * object embedded.
     *
     * @param {string} application_id
     *
     * @returns {Promise<{
     * data: {
     *  id: string,
     *  student_id: string,
     *  status: string,
     *  application_date: date,
     *  proposal: Proposal
     * } }>}
     *
     * @throws {Error} if application not found
     */
    getApplicationById: async (application_id) => {
        try {
            const query = "SELECT * FROM applications a join proposals p " +
                "ON a.proposal_id = p.proposal_id " +
                "WHERE a.id = $1;"

            const { rows, rowCount } = await db.query(query, [application_id]);
            if (rowCount === 0) {
                return { data: undefined };
            }

            const application = {
                id: rows[0].id,
                student_id: rows[0].student_id,
                status: rows[0].status,
                application_date: rows[0].application_date,
                proposal: rowToProposal(rows[0])
            }

            return { data: application };
        } catch (error) {
            console.error('[BACKEND-SERVER] Error in getApplicationById: ', error);
            throw error;
        }
    },

    /**
     * Get all the applications related to a proposal
     *
     * @parama proposal_id
     *
     * @returns {data: [{id: string, proposal_id: string, student_id: string, status: string, ...}]}
     *
     */
    getAllApplicationsByProposalId: async (proposal_id) => {
        try{
            let query = "select * from applications where proposal_id = $1";
            let result = await db.query(query, [proposal_id]);

            if (result.rowCount === 0)
                return {data:undefined};

            const applications = result.rows.map((a)=>{
                return {
                    id: a.id,
                    proposal_id: a.proposal_id,
                    student_id: a.student_id,
                    status: a.status,
                    application_date: a.application_date
                }
            });

            return {data: applications};

        }catch (error) {
            console.error('[BACKEND-SERVER] Error in getAllApplicationsByProposalId: ', error);
            throw error;
        }
    }
}