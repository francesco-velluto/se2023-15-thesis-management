const { APICall } = require('./GenericAPI');
const APIConfig = require('./api.config.js');

const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';


/**
 * Interface for the Authentication API
 * Route /api/authentication
 */
module.exports = {

    /**
     * Fetch the current user
     *
     * Sends a GET request to /api/authentication/current/user
     *
     * @returns {Promise} - Resolves with the current user's information upon successful request.
     * @throws {Error} - Throws an error with a specific message if something goes wrong during the request.
     */
    fetchCurrentUser: async () => {
        return await APICall(AuthenticationAPIURL + '/current/user');
    },

    /**
     * Logout the current user
     *
     * Sends a DELETE request to /api/authentication/logout
     *
     * @returns {Promise} - Resolves upon successful logout.
     * @throws {Error} - Throws an error with a specific message if something goes wrong during the request.
     */
    logout: () => {
        return APICall(AuthenticationAPIURL + '/logout', 'POST');
    }
}