const service = require("../../service/authentication");
const db = require("../../service/db");
const Student = require("../../model/Student");
const Teacher = require("../../model/Teacher");


jest.mock("../../service/db", () => ({
  query: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "info").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

});

describe("T1 - getUserById", () => {
    test("T1.1.1 SUCESS 200 | Get user student by its id ", async () => {
      const id = "S008"

      db.query.mockResolvedValue({
        rows: [{
            id: id,
            surname: "Surname",
            name: "Name",
            gender:"F",
            nationality:"French",
            email:"student@example.com",
            cod_degree:'MS001',
            enrollment_year:"2018"
        },]
      });

      const student = new Student(id, "Surname","Name","F","French","student@example.com",'MS001',"2018");
    
      let res = await service.getUserById(id);
        expect(res).toEqual(student);
        expect(db.query).toHaveBeenCalled();

    });
    test("T1.1.2 SUCESS 200 | Get user teacher by its id ", async () => {
        const id = "T008"
  
        db.query.mockResolvedValueOnce({
          rows: []
        });
        db.query.mockResolvedValueOnce({
            rows: [{
                id: id,
                surname: "Surname",
                name: "Name",
                email:"teacher@example.com",
                cod_group:'G001',
                cod_department:'D001'
            },]
          });
          db.query.mockResolvedValueOnce({
            rows: [{
                title_group:"Groupe1"
            },]
          });
  
        const teacher = new Teacher(id, "Surname","Name","teacher@example.com",'Groupe1',"D001");
      
        let res = await service.getUserById(id);
          expect(res).toEqual(teacher);
          expect(db.query).toHaveBeenCalledTimes(3);
  
      });
      test("T1.2 ERROR", (done) =>{

        db.query.mockRejectedValueOnce(new Error("Database error"));

        service.getUserById(undefined)
        .catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Database error");
            done();
        });


      });

});

describe("T1 - getUserByEmail", () => {
    test("T1.1.1 SUCESS 200 | Get user student by its email ", async () => {
      const id = "S008"

      db.query.mockResolvedValue({
        rows: [{
            id: id,
            surname: "Surname",
            name: "Name",
            gender:"F",
            nationality:"French",
            email:"student@example.com",
            cod_degree:'MS001',
            enrollment_year:"2018"
        },]
      });

      const student = new Student(id, "Surname","Name","F","French","student@example.com",'MS001',"2018");
    
      let res = await service.getUserByEmail(id);
        expect(res).toEqual(student);
        expect(db.query).toHaveBeenCalled();

    });
    test("T1.1.2 SUCESS 200 | Get user teacher by its email ", async () => {
        const id = "T008"
  
        db.query.mockResolvedValueOnce({
          rows: []
        });
        db.query.mockResolvedValueOnce({
            rows: [{
                id: id,
                surname: "Surname",
                name: "Name",
                email:"teacher@example.com",
                cod_group:'G001',
                cod_department:'D001'
            },]
          });

  
        const teacher = new Teacher(id, "Surname","Name","teacher@example.com",'G001',"D001");
      
        let res = await service.getUserByEmail(id);
          expect(res).toEqual(teacher);
          expect(db.query).toHaveBeenCalledTimes(2);
  
      });
      test("T1.2 ERROR", (done) =>{

        db.query.mockRejectedValueOnce(new Error("Database error"));

        service.getUserByEmail(undefined)
        .catch((error) => {
            expect(error).toBeInstanceOf(Error);
            expect(error.message).toBe("Database error");
            done();
        });


      });

});