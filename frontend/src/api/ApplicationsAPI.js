const { APICall } = require('./GenericAPI');
const APIConfig = require('./config.json');

const ApplicationsAPIURL = APIConfig.API_URL + '/applications';

/**
 * Interface for the Applications API
 * Route /api/applications
 */
module.exports = {
    /**
     * Retrieve all applications for thesis proposals supervised by the authenticated teacher
     *
     * Sends a GET request to the server's applications API endpoint to fetch applications
     * associated with thesis proposals supervised by the currently authenticated teacher.
     *
     * @returns {Promise} - Resolves with the fetched data containing applications organized by proposal,
     *                    or rejects with an error status and message if the request encounters issues.
     */
    getAllApplicationsByTeacher: async () => {
        return await APICall(ApplicationsAPIURL, 'GET');
    },

}