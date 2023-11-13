"use strict";

const { getTeachers } = require("../service/teachers.service");

module.exports = {
  /**
   * Get the list of all teachers
   * 
   * @param {Object} req HTTP Request Object
   * @param {Object} res HTTP Response Object
   * response body contains an array of teachers
   * 
   * @error 500 - Internal Server Error
   * 
   * See official documentation for more details
   */
  getTeachers: async (req, res) => {
    try {
      const teachers = await getTeachers();
      res.status(200).json({ teachers });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot get teachers", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },
};
