"use strict";

module.exports = {
    /**
     * Login a user
     *
     * @params: none
     * @body: { username: string, password: string }
     * @returns: { token: string }
     * @error: 400 Bad Request - if username or password are not present
     * @error: 401 Unauthorized - if username or password are not valid
     * @error: 500 Internal Server Error - if something went wrong
     */
    login: (req, res) => {
        // TODO - this is an example made for tests purposes only, change it
        const { username, password } = req.body;

        try {
            if (!username || !password) {
                res.status(400).json({ error: "Missing username or password" });
            } else if (username !== "username" || password !== "password") {
                res.status(401).json({ error: "Wrong username or password" });
            } else {
                res.status(200).json({ token: "token" });
            }
        } catch (err) {
            console.error("[BACKEND-SERVER] Cannot login user", err);
            res.status(500).json({ error: "Internal server error has occurred" });
        }
    }
}