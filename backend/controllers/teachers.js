"use strict";

const { getTeachers } = require("../service/teachers.service");

module.exports = {
  getTeachers: async (req, res) => {
    // TO-DO: check auth
    try {
      const teachers = await getTeachers();
      res.status(200).json({ teachers });
    } catch (err) {
      console.error("[BACKEND-SERVER] Cannot get teachers", err);
      res.status(500).json({ error: "Internal server error has occurred" });
    }
  },
};
