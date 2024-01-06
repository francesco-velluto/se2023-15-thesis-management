const { APICall } = require('./GenericAPI');
const APIConfig = require('./api.config.js');
const StudentsAPIURL = APIConfig.API_URL + '/students';

module.exports = {
    /**
     * GET /api/students/:student_id
     * 
     * Get all the info of a student given his id
     * 
     * @params student_id
     */

    getStudentById: async(student_id) =>{
        try{
            const response = await fetch(StudentsAPIURL + `/${student_id}`, {
                method: "GET",
                headers: APIConfig.API_REQUEST_HEADERS,
                credentials: "include",
              });

            if(response.ok) {
                const resObject = await response.json();
                return resObject.student;
            }else{
                const res = await response.json();
                throw new Error(res.error);
            }
        }catch(err){
            throw new Error(err);
        }
    }, 

    /**
     * POST /students/:student_id/resume
     * 
     * Upload a file for a student
     * 
     * @param student_id
     * @param file FormData object containing the file to upload
     */
    uploadFile: async (student_id, formData) => {
        try {
          if (!formData) {
            throw new Error('FormData is required');
          }
      
          const url = `${StudentsAPIURL}/${student_id}/resume`;
      
          const response = await fetch(url, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
              },
            body: formData,
            credentials: 'include',
          });
      
          if (response.ok) {
            try {
              const responseData = await response.json();
              return responseData; 
            } catch (error) {
              console.error('Error parsing JSON from server response:', error);
              throw new Error('Invalid response from server');
            }
          } else {
            const errorText = await response.text(); 
            console.error('Error response from server:', errorText);
            throw new Error(errorText || 'Unknown error');
          }
        } catch (err) {
          throw new Error(err.message || 'Error uploading file');
        }
      },

    
    /**
     * GET /students/:student_id/resume
     * 
     * Get the current uploaded resume of a student
     * 
     * @param student_id
     */

    fetchStudentResume: async (student_id) => {
        try {
          const response = await fetch(`${StudentsAPIURL}/${student_id}/resume`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/pdf', 
            },
            credentials: 'include',

          });
      
          if (response.ok) {
            const pdfBlob = await response.blob();
            const url = URL.createObjectURL(pdfBlob);
            return url;
          } else {
            throw new Error(`Error fetching resume: ${response.statusText}`);
          }
        } catch (error) {
          throw new Error(`Error fetching resume: ${error.message}`);
        }
      },
      
    /**
     * GET /students/:student_id/resume/info
     * 
     * Get the information of the current uploaded resume of a student
     * 
     * @param student_id
     */
    
    fetchResumeInfo: async (student_id) => {
        try {
        const response = await fetch(`${StudentsAPIURL}/${student_id}/resume/info`, {
            method: 'GET',
            headers: APIConfig.API_REQUEST_HEADERS,
            credentials: 'include',
        });
    
        if (response.ok) {
            const data = await response.json(); 
            return data;
        } else {
            throw new Error(`Error fetching resume: ${response.statusText}`);
        }
        } catch (error) {
        throw new Error(`Error fetching resume: ${error.message}`);
        }
    },
  
        
}