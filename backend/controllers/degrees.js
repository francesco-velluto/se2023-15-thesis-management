"use strict";

const { getDegrees } = require("../service/degrees.service");

module.exports = {
  /**
   * Get the list of all degrees
   *
   * @param {Object} req HTTP Request Object
   * @param {Object} res HTTP Response Object
   * response body contains an array of degrees
   *
   * @error 500 - Internal Server Error
   *
   * See official documentation for more details
   */
  getDegrees: async (req, res) => {
    try {
      const degrees = await getDegrees();
      res.status(200).json({ degrees });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot get degrees", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },
};
