"use strict";

const Teacher = require("../model/Teacher");
const applicationsService = require("../service/applications.service");
const proposalsService = require("../service/proposals.service");

const { sendUpdateApplicationStatusEmail, sendNewApplicationEmail} = require("./email.notifier");

/*** Upload an image file ***/

const multer = require('multer');
const path = require('path');
const fs = require('fs');

let upload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, './uploads');
            },
            filename: function (req, file, cb) {
              try {
                  if (!req.user.id) {
                      throw new Error('Missing required information, cannot upload file');
                  }
        
                  const currentDate = new Date();
                  const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
                  const filename = file.originalname + `_${req.user.id}_`+ formattedDate + '.pdf';
                  cb(null, filename);
              } catch (error) {
                  console.error(error);
                  cb(error);
              }
          }, 
        
        }),
        limits: {
            fileSize: 5000000, // 5 MB
          },
        fileFilter: function (req, file, cb) {
            const allowedFormats = 'application/pdf';
            if (file.mimetype == allowedFormats) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file format. Only PDF  are allowed.'), false);
            }
        }
    });


module.exports = {
    /**
     * Get all applications of a student by its id
     *
     * @params: student_id
     * @body: none
     * @returns: { [ { application_id: string, title: string, proposal_id: string, student_id: string, status: string, application_date: Date, supervisor_name: string, supervisor_surname: string } ] }
     * @error 401 Unauthorized - if the user is not authenticated or student_id is not the same as the authenticated user
     * @error 404 Not Found - if the student_id is not found
     * @error 500 Internal Server Error - if something went wrong
     *
     * The access to this is restricted to authenticated users only.
     * Check if user is authenticated is done by the middleware isLoggedIn.
     */
    getAllApplicationsByStudentId: (req, res) => {
        const student_id = req.params.student_id;

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

    getAllApplicationsByProposalId: (req, res) => {
        const proposal_id = req.params.proposal_id;

        proposalsService.getProposalById(proposal_id)
            .then((result) => {
                if (result.data.supervisor_id !== req.user.id)
                    return res.status(401).json({ error: "You are not allowed to see details of applications of this proposal" });
            })
            .catch((err) => {
                return res.status(err.status).json({ error: err.data });
            });


        applicationsService.getAllApplicationsByProposalId(proposal_id)
            .then((result) => {
                res.status(200).json(result.data);
            })
            .catch((err) => {
                res.status(500).json({ errors: [err.data] });
            });
    },

    insertNewApplication: (req, res) => {
        if (req?.body && Object.keys(req.body).length !== 0) {
            applicationsService.insertNewApplication(req.body.proposal_id, req.user.id)
                .then(async (result) => {
                    // application is inserted correctly, try to send email to the supervisor
                    let emailNotificationSent = false;
                    let fileSent = false;

                    try {
                        if (req.body.upload_id){
                            const res = await applicationsService.AddApplicationFile(req.user.id, result.rows[0].id, req.body.upload_id);
                            if (res.success === true ){
                                fileSent = true;
                            }
                        }
                        // send email to the supervisor
                        await sendNewApplicationEmail(result.rows[0].id, result.rows[0].application_date, result.rows[0].proposal_id, result.rows[0].student_id);

                        // if the email has been sent correctly, set the flag to true
                        emailNotificationSent = true;
                    } catch(e) {
                        console.error("[BACKEND-SERVER] Cannot send application email to supervisor: ", e);
                    }

                    // event if the email cannot be sent, at this point the application has still been correctly inserted
                    return res.status(200).json({...result.rows[0], emailNotificationSent, fileSent});
                })
                .catch((err) => {
                    return res.status(500).json({ errors: [err] });
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
            let canceledApplications = [];
            if (status === "Accepted") {
                const { proposal_id } = updatedApplication;

                // get the list of all pending applications for the same thesis proposal before canceling them
                canceledApplications = (await applicationsService.getAllPendingApplicationsByProposalId(proposal_id)).data;

                await applicationsService.cancelPendingApplicationsByProposalId(proposal_id);

                const { data: archivedProposal } = await proposalsService.setProposalArchived(proposal_id);

                if (!archivedProposal?.archived)
                    throw Error("Some error occurred in the database: proposal not archived");
            }

            /**
             * Notify the student that his application has been accepted/rejected
             */
            let emailNotificationSent = false;

            try {
                // send email to the main student
                await sendUpdateApplicationStatusEmail(updatedApplication, teacher_id, proposal, status);

                // send email to all other students whose application has been canceled
                for (const canceledApplication of canceledApplications)
                    await sendUpdateApplicationStatusEmail(canceledApplication, teacher_id, proposal, "Canceled");

                // if all emails have been sent correctly, set the flag to true
                emailNotificationSent = true;
            } catch (e) {
                console.error("[BACKEND-SERVER] Cannot send application decision email to students: ", e);
            }

            // Even if the email cannot be sent, at this point the application has still been correctly accepted/rejected
            return res.status(200).json({ application: updatedApplication, emailNotificationSent });
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
    },

    uploadFileServer: async (req, res) => {
        // "file" is the name of the formData in the frontend
        upload.single('file')(req, res, function (err) {
        if (err) {
            console.error("[BACKEND-ERROR] Error in uploadFileServer: cannot upload to the server \n" + err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        else {
            const date = new Date().toISOString().slice(0, 10);

            applicationsService.uploadFileServer(req.user.id, req.file.filename, date)
            .then(function (response) {
                res.status(201).json(response);
            })
            .catch(function (err) {
                res.status(500).json({err});
            });
        }
        });
    },

    previewFile: async (req, res) => {
        try {
            let {success, data} = {success: false, data: undefined};
            if(req.params.upload_id) {
                ({ success, data } = await applicationsService.getUploadedFile(req.user.id, req.params.upload_id));
            }
            if(req.params.application_id) {
                ({ success, data } = await applicationsService.getApplicationFile(req.user.id, req.params.application_id));
            }
            if (success === true) {
                const filePath = path.join(__dirname, '..', 'uploads', data.filename);
                if (fs.existsSync(filePath)) {
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', `inline; filename=${data.filename}`);
                if (res.headersSent) {
                    console.warn("Response headers already sent. Exiting.");
                    return;
                }
                const stream = fs.createReadStream(filePath);
                stream.pipe(res);
                } else {
                res.status(404).json({ error: 'File not found' });
                }
        } else {
            res.status(404).json({ error: 'Resume not found for the specified student' });
        }
        } catch (error) {
        console.error("[BACKEND-SERVER] Error in getStudentResume", error);
        res.status(500).json({ error: "Internal server error" });
        }
    },

    getFileInfo: async (req, res) => {
        try {
            let {success, data} = {success: false, data: undefined};
            // if it is not yet associated to an application, the student jsut uploaded the file but did not "confirm" application yet
            if (req.params.upload_id){
                ({ success, data } = await applicationsService.getUploadedFile(req.user.id, req.params.upload_id));
            }
            // here we retrieve the file associated to an application
            if (req.params.application_id) {
                ({ success, data } = await applicationsService.getApplicationFile(req.user.id, req.params.application_id));
            }
            if (success === true ) {
                res.status(200).json({ data });
            }
            else { res.status(404).json({ message: "No file found" });    }
        }
    catch(error) {res.status(500).json({ error: "Internal server error" }); }
    }
}