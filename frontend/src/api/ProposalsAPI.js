const APIConfig = require('./config.json');

const ProposalsAPIURL = APIConfig.API_URL + '/proposals';

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
     * @returns: { proposals: [ { id: number, title: string, description: string, author: string, creationDate: string, status: string, ... } ] }
     * @error: 500 Internal Server Error - if something went wrong
     */
    getAllProposals: async () => {
        fetch(ProposalsAPIURL, {
            method: 'GET',
            headers: APIConfig.API_REQUEST_HEADERS,
            credentials: 'include'
        }).then(async res => {
            let data = await res.json()

            if(res.status < 400) {
                return data;
                
            } else {
                throw new Error("Error during proposal loading");
            }
        }).catch(() => {
            throw new Error("Error during proposal loading");
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
        return fetch(ProposalsAPIURL + '/' + proposal_id, {
            method: 'GET',
            headers: APIConfig.API_REQUEST_HEADERS,
            credentials: 'include'
        });
    }
}