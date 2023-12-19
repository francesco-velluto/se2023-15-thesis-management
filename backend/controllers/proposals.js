"use strict";

const proposalsService = require("../service/proposals.service");
const Teacher = require("../model/Teacher");
const applicationsService = require("../service/applications.service");
const dayjs = require("dayjs");
const { getTeacherById } = require("../service/teachers.service");

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
    proposalsService.getAllProposals(req.user.cod_degree)
      .then((result) => {
        res.status(result.status).json({ proposals: result.data });
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
    if (!proposal_id) {
      return res.status(400).json({ error: "Missing proposal_id" });
    }

    proposalsService.getProposalById(proposal_id)
      .then((result) => {
        if (result.data.supervisor_id !== req.user.id && req.user instanceof Teacher) {
          return res.status(401).json({ error: "Access to this thesis proposal is unauthorized. Please ensure you have the necessary permissions to view this content." });
        }
        if (result.data.deleted === true) {
          return res.status(401).json({ error: "Access to this thesis proposal is unauthorized. Please ensure you have the necessary permissions to view this content." });
        }
        if (result.data.archived === true) {
          return res.status(401).json({ error: "Access to this thesis proposal is unauthorized. Please ensure you have the necessary permissions to view this content." });
        }
        return res.status(result.status).json(result.data);
      })
      .catch((err) => {
        return res.status(err.status).json({ error: err.data });
      });
  },

  /**
   * Insert a new proposal
   *
   * @params none
   * @body {
   *  title : string,
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
      const newId = "P" + (maxIdNum + 1).toString().padStart(3, "0");
      const proposal = await proposalsService.insertProposal({
        ...req.body,
        proposal_id: newId,
        groups: [req.user.cod_group],
        supervisor_id: req.user.id
      });
      res.status(201).json({ proposal });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot insert new proposal", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },

  /**
   * Insert a new thesis request
   *
   * @params none
   * @body {
   *  title : string,
   *  description : string,
   *  supervisor : string,
   * }
   * @returns { proposal: { request_id: number, title: string, ... } }
   * @error 500 Internal Server Error - if something went wrong
   *
   * Refer to the official documentation for more details
   */
  insertThesisRequest: async (req, res) => {
    try {
      // check if the teacher exists in the db
      const teacher = await getTeacherById(req.body.supervisor);
      if (!teacher?.data) {
        console.error("[BACKEND-SERVER] This teacher doesn't exist");
        res.status(404).json({ error: "This teacher doesn't exist, enter a valid teacher!" });
        return;
      }

      const maxIdNum = await proposalsService.getMaxThesisRequestIdNumber();
      const newId = "R" + (maxIdNum + 1).toString().padStart(3, "0");
      const thesisRequest = await proposalsService.insertThesisRequest({
        request_id: newId,
        title: req.body.title,
        description: req.body.description,
        supervisor_id: req.body.supervisor,
        student_id: req.user.id
      });
      res.status(201).json({ response: thesisRequest });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot insert new thesis request", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },

  /**
   * Get all active proposals by a professor
   *
   * @params none
   * @body none
   * @returns { proposals: [ { proposal_id: string, title: string, description: string, supervisor_id: string, ... } ] }
   * @error 401 Unauthorized - if the user isn't a Student
   * @error 500 Internal Server Error - if something went wrong
   */
  getAllProfessorProposals: async (req, res) => {
    proposalsService.getAllProfessorProposals(req.user.id)
      .then((result) => {
        res.status(result.status).json({ proposals: result.data });
      })
      .catch((err) => {
        res.status(err.status).json({ error: err.data });
      });
  },

  /**
   * Update an existing proposal
   *
   * @params proposal_id
   * @body {
   *  title : string,
   *  keywords : string[],
   *  type : string,
   *  description : string,
   *  required_knowledge : string,
   *  notes : string,
   *  expiration_date : string,
   *  level : string,
   *  programmes : string[],
   * }
   * @returns { proposal: { id: number, title: string, ... } }
   * @error 404 Not Found - if the proposal does not exist
   * @error 500 Internal Server Error - if something went wrong
   *
   * Refer to the official documentation for more details
   */
  updateProposal: async (req, res) => {
    try {
      const { data: proposal } = await proposalsService.getProposalById(req.params.proposal_id);

      if (proposal.supervisor_id !== req.user?.id) {
        return res.status(403).json({ error: "Not authorized!" });
      }

      if (req.params.proposal_id !== req.body.proposal_id) {
        return res.status(400).json({ error: "Bad request!" });
      }

      const { data } = await proposalsService.updateProposal({ ...req.body });
      res.status(200).json({ proposal: data });
    } catch (err) {
      if (err.status === 404)
        return res.status(404).json({ error: "Proposal not found!" });

      console.error("[BACKEND-SERVER] Cannot update proposal", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },


  /**
   * Delete a proposal given its id.
   * A proposal with an accepted application cannot be removed.
   * All the applications of the deleted proposal are set to canceled.
   *
   * @params proposal_id
   * @body none
   *
   *
   */
  deleteProposal: async (req, res) => {

    try {
      const proposal_id = req.params.proposal_id;
      const teacher_id = req.user.id;

      // check if the proposal belong to the teacher
      const proposal = await proposalsService.getProposalById(proposal_id);


      if (proposal.data.supervisor_id !== teacher_id) {
        return res.status(401).json({ error: "Access to this thesis proposal is unauthorized. Please ensure you have the necessary permissions to view this content." });
      }

      if (req.params.proposal_id !== proposal_id) {
        return res.status(400).json({ error: "Bad request!" });
      }

      // check if the proposal is expired
      if (dayjs(proposal.data.expiration_date).format('YYYY-MM-DD') < dayjs().format('YYYY-MM-DD')) {
        return res.status(403).json({ error: "Cannot delete an expired proposal" });
      }



      // check if the proposal is archived
      if (proposal.data.archived) {
        return res.status(403).json({ error: "Cannot delete an archived proposal" });
      }

      // check if the proposal is already deleted
      if (proposal.data.deleted) {
        return res.status(403).json({ error: "Cannot delete an already deleted proposal" });
      }

      //check if there is an accepted application related to the proposal
      const { data: applications } = await applicationsService.getAllApplicationsByProposalId(proposal_id);



      if (applications?.some((a) => a.status === "Accepted"))
        return res.status(403).json({ error: "Cannot delete a proposal with an accepted application" });


      const deletedProposal = await proposalsService.deleteProposal(proposal_id);

      if (!deletedProposal.data)
        return res.status(404).json({ error: "Proposal not found" });

      return res.status(204).json();

    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot delete the proposal", err);
      if (err.status && err.status === 404)
        return res.status(404).json({ error: err.data });
      res.status(500).json({ error: "Internal server error has occurred" });
    }



  }
};
