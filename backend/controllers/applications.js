"use strict";

const Student = require("../model/Student");
const Teacher = require("../model/Teacher");
const Application = require("../model/Application");
const applicationsService = require("../service/applications.service");
const proposalsService = require("../service/proposals.service");

module.exports = {
    /**
     * Get all applications of a student by its id
     *
     * @params: student_id
     * @body: none
     * @returns: { [ { proposal_id: number, title: string, description: string, application_date: date, status: string } ] }
     * @error 401 Unauthorized - if student_id is not the same as the authenticated user
     * @error 404 Not Found - if the student_id is not found
     * @error 500 Internal Server Error - if something went wrong
     *
     * The access to this is restricted to authenticated users only.
     * Check if user is authenticated is done by the middleware isLoggedIn.
     */
    getAllApplicationsByStudentId: (req, res) => {
        const student_id = req.params.student_id;

        if(!(req.user instanceof Student))
            return res.status(401).json({ error: "Must be a student to make this request!" });

        // check if student_id is the same as the authenticated user
        if (student_id !== req.user.id)
            return res.status(401).json({ error: "You cannot get applications of another student" });

        applicationsService.getAllApplicationsByStudentId(student_id)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ error: err.data });
            });
    },


    /**
     * Get all applications of a teacher by their id
     *
     * @params: none
     * @body: none
     * @returns: {
     *   proposal_id: number,
     *   title: string,
     *   type: string,
     *   description: string,
     *   expiration_date: date,
     *   level: string,
     *   applications: [
     *     {
     *       application_id: number,
     *       status: string,
     *       application_date: date,
     *       student_id: number,
     *       surname: string,
     *       name: string,
     *       email: string,
     *       enrollment_year: number,
     *       cod_degree: string
     *     }
     *   ]
     * }
     * @error 401 Unauthorized - if teacher_id is not the same as the authenticated user
     * @error 404 Not Found - if the teacher_id is not found or no applications are found for their thesis proposals
     * @error 500 Internal Server Error - if something went wrong during the process
     *
     * The access to this is restricted to authenticated users only.
     * Check if the user is authenticated is done by the middleware isLoggedIn.
     */
    getAllApplicationsByTeacherId: (req, res) => {
        if (!(req.user instanceof Teacher)) {
            return res.status(401).json({ errors: ['Must be a teacher to make this request!'] });
        }

        applicationsService.getAllApplicationsByTeacherId(req.user.id)
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ errors: [err.data] });
            });
    },

    insertNewApplication: (req, res) => {
        if (req?.body && Object.keys(req.body).length !== 0) {
            applicationsService.insertNewApplication(req.body.proposal_id, req.user.id)
                .then((result) => {
                    res.status(200).json(result.data);
                })
                .catch((err) => {
                    res.status(500).json({ errors: [err.message] });
                });

        } else
            return res.status(400).send("Parameters not found in insert new application controller");

    },


    /**
     * Accept/Reject an application
     * 
     * @params none
     * 
     * @body {application_id: string, status: string}
     * 
     */
    acceptOrRejectApplication: async (req, res) => {
        const status = req.body.status;
        const application_id = req.params.application_id;
        const teacher_id = req.user.id;

        if (!(status === "Accepted" || status === "Rejected"))
            return res.status(400).json({ error: "Invalid status field value in request body" });

        if (!application_id) {
            return res.status(400).json({ error: "Invalid application id parameter" });
        }

        try {
            // Check that the application exists
            const { data: application } = await applicationsService.getApplicationById(application_id);

            if (!application) {
                return res.status(404).json({ error: "Application not found!" });
            }
            
            const { proposal } = application;

            if (proposal.supervisor_id !== teacher_id) {
                return res.status(403).json({ error: "Not authorized!" });
            }
            
            const { data: updatedApplication } = await applicationsService.setApplicationStatus(application_id, status);

            if (!updatedApplication) {
                throw Error("Some error occurred in the database: application status not updated");
            }

            /*
             * If the application has been accepted:
             *  - cancel all other pending applications for the same thesis proposal
             *  - archive the thesis proposal related to that application
             */
            if (status === "Accepted") {
                const { proposal_id } = updatedApplication;
                await applicationsService.cancelPendingApplicationsByProposalId(proposal_id);

                const { data: archivedProposal } = await proposalsService.setProposalArchived(proposal_id);
                
                if (!archivedProposal || !archivedProposal.archived)
                    throw Error("Some error occurred in the database: proposal not archived");
            }
            
            return res.status(200).json({ application: updatedApplication });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "Internal server error" });
        }
    },

    /**
     * Get the application given its id
     * 
     * @param {string} application_id id of the application 
     * 
     * @body none
     * 
     */
    getApplicationById: async (req, res) => {
        const application_id = req.params.application_id;
        const teacher_id = req.user.id;

        if (!application_id) {
            return res.status(400).json({ error: "Invalid application id parameter" });
        }
        
        try {
            const { data: application } = await applicationsService.getApplicationById(application_id);

            if (!application) {
                return res.status(404).json({ error: "Application not found!" });
            }
            
            const { proposal } = application;

            if (proposal.supervisor_id !== teacher_id) {
                return res.status(403).json({ error: "Not authorized!" });
            }

            return res.status(200).json({ application });
        } catch (err) {
            console.error("[BACKEND-SERVER] Cannot get the application: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}