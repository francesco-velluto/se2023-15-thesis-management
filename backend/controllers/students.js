"use strict";

const { getAllApplicationsByTeacherId, getAllApplicationsByStudentId } = require("../service/applications.service");
const studentService = require("../service/students.service");

module.exports = {
  /**
   * Get the info of a student given his id
   *
   */
  getStudentById: async (req, res) => {
    const student_id = req.params.student_id;

    try {
      const { data: student } = await studentService.getStudentById(student_id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      return res.status(200).json({ student });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },

  /**
   * Get the career of a student given his id
   *
   */
  getStudentCareer: async (req, res) => {
    const student_id = req.params.student_id;

    try {
      const { data: student } = await studentService.getStudentById(student_id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      // TODO: only teacher supervisor of a proposal for which the student applied can see his career

      const { data: career } = await studentService.getStudentCareer(student_id);

      return res.status(200).json({ career });
    } catch (error) {
      return res.status(500).json({ error });
    }
  },
};
