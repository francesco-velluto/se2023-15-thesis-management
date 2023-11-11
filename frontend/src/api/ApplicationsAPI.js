const { APICall } = require('./GenericAPI');
const APIConfig = require('./config.json');

const ApplicationsAPIURL = APIConfig.API_URL + '/applications';

/**
 * Interface for the Applications API
 * Route /api/applications
 */
module.exports = {
    // TODO: commento
    getAllApplicationsByTeacher: async () => {
        return await APICall(ApplicationsAPIURL, 'GET');
    },

}