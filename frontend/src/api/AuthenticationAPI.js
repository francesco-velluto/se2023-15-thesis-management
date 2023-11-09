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
        fetch(AuthenticationAPIURL + '/login', {
            method: 'POST',
            headers: APIConfig.API_REQUEST_HEADERS,
            body: JSON.stringify({ username, password })
        }).then(async response => {
            let data = await response.json();

            if (response.ok) {
                console.log("dati restituiti: " + data);
            } else {
                console.error("errore: " + data.error);
            }
        }).catch(error => {
            console.error("error in fetch login: " + error);
        });
    }
}