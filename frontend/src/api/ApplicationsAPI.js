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

    getAllApplicationsByStudent: async (id) => {
        return await APICall(ApplicationsAPIURL + `/${id}`, 'GET');
    },



    insertNewApplication: async ({ proposalID }) => {
        const postData = {
            proposal_id: `${proposalID}`,
        };

        try {
            const response = await fetch(ApplicationsAPIURL, {
                method: 'POST',
                body: JSON.stringify(postData),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

            if (!response.ok) {
                console.error('[FRONTEND ERROR] submitting application', response.statusText);
                throw new Error(response.statusText);
            }

            // This API returns nothing so response.json() fails
            //const data = await response.json();
            //console.log('Application submitted successfully:', data);
            return "ok";
        } catch (error) {
            console.error('[FRONTEND ERROR]: in application button', error);
            throw error;
        }
    },

    acceptOrRejectApplication: async (applicationStatus, application_id) => {
        const putData = {
            application_id: `${application_id}`,
            status: `${applicationStatus}`
        }

        try {
            const response = await fetch(ApplicationsAPIURL, {
                method: 'PUT',
                body: JSON.stringify(putData),
                headers: { 'Content-Type': 'application/json' },
                credentials: "include"
            });

            if (response.ok) {
                const resObject = await response.json();
                return resObject.application;
            } else {
                const res = await response.json();
                throw new Error(res.error);
            }
        } catch (err) {
            throw new Error(err);
        }
    },

    getApplicationById: async(application_id) =>{
        try{
            const response = await fetch(ApplicationsAPIURL + `/application/${application_id}`, {
                method: "GET",
                headers: APIConfig.API_REQUEST_HEADERS,
                credentials: "include",
              });

            if(response.ok) {
                const resObject = await response.json();
                return resObject.application;
            }else{
                const res = await response.json();
                throw new Error(res.error);
            }
        }catch(err){
            throw new Error(err);
        }
    }




}