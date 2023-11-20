require('dotenv').config({ path: '../../../.env' });

module.exports = {
    API_URL: 'http://localhost:' + process.env.BACKEND_SERVER_PORT + '/api',
    API_REQUEST_HEADERS: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}