const APIConfig = require('./config.json');

const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';


/**
 * Generic API call
 *
 * @param endpoint API endpoint string to fetch
 * @param method HTTP method
 * @param body HTTP request body string
 * @param headers additional HTTP headers to be passed to 'fetch'
 * @param expectResponse wheter to expect a non-empty response body
 * 
 * @returns whatever the specified API endpoint returns
 */
const APICall = async (url, method = "GET", body = undefined, expectResponse = true) => {
    let errors = [];

    try {
        const response = await fetch(url, {
            method,
            body,
            headers: APIConfig.API_REQUEST_HEADERS,
            credentials: "include"
        });

        if (response.ok) {
            const text = await response.text();

            // Check if the response body is empty
            if (!text.trim()) {
                return undefined; // or handle accordingly
            }

            if (expectResponse) {
                let data = JSON.parse(text);
                return await data;
            }
        }
        else errors = (await response.json()).errors;
    } catch (errs) {
        const err = ["Failed to contact the server"];
        throw err;
    }

    if (errors && errors.length !== 0) {
        throw errors;
    }
};

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