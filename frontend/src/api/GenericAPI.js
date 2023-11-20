const APIConfig = require('./api.config.js');

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
export const APICall = async (url, method = "GET", body = undefined, expectResponse = true) => {
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
        } else {
            errors = (await response.json()).errors;
        }
    } catch (errs) {
        const err = ["Failed to contact the server"];
        throw err;
    }

    if (errors && errors.length !== 0) {
        throw errors;
    }
};
