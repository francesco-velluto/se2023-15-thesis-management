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
        
}