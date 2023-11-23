"use strict";

const { getStudentById } = require("../service/students.service");
const Student = require("../model/Student");

module.exports = {
    /**
     * Get the info of a student given his id
     * 
     */
    getStudentById: async(req,res) =>{
        const student_id = req.params.student_id;
        try{
            const student = await getStudentById(student_id);
            if(student instanceof Student)
                return res.status(200).json({student});
            else
                return res.status(404).json({error: "Student not found"});

        }catch(error){

        }
    }

}