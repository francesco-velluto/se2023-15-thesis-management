const service = require("../../service/authentication");
const db = require("../../service/db");
const Student = require("../../model/Student");
const Teacher = require("../../model/Teacher");
const { getUserByEmail, getUserById } = require("../../service/authentication");

jest.mock("../../service/db", () => ({
  query: jest.fn(),
}));


beforeEach(() => {
  jest.resetAllMocks();
  // comment these lines if you want to see console prints during tests
  jest.spyOn(console, "log").mockImplementation(() => { });
  jest.spyOn(console, "info").mockImplementation(() => { });
  jest.spyOn(console, "error").mockImplementation(() => { });

});

describe("T1 - getUserById", () => {
  test("T1.1 SUCESS 200 | Get user student by its id ", async () => {
    const id = "S008"

    db.query.mockResolvedValue({
      rows: [{
        id: id,
        surname: "Surname",
        name: "Name",
        gender: "F",
        nationality: "French",
        email: "student@example.com",
        cod_degree: 'MS001',
        enrollment_year: "2018"
      },]
    });

    const student = new Student(id, "Surname", "Name", "F", "French", "student@example.com", 'MS001', "2018");

    let res = await service.getUserById(id);
    expect(res).toEqual(student);
    expect(db.query).toHaveBeenCalled();

  });
  test("T1.2 SUCESS 200 | Get user teacher by its id ", async () => {
    const id = "T008"

    db.query.mockResolvedValueOnce({
      rows: []
    });
    db.query.mockResolvedValueOnce({
      rows: [{
        id: id,
        surname: "Surname",
        name: "Name",
        email: "teacher@example.com",
        cod_group: 'G001',
        cod_department: 'D001'
      },]
    });
    db.query.mockResolvedValueOnce({
      rows: [{
        title_group: "Groupe1"
      },]
    });

    const teacher = new Teacher(id, "Surname", "Name", "teacher@example.com", 'Groupe1', "D001");

    let res = await service.getUserById(id);
    expect(res).toEqual(teacher);
    expect(db.query).toHaveBeenCalledTimes(3);

  });
  test("T1.3 ERROR", (done) => {

    db.query.mockRejectedValueOnce(new Error("Database error"));

    service.getUserById(undefined)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        done();
      });


  });

});

describe("T2 - getUserByEmail", () => {
  test("T2.1 SUCESS 200 | Get user student by its email ", async () => {
    const id = "S008"

    db.query.mockResolvedValue({
      rows: [{
        id: id,
        surname: "Surname",
        name: "Name",
        gender: "F",
        nationality: "French",
        email: "student@example.com",
        cod_degree: 'MS001',
        enrollment_year: "2018"
      },]
    });

    const student = new Student(id, "Surname", "Name", "F", "French", "student@example.com", 'MS001', "2018");

    let res = await service.getUserByEmail(id);
    expect(res).toEqual(student);
    expect(db.query).toHaveBeenCalled();

  });
  test("T2.2 SUCESS 200 | Get user teacher by its email ", async () => {
    const id = "T008"

    db.query.mockResolvedValueOnce({
      rows: []
    });
    db.query.mockResolvedValueOnce({
      rows: [{
        id: id,
        surname: "Surname",
        name: "Name",
        email: "teacher@example.com",
        cod_group: 'G001',
        cod_department: 'D001'
      },]
    });


    const teacher = new Teacher(id, "Surname", "Name", "teacher@example.com", 'G001', "D001");

    let res = await service.getUserByEmail(id);
    expect(res).toEqual(teacher);
    expect(db.query).toHaveBeenCalledTimes(2);

  });
  test("T2.3 ERROR", (done) => {

    db.query.mockRejectedValueOnce(new Error("Database error"));

    service.getUserByEmail(undefined)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        done();
      });


  });

});

describe("T3 - getUser", () => {
  const idStudent = "S001";
  const emailStudent = "john.smith@example.com";
  const userStudent = {
    id: idStudent,
    surname: "Surname",
    name: "Name",
    gender: "M",
    nationality: "Italy",
    email: emailStudent,
    cod_degree: 'MS001',
    enrollment_year: "2022"
  };

  const idTeacher = "T001";
  const emailTeacher = "michael.wilson@example.com";
  const userTeacher = {
    id: idTeacher,
    surname: "Surname",
    name: "Name",
    email: emailTeacher,
    cod_group: 'G001',
    cod_department: 'D001'
  };

  test("T3.1 SUCESS | Get user student by its email ", (done) => {
    const student = new Student(userStudent.id, userStudent.surname, userStudent.name, userStudent.gender, userStudent.nationality, userStudent.email, userStudent.cod_degree, userStudent.enrollment_year);

    jest.spyOn(service, 'getUserByEmail').mockImplementation(async (email) => {
      expect(email).toBe(emailStudent);
      return student;
    });

    jest.spyOn(service, 'getUserById').mockRejectedValue();

    service.getUser(emailStudent)
      .then((result) => {
        expect(result).toEqual(student);
        expect(service.getUserByEmail).toHaveBeenCalled();
        expect(service.getUserById).not.toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T3.2 SUCESS | Get user student by its id ", (done) => {
    const student = new Student(userStudent.id, userStudent.surname, userStudent.name, userStudent.gender, userStudent.nationality, userStudent.email, userStudent.cod_degree, userStudent.enrollment_year);

    jest.spyOn(service, 'getUserByEmail').mockRejectedValue();

    jest.spyOn(service, 'getUserById').mockImplementation(async (id) => {
      expect(id).toBe(idStudent);
      return student;
    });

    service.getUser(idStudent)
      .then((result) => {
        expect(result).toEqual(student);
        expect(service.getUserByEmail).toHaveBeenCalled();
        expect(service.getUserById).toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T3.3 SUCESS | Get user teacher by its email ", (done) => {
    const teacher = new Teacher(userTeacher.id, userTeacher.surname, userTeacher.name, userTeacher.email, userTeacher.cod_group, userTeacher.cod_department);

    jest.spyOn(service, 'getUserByEmail').mockImplementation(async (email) => {
      expect(email).toBe(emailTeacher);
      return teacher;
    });

    jest.spyOn(service, 'getUserById').mockRejectedValue();

    service.getUser(emailTeacher)
      .then((result) => {
        expect(result).toEqual(teacher);
        expect(service.getUserByEmail).toHaveBeenCalled();
        expect(service.getUserById).not.toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T3.4 SUCESS | Get user teacher by its id", (done) => {
    const teacher = new Teacher(userTeacher.id, userTeacher.surname, userTeacher.name, userTeacher.email, userTeacher.cod_group, userTeacher.cod_department);

    jest.spyOn(service, 'getUserByEmail').mockRejectedValue();

    jest.spyOn(service, 'getUserById').mockImplementation(async (id) => {
      expect(id).toBe(idTeacher);
      return teacher;
    });

    service.getUser(idTeacher)
      .then((result) => {
        expect(result).toEqual(teacher);
        expect(service.getUserByEmail).toHaveBeenCalled();
        expect(service.getUserById).toHaveBeenCalled();
        done();
      })
      .catch((error) => done(error));
  });

  test("T3.5 ERROR  | Get an error by getUserByEmail", (done) => {
    jest.spyOn(service, 'getUserByEmail').mockRejectedValue(new Error("Database error"));

    service.getUser(undefined)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        done();
      });
  });

  test("T3.6 ERROR  | Get an error by getUserById", (done) => {
    jest.spyOn(service, 'getUserByEmail').mockResolvedValue(undefined);
    jest.spyOn(service, 'getUserById').mockRejectedValue(new Error("Database error"));

    service.getUser(undefined)
      .catch((error) => {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe("Database error");
        done();
      });
  });
});

describe("T4 - authUser", () => {
  const idStudent = "S001";
  const emailStudent = "john.smith@example.com";
  const userStudent = {
    id: idStudent,
    surname: "Surname",
    name: "Name",
    gender: "M",
    nationality: "Italy",
    email: emailStudent,
    cod_degree: 'MS001',
    enrollment_year: "2022"
  };

  const idTeacher = "T001";
  const emailTeacher = "michael.wilson@example.com";
  const userTeacher = {
    id: idTeacher,
    surname: "Surname",
    name: "Name",
    email: emailTeacher,
    cod_group: 'G001',
    cod_department: 'D001'
  };
  const student = new Student(userStudent.id, userStudent.surname, userStudent.name, userStudent.gender, userStudent.nationality, userStudent.email, userStudent.cod_degree, userStudent.enrollment_year);
  const teacher = new Teacher(userTeacher.id, userTeacher.surname, userTeacher.name, userTeacher.email, userTeacher.cod_group, userTeacher.cod_department);


  test("T4.1 SUCCESS | Should authenticate a student successfully", (done) => {
    db.query.mockResolvedValue({ rows: [userStudent] });

    service.authUser(emailStudent, idStudent)
      .then((result) => {
        expect(result).toEqual(student);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            userStudent.email,
            userStudent.id
          ])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test('T4.2 SUCCESS | Should authenticate a teacher successfully', (done) => {
    db.query.mockResolvedValueOnce({ rows: [] }); // Simulate no student found
    db.query.mockResolvedValueOnce({
      rows: [userTeacher],
    });

    service.authUser(emailTeacher, idTeacher)
      .then((result) => {
        expect(result).toEqual(teacher);
        expect(db.query).toHaveBeenCalledWith(
          expect.any(String),
          expect.arrayContaining([
            userTeacher.email,
            userTeacher.id
          ])
        );
        done();
      })
      .catch((error) => done(error));
  });

  test('T4.3 SUCCESS | Should return null for unknown user', async () => {
    db.query.mockResolvedValueOnce({rows: []});
    db.query.mockResolvedValueOnce({rows: []});

    const result = await service.authUser(emailStudent, idStudent);

    expect(result).toEqual(undefined);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM student WHERE email = $1 and id = $2;', [emailStudent, idStudent]);
    expect(db.query).toHaveBeenCalledWith('SELECT * FROM teacher WHERE email = $1 and id = $2;', [emailStudent, idStudent]);
  });

  test('T4.4 ERROR   | Should throw an error when there is an issue with the database query', (done) => {
    const message = 'Database error';
    db.query.mockRejectedValue(new Error(message));

    service.authUser(emailStudent, idStudent)
    .catch((error) => {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(message);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM student WHERE email = $1 and id = $2;', [emailStudent, idStudent]);
      done();
    });
  });
});