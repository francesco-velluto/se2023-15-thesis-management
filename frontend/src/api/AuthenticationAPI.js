const APIConfig = require('./config.json');

const AuthenticationAPIURL = APIConfig.API_URL + '/authentication';

/**
 * Interface for the Authentication API
 * Route /api/authentication
 */

module.exports = {
    /**
     * Login a user to the system
     *
     * GET /api/authentication/login
     *
     * @params: none
     * @body: { username: string, password: string }
     * @returns: { token: string }
     * @error: 400 Bad Request - if username or password is not present
     * @error: 401 Unauthorized - if username or password is not valid
     * @error: 500 Internal Server Error - if something went wrong
     */
    login: async (username, password) => {
        const response = await fetch(AuthenticationAPIURL + '/login', {
            method: 'POST',
            headers: APIConfig.API_REQUEST_HEADERS,
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        try {
            let data = await response.json();

            if (response.ok) {
                console.log("dati restituiti: " + data);
            } else {
                console.error("errore: " + data.error);
                throw data.error;
            }

            return data;
        } catch (error) {
            console.error("error in fetch login: " + error);
            throw error;
        };
    },

    /**
     * Fetch the current user
     */
    fetchCurrentUser: async () => {
        const response = await fetch(AuthenticationAPIURL + '/current/user', {
            method: 'GET',
            headers: APIConfig.API_REQUEST_HEADERS,
            body: undefined,
            credentials: 'include'
        });

        try {
            let data = await response.json();

            if (response.ok) {
                console.log("dati restituiti: " + data);
            } else {
                console.error("errore: " + data.error);
                throw data.error;
            }

            return data;
        } catch (error) {
            console.error("error in fetch login: " + error);
            throw error;
        };
    }
}