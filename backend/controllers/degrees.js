"use strict";

const { getDegrees } = require("../service/degrees.service");

module.exports = {
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
