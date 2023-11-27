"use strict";

const { getStudentById } = require("../service/students.service");

module.exports = {
  /**
   * Get the info of a student given his id
   *
   */
  getStudentById: async (req, res) => {
    const student_id = req.params.student_id;
    
    try {
      const { data: student } = await getStudentById(student_id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json({ student });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
