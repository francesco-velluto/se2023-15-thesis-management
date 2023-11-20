const { APICall } = require('./GenericAPI');
const APIConfig = require('./api.config.js');

const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';


/**
 * Interface for the Authentication API
 * Route /api/authentication
 */
module.exports = {
    /**
     * Login a user to the system
     *
     * Sends a POST request to /api/authentication/login
     *
     * @param {string} username - The username of the user.
     * @param {string} password - The password of the user.
     * @returns {Promise} - Resolves with the user's token upon successful login.
     * @throws {Error} - Throws an error with specific messages for various scenarios:
     *                  - 400 Bad Request: If username or password is not present.
     *                  - 401 Unauthorized: If username or password is not valid.
     *                  - 500 Internal Server Error: If something went wrong during the request.
     */
    login: async (username, password) => {
        return await APICall(AuthenticationAPIURL + '/login', 'POST', JSON.stringify({ username, password }));
    },

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
        return APICall(AuthenticationAPIURL + '/logout', 'DELETE');
    }
}