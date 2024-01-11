const { APICall } = require('./GenericAPI');
const APIConfig = require('./api.config.js');
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

    getAllApplicationsByProposalId: async (proposal_id) => {
        return await APICall(ApplicationsAPIURL + `/proposals/${proposal_id}`, 'GET');
    },

    getAllApplicationsByStudent: async (id) => {
        return await APICall(ApplicationsAPIURL + `/${id}`, 'GET');
    },

    insertNewApplication: async ({ proposalID }, upload_id) => {
        const postData = {
            proposal_id: `${proposalID}`,
            upload_id: upload_id
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

            return response;
        } catch (error) {
            console.error('[FRONTEND ERROR]: in application button', error);
            throw error;
        }
    },

    /**
     * PUT /api/applications/:id
     *
     * Set the status of an application relative to a proposal of the teacher.
     * The status can only be "Accepted" or "Rejected".
     * If the application is accepted, by default the other applications to the same proposal are set with status "Canceled"
     * and the relative proposal is archived.
     * Returns the application modified
     *
     * @param {string} applicationStatus
     *
     * @returns {Application}
     */

    acceptOrRejectApplication: async (applicationStatus, application_id) => {
        const putData = {
            status: `${applicationStatus}`
        }

        try {
            const response = await fetch(ApplicationsAPIURL + `/${application_id}`, {
                method: 'PUT',
                body: JSON.stringify(putData),
                headers: APIConfig.API_REQUEST_HEADERS,
                credentials: "include"
            });

            if (response.ok) {
                const resObject = await response.json();
                return resObject;
            } else {
                const res = await response.json();
                throw new Error(res.error);
            }
        } catch (err) {
            throw new Error(err);
        }
    },

    /**
     * GET api/applications/application/:application_id
     *
     * Get the application given its id.
     *
     * @param {number} application_id
     * @returns {Application}
     */

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
    },

    /**
     * POST /applications/upload
     *
     * Upload a file for a student
     *
     * @param student_id
     * @param formData FormData object containing the file to upload
     */
    uploadFile: async (student_id,formData) => {
        try {
            if (!formData) {
            throw new Error('FormData is required');
            }

            const response = await fetch(ApplicationsAPIURL + '/upload', {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                },
            body: formData,
            credentials: 'include',
            });

            if (response.ok) {
            try {
                return response.json();
            } catch (error) {
                console.error('Error parsing JSON from server response:', error);
                throw new Error('Invalid response from server');
            }
            } else {
            const errorText = await response.text();
            console.error('Error response from server:', errorText);
            throw new Error(errorText || 'Unknown error');
            }
        } catch (err) {
            throw new Error(err.message || 'Error uploading file');
        }
        },
        /**
     * GET /applications/upload/:upload_id
     *
     * Get the current uploaded file of a student
     *
     * @param student_id
     * @param upload_id
     */

    fetchUploadedFile: async ({ upload_id, application_id }) => {
        try {
            const url = `${ApplicationsAPIURL}/${upload_id ? `upload/${upload_id}` : `file/${application_id}`}`;

            const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/pdf',
            },
            credentials: 'include',
            });

            if (response.ok) {
            const pdfBlob = await response.blob();
            const url = URL.createObjectURL(pdfBlob);
            return url;
            } else {
            throw new Error(`Error fetching resume: ${response.statusText}`);
            }
        } catch (error) {
            throw new Error(error.message);
        }
        },

        /**
         * GET /applications/upload/:upload_id/info
         *
         * Get the information of the current uploaded resume of a student
         *
         * @param student_id
         */

        fetchFileInfo: async ({upload_id, application_id}) => {
            try {
                const url = `${ApplicationsAPIURL}/${upload_id ? `upload/${upload_id}/info` : `file/${application_id}/info`}`;

                const response = await fetch(url, {
                    method: 'GET',
                    headers: APIConfig.API_REQUEST_HEADERS,
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    return data;
                } else if (response.status === 404) {
                    return undefined;
                } else {
                    throw new Error(`Error fetching resume: ${response.statusText}`);
                }
            } catch (error) {
                throw new Error(`Error fetching resume: ${error.message}`);
            }
        },


};