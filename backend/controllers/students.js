"use strict";

const studentService = require("../service/students.service");

/*** Upload an image file ***/

var multer = require('multer');
const path = require('path');
var fs = require('fs');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      try {  
          if (!req.user.id) {
              throw new Error('Missing required information, cannot upload file');
          }
          const filename = `Resume_${req.user.id}.pdf`;
  
          cb(null, filename);
      } catch (error) {
          console.error(error);
          cb(error);
      }
  }  
});
var upload = multer({ 
        storage: storage,
        fileFilter: function (req, file, cb) {
            const allowedFormats = 'application/pdf';
            if (file.mimetype == allowedFormats) {
                cb(null, true);
            } else {
                cb(new Error('Invalid file format. Only PDF  are allowed.'), false);
            }
        }
    });


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


  addResumeHandler: async (req, res) => {
    //chekc if there is already a resume for the student
    const isResume = await studentService.getCurrentResume(req.user.id);

    if (isResume.success === false) {
      upload.single('file')(req, res, function (err) {
        if (err) {
          console.error("[BACKEND-ERROR] Error in addResumeHandler: cannot upload to the server \n" + err);
          return res.status(500).json({ error: "Internal Server Error" });
        }

        const filename = req.file.filename;
        const date = new Date().toISOString().slice(0, 10);

        studentService.addResume(req.user.id, filename, date)
          .then(function (response) {
            res.status(201).json({ response });
          })
          .catch(function (err) {
            res.status(500).json({err});
          });
      });
    }
    else {
      res.status(400).json({ message: "You must delete this resume first" });

    }
  },
  
  getStudentResume: async (req, res) => {  
    try {
      const { success, data } = await studentService.getCurrentResume(req.user.id);
  
      if (success === true) {
        const filePath = path.join(__dirname, '..', 'uploads', data.filename);
  
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename=${data.filename}`);
          if (res.headersSent) {
            console.warn("Response headers already sent. Exiting.");
            return;
          }
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
        } else {
          res.status(404).json({ error: 'File not found' });
        }
      } else {
        res.status(404).json({ error: 'Resume not found for the specified student' });
      }
    } catch (error) {
      console.error("[BACKEND-SERVER] Error in getStudentResume", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },  

  getStudentResumeInfo: async (req, res) => { 
    try {
      const { success, data } = await studentService.getCurrentResume(req.user.id);
      if (success === true ) {
        res.status(200).json({ data });
      }
      else { res.status(500).json({ error: "Internal server error" });    }
    } catch (error) {
      console.error("[BACKEND-SERVER] Error in getStudentResumeInfo", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

};
