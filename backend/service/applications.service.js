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
                    if (rows.count == 0) {
                        console.error('[BACKEND-SERVER] Error in getAllApplicationsByStudentId Student with id ' + 
                            student_id + ' not found in table student');
                        reject({ status: 404, data: 'Student not found' });
                    }

                    return db.query('SELECT p.proposal_id, p.title, p.description, \
                        a.application_date, a.status \
                        FROM applications a \
                        JOIN proposals p ON a.proposal_id = p.proposal_id \
                        WHERE a.id = $1;', [student_id]);
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
                const rows = await db.query(
                    "SELECT p.proposal_id, p.title, p.type, p.description, p.expiration_date, p.level, \
                        a.application_id, a.status as application_status, a.application_date, \
                        s.id as student_id, s.surname, s.name, s.email, s.enrollment_year, s.cod_degree \
                    FROM proposals p join applications a on a.proposal_id = p.proposal_id join student s ON s.id = a.id \
                    WHERE p.supervisor_id = $1 and p.expiration_date >= current_date and a.status = 'Pending'",
                    [id]);

                if (rows.rows == 0) {
                    resolve({ status: 200, data: [] });
                }
                
                // each application is pushed into an array of applications related to the same thesis proposal
                /* let applications = rows.rows.reduce((proposals, element) => {
                    const id = element.proposal_id;
                    if (!proposals[id]) {
                        proposals[id] = [];
                    }
                    proposals[id].push(element);
                    return proposals;
                }, {}); */
                let applications = rows.rows.reduce((proposals, applicationRow) => {
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
        const query = "INSERT INTO public.applications (proposal_id, id, status, application_date) VALUES ($1,$2,$3,$4) RETURNING * ;";
        try {

            const studentCheck = await db.query('SELECT * FROM student WHERE id = $1', [student_id]);
            const proposalCheck = await db.query('SELECT * FROM proposals WHERE proposal_id = $1', [proposal_id]);
            const applicationCheck = await db.query('SELECT * FROM applications WHERE proposal_id = $1 AND id = $2', [proposal_id, student_id]);

            if (studentCheck.rows.length === 0 || proposalCheck.rows.length === 0 ) {
              throw new Error(`Student with id ${student_id} not found or Proposal with id ${proposal_id} not found.`);
            } else if (applicationCheck.rows.length !== 0) {
                throw new Error(`Student with id ${student_id} has already applied to proposal with id ${proposal_id}.`);
            }
            else {
                
                const res = await db.query(query, [proposal_id, student_id, status, application_date])
                return res

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
     * @param {string} teacher_id id of the teacher
     * @param {string} status new status; must be "Accepted" or "Rejected"
     * 
     * @returns {Promise<{Application}>} with proposal_id, id (of the studend applied), status, application_date
     * 
     * @throws {Error} if proposal not found or student not found or 
     */

    setApplicationStatus: async(status, teacher_id, application_id) => {
        const query = "UPDATE applications SET status = $1 WHERE application_id = $2 RETURNING *;";

        try {
            const statusCheck = status == "Accepted" || status == "Rejected";
            if (!statusCheck)
                throw new Error("Invalid status value.");
            
            const applicationCheck = await db.query(
                "select * from applications a join proposals p on a.proposal_id = p.proposal_id  where a.application_id = $1 and p.supervisor_id = $2;",
                 [application_id, teacher_id]);

            if(applicationCheck.rows.length === 0){
                throw new Error("This application doesn't exist or doesn't belong to the teacher");
            } else {
                const updatedApplication = await db.query(query, [status, application_id]);
                if (updatedApplication.rows.length === 0)
                    throw new Error(`No application found with application_id: ${application_id}`);
                return new Application(
                    updatedApplication.rows[0].proposal_id,
                    updatedApplication.rows[0].id,
                    updatedApplication.rows[0].status,
                    updatedApplication.rows[0].application_date
                );

            }
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
     * @returns {number} Number of proposals modified
     * 
     * @throws {Error} if 
     */

    setApplicationsStatusCanceledByProposalId: async(proposal_id, teacher_id) => {
        const query = "UPDATE applications SET status = 'Canceled' WHERE proposal_id = $1 AND status = 'Pending';";

        try{
            const proposalCheck = await db.query('SELECT * FROM proposals WHERE proposal_id = $1 AND supervisor_id = $2;',
                [proposal_id, teacher_id]);
            
            if (proposalCheck.rows.length === 0){
                throw new Error(`Proposal with proposal_id = ${proposal_id} not found or not belonging to this teacher`);
            }else{

                const deletedApplications = await db.query(query, [proposal_id]);
                return deletedApplications.rowCount
            }
        }catch(error){
            console.error('[BACKEND-SERVER] Error in setApplicationStatusCanceledByProposalId service: ', error);
            return error;
        }
    },

    /**
     * Get the application given its id
     * 
     * @param {string} proposal_id
     * 
     * @returns {Application}
     * 
     * @throws {Error} if application not found
     */

    getApplicationById: async(application_id) =>{
        const query = "SELECT * FROM applications where application_id = $1";

        try{
            const row = await db.query(query, [application_id]);
            if (row.rows.length === 0){
                return new Error(`Application with application_id = ${application_id} not found`);
            }
            const application = row.rows[0];

            return new Application(
                application.proposal_id,
                application.id,
                application.status,
                application.application_date
            );

        }catch(error){
            console.error('[BACKEND-SERVER] Error in getApplicationById: ', error);
            return error;
        }
    }
}