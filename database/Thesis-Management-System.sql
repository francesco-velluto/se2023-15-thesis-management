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
-- Name: Groups; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.group (
    cod_group VARCHAR(10) PRIMARY KEY,
    title_group VARCHAR(50) NOT NULL
);

INSERT INTO public.group (cod_group, title_group) VALUES
  ('G001', 'Group 1'),
  ('G002', 'Group 2'),
  ('G003', 'Group 3'),
  ('G004', 'Group 4');

ALTER TABLE public.group OWNER TO postgres;


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
  ('S010', 'Wang', 'Xiaoyun', 'F', 'China', 'xiaoyun.wang@example.com', 'PHD001', 2020),
  ('S011', 'John', 'Martinez', 'M', 'Italy', 'studentofpolito@gmail.com', 'MSC002', 2021),
  ('S012', 'Francesco', 'Velluto', 'M', 'Italy', 's317549@studenti.polito.it', 'MSC001', 2021);

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
  ('T010', 'Chen', 'Yun', 'yun.chen@example.com', 'G003', 'D003'),
  ('T011', 'Mario', 'Rossi', 'teacherofpolito@gmail.com', 'G001', 'D001');

ALTER TABLE public.teacher OWNER TO postgres;

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_fk_group FOREIGN KEY (cod_group) REFERENCES public.group(cod_group);



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

-- Inserimenti con numero casuale di esami per gli studenti da S001 a S012

INSERT INTO public.career (id, cod_course, title_course, cfu, grade, date) VALUES
('S001', 'CRS001', 'Computer Science 101', 6, 27, '2022-05-15'),
('S001', 'CRS002', 'Mathematics Basics', 10, 30, '2022-06-20'),
('S001', 'CRS003', 'Introduction to Robotics', 8, 25, '2022-07-10'),
('S001', 'CRS004', 'Data Structures', 8, 28, '2022-08-05'),
('S001', 'CRS005', 'Algorithm Design', 8, 26, '2022-09-12'),
('S001', 'CRS006', 'Artificial Intelligence Fundamentals', 8, 29, '2022-10-18'),

('S002', 'CRS007', 'Database Management', 8, 24, '2022-11-25'),
('S002', 'CRS008', 'Software Engineering', 10, 30, '2022-12-30'),
('S002', 'CRS009', 'Cloud Computing', 8, 23, '2023-01-15'),
('S002', 'CRS010', 'Business Analytics', 8, 28, '2023-02-20'),
('S002', 'CRS011', 'Leadership Skills', 6, 27, '2023-03-10'),
('S002', 'CRS012', 'International Business', 8, 29, '2023-04-15'),

('S003', 'CRS013', 'Financial Management', 8, 19, '2023-05-20'),
('S003', 'CRS014', 'Marketing Strategy', 8, 25, '2023-06-25'),
('S003', 'CRS015', 'Human-Computer Interaction', 6, 26, '2023-07-10'),
('S003', 'CRS016', 'Project Management', 8, 28, '2023-08-05'),
('S003', 'CRS017', 'Consumer Behavior', 6, 23, '2023-09-12'),
('S003', 'CRS018', 'Digital Marketing', 8, 30, '2023-10-18'),

('S004', 'CRS019', 'Operations Management', 6, 22, '2023-11-25'),
('S004', 'CRS020', 'Cybersecurity Fundamentals', 6, 24, '2023-12-30'),
('S004', 'CRS021', 'Data Science Essentials', 8, 26, '2022-01-15'),
('S004', 'CRS022', 'Strategic Management', 8, 21, '2022-02-20'),
('S004', 'CRS023', 'Entrepreneurship', 6, 23, '2022-03-15'),
('S004', 'CRS024', 'Digital Communication', 8, 27, '2022-04-20'),

('S005', 'CRS025', 'Machine Learning Foundations', 10, 30, '2023-05-25'),
('S005', 'CRS026', 'Software Testing Techniques', 6, 25, '2023-06-30'),
('S005', 'CRS027', 'Network Security', 8, 28, '2023-07-05'),
('S005', 'CRS028', 'Mobile App Design', 8, 26, '2023-08-10'),
('S005', 'CRS029', 'Digital Ethics', 6, 24, '2023-09-15'),
('S005', 'CRS030', 'Business Intelligence', 8, 29, '2023-10-20'),

('S006', 'CRS031', 'Computer Graphics', 8, 27, '2022-11-25'),
('S006', 'CRS032', 'Web Development', 6, 23, '2022-12-30'),
('S006', 'CRS033', 'Cryptography Fundamentals', 8, 26, '2023-01-15'),
('S006', 'CRS034', 'Supply Chain Analytics', 8, 22, '2023-02-20'),
('S006', 'CRS035', 'Human Resource Management', 6, 24, '2023-03-15'),
('S006', 'CRS036', 'Data Warehousing', 8, 28, '2023-04-20'),

('S007', 'CRS037', 'Digital Sociology', 6, 22, '2023-05-25'),
('S007', 'CRS038', 'Cloud Security', 8, 26, '2023-06-30'),
('S007', 'CRS039', 'Software Project Management', 8, 24, '2023-07-05'),
('S007', 'CRS040', 'International Marketing', 6, 23, '2023-08-10'),
('S007', 'CRS041', 'Computer Networks', 8, 27, '2023-09-15'),
('S007', 'CRS042', 'Artificial Neural Networks', 8, 30, '2023-10-20'),

('S008', 'CRS043', 'E-commerce Strategies', 6, 23, '2023-11-25'),
('S008', 'CRS030', 'Business Intelligence', 8, 29, '2023-12-30'),
('S008', 'CRS045', 'IT Governance', 6, 26, '2022-01-15'),
('S008', 'CRS046', 'Quantitative Methods', 8, 25, '2022-02-20'),
('S008', 'CRS047', 'Social Media Marketing', 6, 22, '2022-03-15'),
('S008', 'CRS007', 'Advanced Database Management', 8, 28, '2022-04-20'),

('S009', 'CRS049', 'Business Process Reengineering', 8, 26, '2022-05-25'),
('S009', 'CRS050', 'Game Development', 6, 24, '2022-06-30'),
('S009', 'CRS051', 'Strategic HRM', 6, 23, '2022-07-05'),
('S009', 'CRS052', 'Web Security', 8, 27, '2022-08-10'),
('S009', 'CRS053', 'Social Entrepreneurship', 6, 22, '2022-09-15'),
('S009', 'CRS054', 'Data Mining Techniques', 8, 28, '2022-10-20'),

('S010', 'CRS055', 'Mobile App Security', 6, 23, '2022-11-25'),
('S010', 'CRS056', 'International Finance', 8, 29, '2022-12-30'),
('S010', 'CRS057', 'Digital Forensics', 8, 28, '2023-01-15'),
('S010', 'CRS058', 'Marketing Analytics', 6, 26, '2023-02-20'),
('S010', 'CRS022', 'Strategic Management', 6, 24, '2023-03-15'),
('S010', 'CRS060', 'Data Ethics', 8, 30, '2023-04-20'),

('S011', 'CRS009', 'Cloud Computing Security', 6, 25, '2023-05-25'),
('S011', 'CRS062', 'Business Law', 8, 28, '2023-06-30'),
('S011', 'CRS063', 'User Interface Design', 6, 24, '2023-07-05'),
('S011', 'CRS064', 'Financial Accounting', 8, 26, '2023-08-10'),
('S011', 'CRS065', 'Operations Research', 8, 27, '2023-09-15'),
('S011', 'CRS066', 'Innovation Management', 6, 23, '2023-10-20'),

('S012', 'CRS067', 'Information Security Management', 8, 29, '2023-11-25'),
('S012', 'CRS068', 'Marketing Research', 6, 23, '2023-12-30'),
('S012', 'CRS004', 'Data Structures', 8, 28, '2022-01-15'),
('S012', 'CRS012', 'International Business Law', 6, 22, '2022-02-20'),
('S012', 'CRS071', 'Machine Learning Applications', 8, 30, '2022-03-15'),
('S012', 'CRS072', 'Entrepreneurial Finance', 6, 26, '2022-04-20');



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
    archived BOOLEAN,
    deleted BOOLEAN
);

INSERT INTO public.proposals (proposal_id, title, supervisor_id, keywords, type, groups, description, required_knowledge, notes, expiration_date, level, programmes, archived, deleted) VALUES
  ('P001', 'Web Development', 'T002', ARRAY['Web', 'Development'], 'Theoretical', ARRAY['G001'], 'A web development project description.', 'HTML, CSS, JavaScript', 'No special notes.', '2024-12-31', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P002', 'Machine Learning', 'T002', ARRAY['Machine Learning', 'AI'], 'Research', ARRAY['G002'], 'A machine learning thesis description.', 'Python, TensorFlow', 'N/A', '2024-06-30', 'Master', ARRAY['MSC001', 'MSC002'], false, false),
  ('P003', 'Artificial Intelligence', 'T003', ARRAY['AI', 'Machine Learning'], 'Experimental', ARRAY['G001'], 'An AI research thesis description.', 'Python, TensorFlow', 'N/A', '2024-05-15', 'Master', ARRAY['MSC001'], false, false),
  ('P004', 'Environmental Impact Analysis', 'T004', ARRAY['Environmental Science', 'Experimental'], 'Research', ARRAY['G002'], 'An environmental impact analysis thesis description.', 'Environmental Science knowledge', 'N/A', '2023-11-30', 'Master', ARRAY['MSC001'], false, false),
  ('P005', 'Marketing Strategies', 'T005', ARRAY['Marketing', 'Strategies'], 'Theoretical', ARRAY['G003'], 'A marketing strategies thesis description.', 'Marketing fundamentals', 'N/A', '2023-10-20', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P006', 'Robotics and Automation', 'T006', ARRAY['Robotics', 'Automation'], 'Research', ARRAY['G001'], 'A robotics and automation thesis description.', 'Robotics knowledge', 'N/A', '2024-02-28', 'Master', ARRAY['MSC003'], false, false),
  ('P007', 'Climate Change Impact', 'T007', ARRAY['Climate Change', 'Impact'], 'Experimental', ARRAY['G002'], 'A thesis on climate change impact analysis.', 'Environmental Science knowledge', 'N/A', '2024-03-15', 'Master', ARRAY['MSC002'], false, false),
  ('P008', 'Literary Analysis', 'T008', ARRAY['Literature', 'Analysis'], 'Theoretical', ARRAY['G004'], 'A literary analysis thesis description.', 'Literary analysis skills', 'N/A', '2023-11-10', 'Master', ARRAY['MSC001'], false, false),
  ('P009', 'Financial Risk Management', 'T009', ARRAY['Financial', 'Risk Management'], 'Theoretical', ARRAY['G003'], 'A thesis on financial risk management.', 'Finance knowledge', 'N/A', '2024-04-10', 'Master', ARRAY['MSC002'], false, false),
  ('P010', 'Introduction to Machine Learning', 'T010', ARRAY['Machine Learning', 'AI'], 'Research', ARRAY['G001'], 'An introductory thesis on machine learning.', 'Basic AI knowledge', 'N/A', '2023-09-30', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P011', 'Software Engineering', 'T001', ARRAY['Software Engineering', 'Development'], 'Theoretical', ARRAY['G001'], 'A software engineering project description.', 'Java, Python, Git', 'N/A', '2023-08-25', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P012', 'Data Analysis', 'T002', ARRAY['Data Analysis', 'Statistics'], 'Research', ARRAY['G002'], 'A data analysis thesis description.', 'R, Python, Statistics', 'N/A', '2024-01-15', 'Master', ARRAY['MSC001', 'MSC002'], false, false),
  ('P013', 'Human-Computer Interaction', 'T003', ARRAY['HCI', 'User Experience'], 'Experimental', ARRAY['G001'], 'A thesis on human-computer interaction.', 'UI/UX design, Psychology', 'N/A', '2023-12-10', 'Master', ARRAY['MSC001'], false, false),
  ('P014', 'Supply Chain Management', 'T001', ARRAY['Supply Chain', 'Management'], 'Theoretical', ARRAY['G003'], 'A thesis on supply chain management.', 'Logistics, Operations', 'N/A', '2024-03-05', 'Master', ARRAY['MSC001'], false, false),
  ('P015', 'Mobile App Development', 'T002', ARRAY['Mobile App', 'Development'], 'Research', ARRAY['G001'], 'A mobile app development project description.', 'Swift, Kotlin, React Native', 'N/A', '2024-02-20', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P016', 'Neural Networks', 'T003', ARRAY['Neural Networks', 'Deep Learning'], 'Research', ARRAY['G002'], 'A thesis on neural networks and deep learning.', 'Python, TensorFlow, Keras', 'N/A', '2023-11-25', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P017', 'Digital Marketing', 'T001', ARRAY['Digital Marketing', 'Social Media'], 'Theoretical', ARRAY['G003'], 'A thesis on digital marketing strategies.', 'Marketing, Social Media', 'N/A', '2024-04-30', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P018', 'Cybersecurity', 'T002', ARRAY['Cybersecurity', 'Network Security'], 'Research', ARRAY['G001'], 'A thesis on cybersecurity and network security.', 'Cybersecurity, Encryption', 'N/A', '2024-10-15', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P019', 'Bioinformatics', 'T003', ARRAY['Bioinformatics', 'Computational Biology'], 'Research', ARRAY['G002'], 'A bioinformatics research thesis description.', 'Python, Biology, Genetics', 'N/A', '2024-05-20', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P020', 'Project Management', 'T001', ARRAY['Project Management', 'Agile'], 'Theoretical', ARRAY['G004'], 'A thesis on project management methodologies.', 'Agile, Scrum', 'N/A', '2023-09-15', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P021', 'Database Design', 'T002', ARRAY['Database Design', 'SQL'], 'Theoretical', ARRAY['G001'], 'A thesis on database design and SQL.', 'Database Management, SQL', 'N/A', '2024-06-15', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P022', 'Renewable Energy', 'T003', ARRAY['Renewable Energy', 'Sustainability'], 'Research', ARRAY['G002'], 'A thesis on renewable energy and sustainability.', 'Environmental Science, Renewable Energy', 'N/A', '2024-02-10', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P023', 'E-commerce Strategies', 'T001', ARRAY['E-commerce', 'Strategies'], 'Theoretical', ARRAY['G003'], 'A thesis on e-commerce strategies and online business.', 'E-commerce, Marketing', 'N/A', '2023-11-05', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P024', 'Natural Language Processing', 'T002', ARRAY['NLP', 'Language Processing'], 'Research', ARRAY['G001'], 'A thesis on natural language processing and language analysis.', 'Python, NLP', 'N/A', '2024-03-20', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P025', 'Global Marketing Trends', 'T003', ARRAY['Global Marketing', 'Trends'], 'Theoretical', ARRAY['G004'], 'A thesis on global marketing trends and consumer behavior.', 'Marketing, Consumer Behavior', 'N/A', '2023-10-30', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P026', 'Long description proposal', 'T002', ARRAY['Long keyword'], 'Very long thesis', ARRAY['G002'], 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis turpis leo, sodales maximus blandit eget, ullamcorper quis erat. Sed vitae eleifend ligula. Fusce sed nulla fringilla, convallis tortor sed, ultricies nulla. Donec vel tincidunt erat. Nullam lacus lectus, vestibulum accumsan libero sit amet, tincidunt dictum felis. Etiam pulvinar sapien eget neque dapibus, non luctus dui tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ultrices luctus sem id tempus.

Nunc non volutpat velit, vel tristique erat. Nunc sed cursus tellus. Pellentesque interdum pharetra dui, eget fringilla dui suscipit quis. Sed bibendum accumsan finibus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Duis quis lorem aliquam, convallis ligula eu, rhoncus dolor. Maecenas dignissim dui metus, vitae finibus magna interdum vitae. Aliquam consectetur sed eros ac fermentum. Integer erat enim, bibendum at tellus quis, tincidunt semper urna. Nullam mi sem, ultricies sed lorem nec, auctor sagittis diam.

Sed metus metus, vulputate nec vulputate sit amet, auctor ut tellus. Suspendisse imperdiet est ac lobortis dapibus. Sed luctus leo nec sem pharetra eleifend nec eu nisl. Ut a turpis eget ipsum ultrices rutrum. Curabitur suscipit diam vel mi malesuada vestibulum. Maecenas sed rhoncus purus. Donec libero ligula, efficitur in tristique eu, vehicula et lorem.

Aliquam erat volutpat. Nulla id lectus nec lacus suscipit condimentum. Aliquam sem nunc, sodales ut mi sed, pulvinar efficitur arcu. Morbi venenatis velit eget augue volutpat, eu faucibus mauris pharetra. Duis a orci id turpis volutpat tincidunt. Nullam laoreet purus non enim pellentesque ultrices. Donec non velit faucibus, sollicitudin orci vel, ultricies sapien.

Praesent cursus convallis ante, in gravida elit rhoncus sed. Vestibulum ac leo velit. Quisque sed justo id nibh molestie dignissim dictum vel nunc. Aenean accumsan tortor lorem, ultricies consectetur quam dignissim at. Nulla mauris libero, bibendum vel augue sit amet, maximus mattis lacus. Etiam quis faucibus turpis. Nulla malesuada libero quis interdum lobortis. In hendrerit ligula nec odio tincidunt ornare. Curabitur fringilla est enim, eu vestibulum dolor commodo a. Donec massa ante, fringilla et tortor in, fringilla pellentesque sapien. Nulla lacinia mi sed ex aliquam, sit amet euismod ante tincidunt.

Aliquam laoreet, ex nec rutrum hendrerit, lectus lorem eleifend velit, in viverra urna mauris vitae lorem. Nullam libero ex, condimentum ac lacinia nec, malesuada et eros. Donec rutrum fermentum gravida. Cras sed neque nisl. Phasellus semper purus quis tellus egestas congue. Mauris gravida pharetra viverra. Sed congue felis vitae eros vestibulum, at egestas tortor maximus. Nulla ac ligula ullamcorper, mattis lectus ut, accumsan nibh. Morbi sit amet imperdiet ligula, ac dignissim leo. Nullam ultrices quam nec tellus suscipit maximus. Pellentesque vitae dictum nibh. In hac habitasse platea dictumst. Vivamus a quam efficitur libero facilisis suscipit a vitae nulla. Sed sodales lobortis aliquet. Fusce bibendum id metus eu ornare.

Proin quis nunc arcu. Duis consequat, ex ac interdum venenatis, libero libero ultrices ante, vel interdum mauris purus ut dolor. Nulla facilisi. Donec a lorem vestibulum, fermentum risus vitae, luctus dui. Proin vel velit lorem. Pellentesque et lectus risus. Morbi faucibus, quam sit amet suscipit bibendum, metus nunc congue tortor, in imperdiet odio tortor sit amet nisi. Donec neque arcu, dictum in finibus a, gravida euismod mi. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec vel purus ante. Nullam volutpat at neque quis egestas. Donec aliquam feugiat porta. Mauris felis nisi, venenatis non elementum a, tristique sed quam.

Phasellus dapibus ultricies urna, at molestie ante porttitor non. Fusce accumsan diam aliquet magna porttitor varius. Sed vel ligula erat. Quisque dapibus consectetur dolor, sit amet iaculis mi porttitor id. Praesent dictum dignissim tempor. Fusce porta tristique sapien, id fermentum sapien imperdiet ut. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eu nisl purus. In sed massa magna. Proin tristique, velit quis blandit tincidunt, nunc diam finibus dui, vitae aliquet nibh augue eu magna. Sed malesuada porta augue, non pulvinar felis lobortis a. Pellentesque ut lacus dui. Sed sit amet massa a quam fermentum efficitur. Sed dictum elementum porttitor. Duis dapibus iaculis dapibus. Donec dignissim efficitur nibh eu condimentum.

In vitae consequat risus, egestas pharetra justo. Aliquam in tellus ornare, rhoncus risus eu, sagittis augue. Pellentesque sit amet nibh eu purus dictum convallis. Donec tincidunt facilisis libero eget suscipit. Nulla massa nibh, laoreet ac mollis et, rhoncus quis justo. Mauris tortor metus, lobortis sit amet scelerisque sed, consectetur at orci. Nulla finibus libero ac est mattis tristique. Pellentesque vestibulum quam metus, sit amet finibus metus faucibus vitae. Nullam accumsan nisl sed bibendum egestas. Sed interdum sagittis turpis eu placerat. Nullam vehicula magna in nulla ornare tristique. Aenean euismod ac lorem vel volutpat. Aenean nec tellus nunc. Nunc eget lectus et lorem iaculis tincidunt quis interdum urna.

Suspendisse potenti. Sed porttitor elit eget molestie maximus. Phasellus ex nisl, feugiat quis neque vel, rhoncus ultrices ligula. Vivamus purus tortor, tristique quis mi eget, rutrum blandit purus. Donec posuere gravida quam, vitae blandit quam ornare ac. Aenean at purus blandit, gravida nisl fermentum, sollicitudin massa. Vestibulum fringilla fermentum luctus. Morbi congue eu ipsum ut vestibulum. Nulla dignissim ante eu suscipit venenatis. Duis tempus ligula ac placerat dictum. Etiam scelerisque et magna in suscipit. Vestibulum tempus volutpat odio, vitae dapibus felis bibendum quis. Cras in commodo est, vel consequat dolor.

Proin convallis turpis a orci vulputate, sed finibus purus fermentum. Donec vestibulum, leo ut viverra volutpat, elit est aliquam massa, non pulvinar turpis enim vitae lacus. Curabitur viverra erat metus. Ut pretium bibendum felis non ornare. Vestibulum eget urna eu nisl aliquam accumsan sit amet sagittis lorem. Pellentesque eget nibh sed tortor faucibus venenatis. Sed sit amet congue tellus. Interdum et malesuada fames ac ante ipsum primis in faucibus.

Aliquam erat volutpat. Ut sit amet fermentum turpis. Integer sem urna, bibendum nec elementum scelerisque, pulvinar ac leo. Donec a feugiat neque. Nunc eleifend fermentum mauris at imperdiet. Praesent eget nisi ut ipsum bibendum ullamcorper at sed dolor. Nunc interdum mollis velit ut auctor. Mauris vestibulum massa leo, ut pulvinar nisi ullamcorper ut.', 'Knowledge in Web app', 'N/A', '2024-10-25', 'Bachelor', ARRAY['BSC001'], false, false),
  ('P027', 'Global Marketing Trends', 'T002', ARRAY['Global Marketing', 'Trends'], 'Theoretical', ARRAY['G002'], 'A thesis on global marketing trends and consumer behavior.', 'Marketing, Consumer Behavior', 'N/A', '2024-10-30', 'Master', ARRAY['MSC002'], false, false),
  ('P028', 'Impact of AI to computer science', 'T011', ARRAY['AI', 'Computer Science'], 'Theoretical', ARRAY['G001'], 'A thesis on the impact of AI to computer science.', 'AI, Computer Science', 'N/A', '2024-10-15', 'Master', ARRAY['MSC001'], false, false);
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
  ('P015', 'S003', 'Canceled', '2023-11-05'),
  ('P018', 'S004', 'Pending', '2023-10-25'),
  ('P021', 'S005', 'Pending', '2023-11-08'),
  ('P021', 'S011', 'Pending', '2023-10-12'),
  ('P024', 'S012', 'Pending', '2023-11-15'),
  ('P008', 'S008', 'Accepted', '2023-10-10'),
  ('P009', 'S009', 'Pending', '2023-11-18'),
  ('P010', 'S010', 'Accepted', '2023-10-05'),
  ('P003', 'S003', 'Pending', '2023-10-30'),
  ('P002', 'S001', 'Accepted', '2023-12-10');


ALTER TABLE public.applications OWNER TO postgres;

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_proposals FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id);

CREATE TABLE public.studentnotifs (
    id SERIAL PRIMARY KEY,
    channel VARCHAR(30) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    campaign VARCHAR(30) NOT NULL,
    subject TEXT NOT NULL,
    content JSON NOT NULL,
    creation TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(30) NOT NULL,
    lastupdate TIMESTAMP NOT NULL
);

ALTER TABLE public.studentnotifs OWNER TO postgres;

ALTER TABLE ONLY public.studentnotifs
    ADD CONSTRAINT studentnotifs_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);

--
-- Name: virtual_clock; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.virtual_clock (
    prop_name VARCHAR(20) PRIMARY KEY,
    prop_value DATE NOT NULL
);

INSERT INTO public.virtual_clock (prop_name, prop_value) VALUES ('virtual_date', CURRENT_DATE);

ALTER TABLE public.virtual_clock OWNER TO postgres;

CREATE TABLE public.cronologs
(
    id        SERIAL PRIMARY KEY,
    job_name  VARCHAR(50) NOT NULL,
    event     VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP   NOT NULL DEFAULT NOW(),
    details   JSON        DEFAULT NULL
);

ALTER TABLE public.cronologs OWNER TO postgres;

CREATE TABLE public.teachernotifs (
    id SERIAL PRIMARY KEY,
    channel VARCHAR(30) NOT NULL,
    teacher_id VARCHAR(10) NOT NULL,
    campaign VARCHAR(30) NOT NULL,
    subject TEXT NOT NULL,
    content JSON NOT NULL,
    creation TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(30) NOT NULL,
    lastupdate TIMESTAMP NOT NULL
);

ALTER TABLE public.teachernotifs OWNER TO postgres;

ALTER TABLE ONLY public.teachernotifs
    ADD CONSTRAINT teachernotifs_fk_teacher FOREIGN KEY (teacher_id) REFERENCES public.teacher(id);

--
-- Name: thesis_request; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thesis_request (
    request_id VARCHAR(10) PRIMARY KEY,
    supervisor_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    approval_date DATE,
    status VARCHAR(20) NOT NULL,
    co_supervisor_id VARCHAR(10)
);

INSERT INTO public.thesis_request (request_id, supervisor_id, student_id, title, description, approval_date, status, co_supervisor_id) VALUES
  ('R001', 'T001', 'S001', 'Specific thesis on Agile metodology', ' Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis turpis leo, sodales maximus blandit eget, ullamcorper quis erat. Sed vitae eleifend ligula. Fusce sed nulla fringilla, convallis tortor sed, ultricies nulla. Donec vel tincidunt erat. Nullam lacus lectus, vestibulum accumsan libero sit amet, tincidunt dictum felis. Etiam pulvinar sapien eget neque dapibus, non luctus dui tincidunt. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla ultrices luctus sem id tempus.', NULL , 'Pending', NULL);
  



ALTER TABLE public.thesis_request OWNER TO postgres;

ALTER TABLE ONLY public.thesis_request
    ADD CONSTRAINT thesis_request_fk FOREIGN KEY (supervisor_id) REFERENCES public.teacher(id);

ALTER TABLE ONLY public.thesis_request
    ADD CONSTRAINT thesis_request_fk_1 FOREIGN KEY (student_id) REFERENCES public.student(id);

ALTER TABLE ONLY public.thesis_request
    ADD CONSTRAINT thesis_request_fk_2 FOREIGN KEY (co_supervisor_id) REFERENCES public.teacher(id);

-- Set expired proposals as archived
update public.proposals
set archived = true
where expiration_date <= CURRENT_DATE AND deleted = false;



-- Function executed when trigger is activated
CREATE OR REPLACE FUNCTION public.aggiorna_proposal()
RETURNS TRIGGER AS $$
BEGIN

        UPDATE public.proposals SET archived = true WHERE expiration_date <= NEW.prop_value AND deleted = false;
        UPDATE public.applications SET status = 'Canceled'
            FROM public.proposals
            WHERE public.applications.proposal_id = public.proposals.proposal_id 
            AND public.proposals.archived = true
            AND public.applications.status = 'Pending'; 
           
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger actived when the virtual_clock changes
CREATE or replace TRIGGER trigger_aggiorna_proposal
AFTER UPDATE OF prop_value ON public.virtual_clock
FOR EACH ROW
EXECUTE FUNCTION public.aggiorna_proposal();

--
-- Name: temp_file_uploads; Type: TABLE; Schema: public; Owner: postgres
-- Since, the file is upload as the same time a student apply for thesis, the application_id is not created yet
-- So here, you store the file with its id, to link it after to the application_id. 
--

CREATE TABLE public.temp_file_uploads (
    upload_id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    filename VARCHAR(100) NOT NULL,
    date_uploaded DATE
);

ALTER TABLE ONLY public.temp_file_uploads
    ADD CONSTRAINT upload_file_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


INSERT INTO public.temp_file_uploads (filename,student_id, date_uploaded) VALUES
  ('Resume_S001.pdf', 'S001', '2023-11-01'),
  ('Cover_Letter_S011.pdf', 'S011', '2023-10-12'),
  ('Recommendation_Letter_S012.pdf', 'S012', '2023-11-15');

ALTER TABLE public.temp_file_uploads OWNER TO postgres;

--
-- Name: application_file; Type: TABLE; Schema: public; Owner: postgres
--


CREATE TABLE public.application_file (
    id SERIAL PRIMARY KEY,
    application_id INT NOT NULL, 
    student_id VARCHAR(10) NOT NULL,
    filename VARCHAR(100) NOT NULL,
    date_uploaded DATE
);

ALTER TABLE ONLY public.application_file
    ADD CONSTRAINT application_file_fk_application FOREIGN KEY (application_id) REFERENCES public.applications(id);

ALTER TABLE ONLY public.application_file
    ADD CONSTRAINT application_file_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);

INSERT INTO public.application_file ( application_id,filename, student_id,  date_uploaded) VALUES
  ('1', 'Resume_S001.pdf', 'S001', '2023-11-01'),
  ('5', 'Cover_Letter_S011.pdf', 'S011', '2023-10-12'),
  ('6', 'Resume_S012.pdf', 'S012', '2023-11-15');

ALTER TABLE public.application_file OWNER TO postgres;
--
-- PostgreSQL database dump complete
--
