module.exports = {
    API_URL: 'http://localhost:' + process.env.REACT_APP_BACKEND_SERVER_PORT + '/api',
    API_REQUEST_HEADERS: {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
}