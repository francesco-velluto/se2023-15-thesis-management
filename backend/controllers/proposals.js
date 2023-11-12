"use strict";

const Student = require("../model/Student");
const proposalsService = require("../service/proposals.service");

module.exports = {
    /**
     * Get all available proposals
     *
     * @params none
     * @body none
     * @returns { proposals: [ { proposal_id: string, title: string, description: string, supervisor_id: string, ... } ] }
     * @error 401 Unauthorized - if the user isn't a Student
     * @error 500 Internal Server Error - if something went wrong
     */
    getAllProposals: async (req, res) => {
       if (!req.user instanceof Student) {
            return res.status(401).json({ errors: ['Must be a student to make this request!'] });
        }

        proposalsService.getAllProposals()
            .then((result) => {
                res.status(result.status).json(result.data);
            })
            .catch((err) => {
                res.status(err.status).json({ error: err.data });
            });

    }
}