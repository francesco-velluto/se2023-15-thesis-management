const APIConfig = require("./config.json");

const ProposalsAPIURL = APIConfig.API_URL + "/proposals";
const TeachersAPIURL = APIConfig.API_URL + "/teachers";
const DegreesAPIURL = APIConfig.API_URL + "/degrees";

/**
 * Interface for the Proposals API
 * Route /api/proposals
 */

module.exports = {
  /**
   * Get all proposals
   *
   * GET /api/proposals
   *
   * @params: none
   * @body: none
   * @returns: { proposals: [ { proposal_id: number, title: string, description: string, supervisor_surname: string, ... } ] }
   * @error: 500 Internal Server Error - if something went wrong
   */
  getAllProposals: async () => {
    return fetch(ProposalsAPIURL, {
      method: "GET",
      headers: APIConfig.API_REQUEST_HEADERS,
      credentials: "include",
    });
  },

  /**
   * Get a proposal by id
   *
   * GET /api/proposals/:id
   *
   * @params: id
   * @body: none
   * @returns: { supervsisor_name: string, supervisor_surname: string, proposal_id: number, title: string, description: string, ... }
   * @error: 404 Not Found - if the proposal does not exist
   * @error: 500 Internal Server Error - if something went wrong
   */
  getProposalById: async (proposal_id) => {
    return fetch(ProposalsAPIURL + "/" + proposal_id, {
      method: "GET",
      headers: APIConfig.API_REQUEST_HEADERS,
      credentials: "include",
    });
  },

  /**
   * Insert a new proposal
   *
   * POST /api/proposals
   *
   * @params: none
   * @body: {c}
   */

  insertNewProposal: async (newProposal) => {
    try {
      const response = await fetch(ProposalsAPIURL, {
        method: "POST",
        headers: APIConfig.API_REQUEST_HEADERS,
        credentials: "include",
        body: JSON.stringify(newProposal),
      });

      if (response.ok) {
        const resObject = await response.json();
        return resObject.proposal;
      } else {
        const res = await response.json();
        throw new Error(res.error);
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Get all the teachers
   *
   * GET /api/teachers
   */
  getAllTeachers: async () => {
    try {
      const response = await fetch(TeachersAPIURL, {
        method: "GET",
        headers: APIConfig.API_REQUEST_HEADERS,
        credentials: "include",
      });

      if (response.ok) {
        const resObject = await response.json();
        return resObject.teachers;
      } else {
        const res = await response.json();
        throw new Error(res.error);
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  /**
   * Get all the degrees
   *
   * GET /api/degrees
   */
  getAllDegrees: async () => {
    try {
      const response = await fetch(DegreesAPIURL, {
        method: "GET",
        headers: APIConfig.API_REQUEST_HEADERS,
        credentials: "include",
      });

      if (response.ok) {
        const resObject = await response.json();
        return resObject.degrees;
      } else {
        const res = await response.json();
        throw new Error(res.error);
      }
    } catch (err) {
      throw new Error(err);
    }
  },
};
