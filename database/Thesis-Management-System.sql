--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-2)
-- Dumped by pg_dump version 16.0 (Debian 16.0-2)


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE "Thesis-Management-System";

--
-- TOC entry 3380 (class 1262 OID 16771)
-- Name: Theis-Management-System; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "Thesis-Management-System" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'it_IT.UTF-8';

ALTER DATABASE "Thesis-Management-System" OWNER TO postgres;

\connect -reuse-previous=on "dbname='Thesis-Management-System'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;

ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;


--
-- Name: Degrees; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.degree (
    cod_degree VARCHAR(10) PRIMARY KEY,
    title_degree VARCHAR(50) NOT NULL
);

INSERT INTO public.degree (cod_degree, title_degree) VALUES
  ('BSC001', 'Bachelor of Science'),
  ('BSC002', 'Bachelor of Arts'),
  ('MSC001', 'Master of Science'),
  ('MSC002', 'Master of Arts'),
  ('PHD001', 'Doctor of Philosophy'),
  ('PHD002', 'Doctor of Education'),
  ('BSC003', 'Bachelor of Business'),
  ('MSC003', 'Master of Engineering'),
  ('BSC004', 'Bachelor of Nursing'),
  ('MSC004', 'Master of Public Health');

ALTER TABLE public.degree OWNER TO postgres;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.student (
    id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender CHAR(1),
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_degree VARCHAR(10),
    enrollment_year INT
);

INSERT INTO public.student (id, surname, name, gender, nationality, email, cod_degree, enrollment_year) VALUES
  ('S001', 'Smith', 'John', 'M', 'USA', 'john.smith@example.com', 'BSC001', 2021),
  ('S002', 'Johnson', 'Emily', 'F', 'Canada', 'emily.johnson@example.com', 'BSC001', 2022),
  ('S003', 'Lee', 'David', 'M', 'Australia', 'david.lee@example.com', 'MSC001', 2020),
  ('S004', 'Garcia', 'Maria', 'F', 'Spain', 'maria.garcia@example.com', 'MSC001', 2021),
  ('S005', 'Chen', 'Wei', 'M', 'China', 'wei.chen@example.com', 'BSC002', 2022),
  ('S006', 'Kim', 'Jiyoung', 'F', 'South Korea', 'jiyoung.kim@example.com', 'BSC002', 2021),
  ('S007', 'Brown', 'Michael', 'M', 'UK', 'michael.brown@example.com', 'MSC002', 2022),
  ('S008', 'Nguyen', 'Linh', 'F', 'Vietnam', 'linh.nguyen@example.com', 'MSC002', 2020),
  ('S009', 'Martinez', 'Carlos', 'M', 'Mexico', 'carlos.martinez@example.com', 'PHD001', 2021),
  ('S010', 'Wang', 'Xiaoyun', 'F', 'China', 'xiaoyun.wang@example.com', 'PHD001', 2020);

ALTER TABLE public.student OWNER TO postgres;

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


--
-- Name: Teachers; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.teacher (
    id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_group VARCHAR(10),
    cod_department VARCHAR(10)
);

INSERT INTO public.teacher (id, surname, name, email, cod_group, cod_department) VALUES
  ('T001', 'Anderson', 'Sarah', 'sarah.anderson@example.com', 'G001', 'D001'),
  ('T002', 'Wilson', 'Michael', 'michael.wilson@example.com', 'G002', 'D002'),
  ('T003', 'Gomez', 'Ana', 'ana.gomez@example.com', 'G001', 'D001'),
  ('T004', 'Li', 'Chen', 'chen.li@example.com', 'G002', 'D002'),
  ('T005', 'Johnson', 'Robert', 'robert.johnson@example.com', 'G003', 'D003'),
  ('T006', 'Kim', 'Minho', 'minho.kim@example.com', 'G001', 'D001'),
  ('T007', 'Brown', 'Linda', 'linda.brown@example.com', 'G003', 'D003'),
  ('T008', 'Wang', 'Xiaojie', 'xiaojie.wang@example.com', 'G004', 'D004'),
  ('T009', 'Garcia', 'Carlos', 'carlos.garcia@example.com', 'G004', 'D004'),
  ('T010', 'Chen', 'Yun', 'yun.chen@example.com', 'G003', 'D003');


ALTER TABLE public.teacher OWNER TO postgres;


--
-- Name: Careers; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.career (
    id VARCHAR(10) NOT NULL,
    cod_course VARCHAR(10) NOT NULL,
    title_course VARCHAR(50) NOT NULL,
    cfu INT NOT NULL,
    grade INT NOT NULL,
    date DATE NOT NULL,
    PRIMARY KEY (id, cod_course)
);

INSERT INTO public.career (id, cod_course, title_course, cfu, grade, date) VALUES
  ('S001', 'CRS001', 'Computer Science 101', 6, 27, '2022-05-15'),
  ('S001', 'CRS002', 'Mathematics Basics', 10, 30, '2022-06-20'),
  ('S002', 'CRS003', 'Physics Fundamentals', 10, 18, '2022-07-10'),
  ('S003', 'CRS004', 'History of Art', 6, 23, '2022-08-05'),
  ('S002', 'CRS005', 'Introduction to Marketing', 6, 25, '2022-09-12'),
  ('S001', 'CRS006', 'Advanced Robotics', 8, 21, '2022-10-18'),
  ('S004', 'CRS007', 'Environmental Science', 6, 29, '2022-11-25'),
  ('S003', 'CRS008', 'Literature Appreciation', 6, 26, '2022-12-30'),
  ('S002', 'CRS009', 'Financial Management', 8, 19, '2023-01-15'),
  ('S004', 'CRS010', 'Machine Learning for Beginners', 8, 21, '2023-02-20');


ALTER TABLE public.career OWNER TO postgres;

ALTER TABLE ONLY public.career
  ADD CONSTRAINT career_fk_student FOREIGN KEY (id) REFERENCES public.student(id);

--
-- Name: Proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposals (
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
    programmes TEXT[],
    archived BOOLEAN
);

INSERT INTO public.proposals (proposal_id, title, supervisor_id, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, programmes, archived) VALUES
  ('P001', 'Web Development', 'T001', ARRAY['Web', 'Development'], 'Theoretical', ARRAY['Group A'], 'A web development project description.', 'HTML, CSS, JavaScript', 'No special notes.', '2023-12-31', 'Bachelor', ARRAY['BSC001'], false),
  ('P002', 'Machine Learning', 'T002', ARRAY['Machine Learning', 'AI'], 'Research', ARRAY['Group B'], 'A machine learning thesis description.', 'Python, TensorFlow', 'N/A', '2024-06-30', 'Master', ARRAY['MSC001', 'MSC002'], false),
  ('P003', 'Artificial Intelligence', 'T003', ARRAY['AI', 'Machine Learning'], 'Experimental', ARRAY['Group A'], 'An AI research thesis description.', 'Python, TensorFlow', 'N/A', '2024-05-15', 'Master', ARRAY['MSC001'], false),
  ('P004', 'Environmental Impact Analysis', 'T004', ARRAY['Environmental Science', 'Experimental'], 'Research', ARRAY['Group B'], 'An environmental impact analysis thesis description.', 'Environmental Science knowledge', 'N/A', '2023-11-30', 'Master', ARRAY['MSC001'], false),
  ('P005', 'Marketing Strategies', 'T005', ARRAY['Marketing', 'Strategies'], 'Theoretical', ARRAY['Group C'], 'A marketing strategies thesis description.', 'Marketing fundamentals', 'N/A', '2023-10-20', 'Bachelor', ARRAY['BSC001'], false),
  ('P006', 'Robotics and Automation', 'T006', ARRAY['Robotics', 'Automation'], 'Research', ARRAY['Group A'], 'A robotics and automation thesis description.', 'Robotics knowledge', 'N/A', '2024-02-28', 'Master', ARRAY['MSC003'], false),
  ('P007', 'Climate Change Impact', 'T007', ARRAY['Climate Change', 'Impact'], 'Experimental', ARRAY['Group B'], 'A thesis on climate change impact analysis.', 'Environmental Science knowledge', 'N/A', '2024-03-15', 'Master', ARRAY['MSC002'], false),
  ('P008', 'Literary Analysis', 'T008', ARRAY['Literature', 'Analysis'], 'Theoretical', ARRAY['Group D'], 'A literary analysis thesis description.', 'Literary analysis skills', 'N/A', '2023-11-10', 'Master', ARRAY['MSC001'], false),
  ('P009', 'Financial Risk Management', 'T009', ARRAY['Financial', 'Risk Management'], 'Theoretical', ARRAY['Group C'], 'A thesis on financial risk management.', 'Finance knowledge', 'N/A', '2024-04-10', 'Master', ARRAY['MSC002'], false),
  ('P010', 'Introduction to Machine Learning', 'T010', ARRAY['Machine Learning', 'AI'], 'Research', ARRAY['Group A'], 'An introductory thesis on machine learning.', 'Basic AI knowledge', 'N/A', '2023-09-30', 'Bachelor', ARRAY['BSC001'], false),
  ('P011', 'Software Engineering', 'T001', ARRAY['Software Engineering', 'Development'], 'Theoretical', ARRAY['Group A'], 'A software engineering project description.', 'Java, Python, Git', 'N/A', '2023-08-25', 'Bachelor', ARRAY['BSC001'], false),
  ('P012', 'Data Analysis', 'T002', ARRAY['Data Analysis', 'Statistics'], 'Research', ARRAY['Group B'], 'A data analysis thesis description.', 'R, Python, Statistics', 'N/A', '2024-01-15', 'Master', ARRAY['MSC001', 'MSC002'], false),
  ('P013', 'Human-Computer Interaction', 'T003', ARRAY['HCI', 'User Experience'], 'Experimental', ARRAY['Group A'], 'A thesis on human-computer interaction.', 'UI/UX design, Psychology', 'N/A', '2023-12-10', 'Master', ARRAY['MSC001'], false),
  ('P014', 'Supply Chain Management', 'T001', ARRAY['Supply Chain', 'Management'], 'Theoretical', ARRAY['Group C'], 'A thesis on supply chain management.', 'Logistics, Operations', 'N/A', '2024-03-05', 'Master', ARRAY['MSC001'], false),
  ('P015', 'Mobile App Development', 'T002', ARRAY['Mobile App', 'Development'], 'Research', ARRAY['Group A'], 'A mobile app development project description.', 'Swift, Kotlin, React Native', 'N/A', '2024-02-20', 'Bachelor', ARRAY['BSC001'], false),
  ('P016', 'Neural Networks', 'T003', ARRAY['Neural Networks', 'Deep Learning'], 'Research', ARRAY['Group B'], 'A thesis on neural networks and deep learning.', 'Python, TensorFlow, Keras', 'N/A', '2023-11-25', 'Bachelor', ARRAY['BSC001'], false),
  ('P017', 'Digital Marketing', 'T001', ARRAY['Digital Marketing', 'Social Media'], 'Theoretical', ARRAY['Group C'], 'A thesis on digital marketing strategies.', 'Marketing, Social Media', 'N/A', '2024-04-30', 'Bachelor', ARRAY['BSC001'], false),
  ('P018', 'Cybersecurity', 'T002', ARRAY['Cybersecurity', 'Network Security'], 'Research', ARRAY['Group A'], 'A thesis on cybersecurity and network security.', 'Cybersecurity, Encryption', 'N/A', '2023-10-15', 'Bachelor', ARRAY['BSC001'], false),
  ('P019', 'Bioinformatics', 'T003', ARRAY['Bioinformatics', 'Computational Biology'], 'Research', ARRAY['Group B'], 'A bioinformatics research thesis description.', 'Python, Biology, Genetics', 'N/A', '2024-05-20', 'Bachelor', ARRAY['BSC001'], false),
  ('P020', 'Project Management', 'T001', ARRAY['Project Management', 'Agile'], 'Theoretical', ARRAY['Group D'], 'A thesis on project management methodologies.', 'Agile, Scrum', 'N/A', '2023-09-15', 'Bachelor', ARRAY['BSC001'], false),
  ('P021', 'Database Design', 'T002', ARRAY['Database Design', 'SQL'], 'Theoretical', ARRAY['Group A'], 'A thesis on database design and SQL.', 'Database Management, SQL', 'N/A', '2024-06-15', 'Bachelor', ARRAY['BSC001'], false),
  ('P022', 'Renewable Energy', 'T003', ARRAY['Renewable Energy', 'Sustainability'], 'Research', ARRAY['Group B'], 'A thesis on renewable energy and sustainability.', 'Environmental Science, Renewable Energy', 'N/A', '2024-02-10', 'Bachelor', ARRAY['BSC001'], false),
  ('P023', 'E-commerce Strategies', 'T001', ARRAY['E-commerce', 'Strategies'], 'Theoretical', ARRAY['Group C'], 'A thesis on e-commerce strategies and online business.', 'E-commerce, Marketing', 'N/A', '2023-11-05', 'Bachelor', ARRAY['BSC001'], false),
  ('P024', 'Natural Language Processing', 'T002', ARRAY['NLP', 'Language Processing'], 'Research', ARRAY['Group A'], 'A thesis on natural language processing and language analysis.', 'Python, NLP', 'N/A', '2024-03-20', 'Bachelor', ARRAY['BSC001'], false),
  ('P025', 'Global Marketing Trends', 'T003', ARRAY['Global Marketing', 'Trends'], 'Theoretical', ARRAY['Group D'], 'A thesis on global marketing trends and consumer behavior.', 'Marketing, Consumer Behavior', 'N/A', '2023-10-30', 'Bachelor', ARRAY['BSC001'], false);

ALTER TABLE public.proposals OWNER TO postgres;

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_fk_teacher FOREIGN KEY (supervisor_id) REFERENCES public.teacher(id);

--
-- Name: Applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id SERIAL PRIMARY KEY,
    proposal_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    status VARCHAR(255) NOT NULL, 
    application_date DATE NOT NULL
);

INSERT INTO public.applications (proposal_id, student_id, status, application_date) VALUES
  ('P001', 'S001', 'Pending', '2023-11-01'),
  ('P002', 'S002', 'Accepted', '2023-10-15'),
  ('P003', 'S003', 'Pending', '2023-11-05'),
  ('P004', 'S004', 'Accepted', '2023-10-25'),
  ('P005', 'S005', 'Pending', '2023-11-08'),
  ('P006', 'S006', 'Accepted', '2023-10-12'),
  ('P007', 'S007', 'Pending', '2023-11-15'),
  ('P008', 'S008', 'Accepted', '2023-10-10'),
  ('P009', 'S009', 'Pending', '2023-11-18'),
  ('P010', 'S010', 'Accepted', '2023-10-05');

ALTER TABLE public.applications OWNER TO postgres;

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_proposals FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id);

--
-- PostgreSQL database dump complete
--

