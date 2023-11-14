"use strict";

const {
  insertProposal,
  getMaxProposalIdNumber,
} = require("../service/proposals.service");

const Student = require("../model/Student");


const proposalsService = require("../service/proposals.service");
const {proposal_id} = require("../model/Proposal");


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
        /** ALREADY CHECKED IN AUTHENTICATION CONTROLLER with isStudent
       if (!req.user instanceof Student) {
            return res.status(401).json({ errors: ['Must be a student to make this request!'] });
       }**/

        proposalsService.getAllProposals(req.user.cod_degree)
            .then((result) => {
                
                res.status(result.status).json({proposals: result.data});
                
            })
            .catch((err) => {
                res.status(err.status).json({ error: err.data });
            });

    },

    /**
     * Get a proposal details by its id
     *
     * @params proposal_id
     * @body none
     * @returns { supervisor_name: string, supervisor_surname: string, proposal_id: number, title: string, description: string, ... }
     * @error 400 Bad Request - if the proposal_id is missing
     * @error 404 Not Found - if the proposal_id is not found
     * @error 500 Internal Server Error - if something went wrong
     */
    getProposalById: async (req, res) => {
        let proposal_id = req.params.proposal_id;
        if(!proposal_id)
            return res.status(400).json({error: "Missing proposal_id"});

        proposalsService.getProposalById(proposal_id)
            .then((result) => {
                return res.status(result.status).json(result.data);
            })
            .catch((err) => {
                return res.status(err.status).json({error: err.data});
            });
    },
    /**
   * Insert a new proposal
   *
   * @params none
   * @body { 
   *  title : string,
   *  supervisor_id : string,
   *  keywords : string[],
   *  type : string,
   *  groups : string[],
   *  description : string,
   *  required_knowledge : string,
   *  notes : string,
   *  expiration_date : string,
   *  level : string,
   *  programmes : string[],
   * }
   * @returns { proposal: { id: number, title: string, ... } }
   * @error 500 Internal Server Error - if something went wrong
   * 
   * Refer to the official documentation for more details
   */
  insertProposal: async (req, res) => {
    try {
      const maxIdNum = await proposalsService.getMaxProposalIdNumber();
      const newId = "P" + (maxIdNum + 1).toString().padStart(3, 0);
      const proposal = await proposalsService.insertProposal({
        proposal_id: newId,
        ...req.body,
      });
      res.status(201).json({ proposal });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot insert new proposal", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  }
};
  
  

