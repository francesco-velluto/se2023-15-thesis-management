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
        console.log(errs);
        const err = ["Failed to contact the server"];
        throw err;
    }

    if (errors && errors.length !== 0)
        throw errors;
};

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
        return await APICall(AuthenticationAPIURL + '/login', 'POST', JSON.stringify({ username, password }));
    },

    /**
     * Fetch the current user
     */
    fetchCurrentUser: async () => {
        return await APICall(AuthenticationAPIURL + '/current/user');
    },

    logout: () => {
        return APICall(AuthenticationAPIURL + '/logout', 'DELETE');
    }
}