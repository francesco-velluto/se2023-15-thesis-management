"use strict";

//! VIRTUAL_CLOCK: remove this module in production

const { getVirtualDate, updateVirtualDate } = require("../service/virtualclock.service");

module.exports = {
  /**
   * Get the current virtual date
   */
  getVirtualDate: async (req, res) => {
    try {
      const { data: virtualDate } = await getVirtualDate();
      if (!virtualDate) {
        throw Error("Error while retrieving the virtual date");
      }

      return res.status(200).json({ date: virtualDate });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  /**
   * Get the current virtual date
   */
  updateVirtualDate: async (req, res) => {
    try {
      const newDate = req.body?.date; // TODO: validation on newDate format

      const { data: virtualDate } = await updateVirtualDate(newDate);
      if (!virtualDate) {
        throw Error("Error while updating the virtual date");
      }

      return res.status(200).json({ date: virtualDate });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
