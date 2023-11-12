module.exports = {
  createProposalsTableQuery: `CREATE TABLE public.proposals (
    proposal_id VARCHAR(10) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    supervisor_id VARCHAR(10),
    keywords TEXT[],
    type VARCHAR(255),
    groups TEXT[],
    description TEXT,
    required_knowledge TEXT,
    notes TEXT,
    expiration_date DATE,
    level VARCHAR(30),
    programmes TEXT[]);`,

  populateProposalsTableQuery: `INSERT INTO public.proposals (proposal_id, title, supervisor_id, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, programmes) VALUES
    ('P001', 'Web Development', 'T001', ARRAY['Web', 'Development'], 'Bachelor', ARRAY['Group A'], 'A web development project description.', 'HTML, CSS, JavaScript', 'No special notes.', '2023-12-31', 'Undergraduate', ARRAY['CD001']),
    ('P002', 'Machine Learning', 'T002', ARRAY['Machine Learning', 'AI'], 'Master', ARRAY['Group B'], 'A machine learning thesis description.', 'Python, TensorFlow', 'N/A', '2024-06-30', 'Graduate', ARRAY['CD002']);`,

  createTeacherTableQuery: `CREATE TABLE public.teacher (
    id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_group VARCHAR(10),
    cod_department VARCHAR(10));`,

  populateTeacherTableQuery: `INSERT INTO public.teacher (id, surname, name, email, cod_group, cod_department) VALUES
    ('T001', 'Anderson', 'Sarah', 'sarah.anderson@example.com', 'G001', 'D001'),
    ('T002', 'Wilson', 'Michael', 'michael.wilson@example.com', 'G002', 'D002');`,

  createStudentTableQuery: `CREATE TABLE public.student (
    id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender CHAR(1),
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_degree VARCHAR(10),
    enrollment_year INT);`,

  populateStudentTableQuery: `INSERT INTO public.student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES
    ('S001', 'Smith', 'John', 'M', 'USA', 'john.smith@example.com', 'BSC001', 2021),
    ('S002', 'Johnson', 'Emily', 'F', 'Canada', 'emily.johnson@example.com', 'BSC001', 2022);`,
};
