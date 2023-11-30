--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1 (Debian 16.1-1.pgdg130+1)
-- Dumped by pg_dump version 16.1 (Debian 16.1-1.pgdg130+1)

-- Started on 2023-11-30 17:18:15 CET

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
-- TOC entry 3396 (class 1262 OID 26802)
-- Name: Thesis-Management-System; Type: DATABASE; Schema: -; Owner: postgres
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
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 221 (class 1259 OID 26846)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    id integer NOT NULL,
    proposal_id character varying(10) NOT NULL,
    student_id character varying(10) NOT NULL,
    status character varying(255) NOT NULL,
    application_date date NOT NULL
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 26845)
-- Name: applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_id_seq OWNER TO postgres;

--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 220
-- Name: applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_id_seq OWNED BY public.applications.id;


--
-- TOC entry 218 (class 1259 OID 26823)
-- Name: career; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career (
    id character varying(10) NOT NULL,
    cod_course character varying(10) NOT NULL,
    title_course character varying(50) NOT NULL,
    cfu integer NOT NULL,
    grade integer NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.career OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 26803)
-- Name: degree; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.degree (
    cod_degree character varying(10) NOT NULL,
    title_degree character varying(50) NOT NULL
);


ALTER TABLE public.degree OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 26833)
-- Name: proposals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.proposals (
    proposal_id character varying(10) NOT NULL,
    title character varying(255) NOT NULL,
    supervisor_id character varying(10),
    keywords text[],
    type character varying(255),
    groups text[],
    description text,
    required_knowledge text,
    notes text,
    expiration_date date,
    level character varying(30),
    programmes text[],
    archived boolean
);


ALTER TABLE public.proposals OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 26808)
-- Name: student; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student (
    id character varying(10) NOT NULL,
    surname character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    gender character(1),
    nationality character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    cod_degree character varying(10),
    enrollment_year integer
);


ALTER TABLE public.student OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 26818)
-- Name: teacher; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher (
    id character varying(10) NOT NULL,
    surname character varying(50) NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(255) NOT NULL,
    cod_group character varying(10),
    cod_department character varying(10)
);


ALTER TABLE public.teacher OWNER TO postgres;

--
-- TOC entry 3223 (class 2604 OID 26849)
-- Name: applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN id SET DEFAULT nextval('public.applications_id_seq'::regclass);


--
-- TOC entry 3390 (class 0 OID 26846)
-- Dependencies: 221
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.applications VALUES (1, 'P001', 'S001', 'Pending', '2023-11-01');
INSERT INTO public.applications VALUES (7, 'P007', 'S007', 'Pending', '2023-11-15');
INSERT INTO public.applications VALUES (8, 'P008', 'S008', 'Accepted', '2023-10-10');
INSERT INTO public.applications VALUES (9, 'P009', 'S009', 'Pending', '2023-11-18');
INSERT INTO public.applications VALUES (10, 'P010', 'S010', 'Accepted', '2023-10-05');
INSERT INTO public.applications VALUES (2, 'P012', 'S002', 'Pending', '2023-10-15');
INSERT INTO public.applications VALUES (3, 'P015', 'S003', 'Pending', '2023-11-05');
INSERT INTO public.applications VALUES (4, 'P018', 'S004', 'Pending', '2023-10-25');
INSERT INTO public.applications VALUES (5, 'P021', 'S005', 'Pending', '2023-11-08');
INSERT INTO public.applications VALUES (6, 'P021', 'S006', 'Pending', '2023-10-12');


--
-- TOC entry 3387 (class 0 OID 26823)
-- Dependencies: 218
-- Data for Name: career; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.career VALUES ('S001', 'CRS001', 'Computer Science 101', 6, 27, '2022-05-15');
INSERT INTO public.career VALUES ('S001', 'CRS002', 'Mathematics Basics', 10, 30, '2022-06-20');
INSERT INTO public.career VALUES ('S002', 'CRS003', 'Physics Fundamentals', 10, 18, '2022-07-10');
INSERT INTO public.career VALUES ('S003', 'CRS004', 'History of Art', 6, 23, '2022-08-05');
INSERT INTO public.career VALUES ('S002', 'CRS005', 'Introduction to Marketing', 6, 25, '2022-09-12');
INSERT INTO public.career VALUES ('S001', 'CRS006', 'Advanced Robotics', 8, 21, '2022-10-18');
INSERT INTO public.career VALUES ('S004', 'CRS007', 'Environmental Science', 6, 29, '2022-11-25');
INSERT INTO public.career VALUES ('S003', 'CRS008', 'Literature Appreciation', 6, 26, '2022-12-30');
INSERT INTO public.career VALUES ('S002', 'CRS009', 'Financial Management', 8, 19, '2023-01-15');
INSERT INTO public.career VALUES ('S004', 'CRS010', 'Machine Learning for Beginners', 8, 21, '2023-02-20');


--
-- TOC entry 3384 (class 0 OID 26803)
-- Dependencies: 215
-- Data for Name: degree; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.degree VALUES ('BSC001', 'Bachelor of Science');
INSERT INTO public.degree VALUES ('BSC002', 'Bachelor of Arts');
INSERT INTO public.degree VALUES ('MSC001', 'Master of Science');
INSERT INTO public.degree VALUES ('MSC002', 'Master of Arts');
INSERT INTO public.degree VALUES ('PHD001', 'Doctor of Philosophy');
INSERT INTO public.degree VALUES ('PHD002', 'Doctor of Education');
INSERT INTO public.degree VALUES ('BSC003', 'Bachelor of Business');
INSERT INTO public.degree VALUES ('MSC003', 'Master of Engineering');
INSERT INTO public.degree VALUES ('BSC004', 'Bachelor of Nursing');
INSERT INTO public.degree VALUES ('MSC004', 'Master of Public Health');


--
-- TOC entry 3388 (class 0 OID 26833)
-- Dependencies: 219
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proposals VALUES ('P001', 'Web Development', 'T001', '{Web,Development}', 'Theoretical', '{"Group A"}', 'A web development project description.', 'HTML, CSS, JavaScript', 'No special notes.', '2023-12-31', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P002', 'Machine Learning', 'T002', '{"Machine Learning",AI}', 'Research', '{"Group B"}', 'A machine learning thesis description.', 'Python, TensorFlow', 'N/A', '2024-06-30', 'Master', '{MSC001,MSC002}', false);
INSERT INTO public.proposals VALUES ('P003', 'Artificial Intelligence', 'T003', '{AI,"Machine Learning"}', 'Experimental', '{"Group A"}', 'An AI research thesis description.', 'Python, TensorFlow', 'N/A', '2024-05-15', 'Master', '{MSC001}', false);
INSERT INTO public.proposals VALUES ('P004', 'Environmental Impact Analysis', 'T004', '{"Environmental Science",Experimental}', 'Research', '{"Group B"}', 'An environmental impact analysis thesis description.', 'Environmental Science knowledge', 'N/A', '2023-11-30', 'Master', '{MSC001}', false);
INSERT INTO public.proposals VALUES ('P005', 'Marketing Strategies', 'T005', '{Marketing,Strategies}', 'Theoretical', '{"Group C"}', 'A marketing strategies thesis description.', 'Marketing fundamentals', 'N/A', '2023-10-20', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P006', 'Robotics and Automation', 'T006', '{Robotics,Automation}', 'Research', '{"Group A"}', 'A robotics and automation thesis description.', 'Robotics knowledge', 'N/A', '2024-02-28', 'Master', '{MSC003}', false);
INSERT INTO public.proposals VALUES ('P007', 'Climate Change Impact', 'T007', '{"Climate Change",Impact}', 'Experimental', '{"Group B"}', 'A thesis on climate change impact analysis.', 'Environmental Science knowledge', 'N/A', '2024-03-15', 'Master', '{MSC002}', false);
INSERT INTO public.proposals VALUES ('P008', 'Literary Analysis', 'T008', '{Literature,Analysis}', 'Theoretical', '{"Group D"}', 'A literary analysis thesis description.', 'Literary analysis skills', 'N/A', '2023-11-10', 'Master', '{MSC001}', false);
INSERT INTO public.proposals VALUES ('P009', 'Financial Risk Management', 'T009', '{Financial,"Risk Management"}', 'Theoretical', '{"Group C"}', 'A thesis on financial risk management.', 'Finance knowledge', 'N/A', '2024-04-10', 'Master', '{MSC002}', false);
INSERT INTO public.proposals VALUES ('P010', 'Introduction to Machine Learning', 'T010', '{"Machine Learning",AI}', 'Research', '{"Group A"}', 'An introductory thesis on machine learning.', 'Basic AI knowledge', 'N/A', '2023-09-30', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P011', 'Software Engineering', 'T001', '{"Software Engineering",Development}', 'Theoretical', '{"Group A"}', 'A software engineering project description.', 'Java, Python, Git', 'N/A', '2023-08-25', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P012', 'Data Analysis', 'T002', '{"Data Analysis",Statistics}', 'Research', '{"Group B"}', 'A data analysis thesis description.', 'R, Python, Statistics', 'N/A', '2024-01-15', 'Master', '{MSC001,MSC002}', false);
INSERT INTO public.proposals VALUES ('P013', 'Human-Computer Interaction', 'T003', '{HCI,"User Experience"}', 'Experimental', '{"Group A"}', 'A thesis on human-computer interaction.', 'UI/UX design, Psychology', 'N/A', '2023-12-10', 'Master', '{MSC001}', false);
INSERT INTO public.proposals VALUES ('P014', 'Supply Chain Management', 'T001', '{"Supply Chain",Management}', 'Theoretical', '{"Group C"}', 'A thesis on supply chain management.', 'Logistics, Operations', 'N/A', '2024-03-05', 'Master', '{MSC001}', false);
INSERT INTO public.proposals VALUES ('P015', 'Mobile App Development', 'T002', '{"Mobile App",Development}', 'Research', '{"Group A"}', 'A mobile app development project description.', 'Swift, Kotlin, React Native', 'N/A', '2024-02-20', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P016', 'Neural Networks', 'T003', '{"Neural Networks","Deep Learning"}', 'Research', '{"Group B"}', 'A thesis on neural networks and deep learning.', 'Python, TensorFlow, Keras', 'N/A', '2023-11-25', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P017', 'Digital Marketing', 'T001', '{"Digital Marketing","Social Media"}', 'Theoretical', '{"Group C"}', 'A thesis on digital marketing strategies.', 'Marketing, Social Media', 'N/A', '2024-04-30', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P019', 'Bioinformatics', 'T003', '{Bioinformatics,"Computational Biology"}', 'Research', '{"Group B"}', 'A bioinformatics research thesis description.', 'Python, Biology, Genetics', 'N/A', '2024-05-20', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P020', 'Project Management', 'T001', '{"Project Management",Agile}', 'Theoretical', '{"Group D"}', 'A thesis on project management methodologies.', 'Agile, Scrum', 'N/A', '2023-09-15', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P021', 'Database Design', 'T002', '{"Database Design",SQL}', 'Theoretical', '{"Group A"}', 'A thesis on database design and SQL.', 'Database Management, SQL', 'N/A', '2024-06-15', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P022', 'Renewable Energy', 'T003', '{"Renewable Energy",Sustainability}', 'Research', '{"Group B"}', 'A thesis on renewable energy and sustainability.', 'Environmental Science, Renewable Energy', 'N/A', '2024-02-10', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P023', 'E-commerce Strategies', 'T001', '{E-commerce,Strategies}', 'Theoretical', '{"Group C"}', 'A thesis on e-commerce strategies and online business.', 'E-commerce, Marketing', 'N/A', '2023-11-05', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P024', 'Natural Language Processing', 'T002', '{NLP,"Language Processing"}', 'Research', '{"Group A"}', 'A thesis on natural language processing and language analysis.', 'Python, NLP', 'N/A', '2024-03-20', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P025', 'Global Marketing Trends', 'T003', '{"Global Marketing",Trends}', 'Theoretical', '{"Group D"}', 'A thesis on global marketing trends and consumer behavior.', 'Marketing, Consumer Behavior', 'N/A', '2023-10-30', 'Bachelor', '{BSC001}', false);
INSERT INTO public.proposals VALUES ('P018', 'Cybersecurity', 'T002', '{Cybersecurity,"Network Security"}', 'Research', '{"Group A"}', 'A thesis on cybersecurity and network security.', 'Cybersecurity, Encryption', 'N/A', '2024-10-15', 'Bachelor', '{BSC001}', false);


--
-- TOC entry 3385 (class 0 OID 26808)
-- Dependencies: 216
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student VALUES ('S001', 'Smith', 'John', 'M', 'USA', 'john.smith@example.com', 'BSC001', 2021);
INSERT INTO public.student VALUES ('S002', 'Johnson', 'Emily', 'F', 'Canada', 'emily.johnson@example.com', 'BSC001', 2022);
INSERT INTO public.student VALUES ('S003', 'Lee', 'David', 'M', 'Australia', 'david.lee@example.com', 'MSC001', 2020);
INSERT INTO public.student VALUES ('S004', 'Garcia', 'Maria', 'F', 'Spain', 'maria.garcia@example.com', 'MSC001', 2021);
INSERT INTO public.student VALUES ('S005', 'Chen', 'Wei', 'M', 'China', 'wei.chen@example.com', 'BSC002', 2022);
INSERT INTO public.student VALUES ('S006', 'Kim', 'Jiyoung', 'F', 'South Korea', 'jiyoung.kim@example.com', 'BSC002', 2021);
INSERT INTO public.student VALUES ('S007', 'Brown', 'Michael', 'M', 'UK', 'michael.brown@example.com', 'MSC002', 2022);
INSERT INTO public.student VALUES ('S008', 'Nguyen', 'Linh', 'F', 'Vietnam', 'linh.nguyen@example.com', 'MSC002', 2020);
INSERT INTO public.student VALUES ('S009', 'Martinez', 'Carlos', 'M', 'Mexico', 'carlos.martinez@example.com', 'PHD001', 2021);
INSERT INTO public.student VALUES ('S010', 'Wang', 'Xiaoyun', 'F', 'China', 'xiaoyun.wang@example.com', 'PHD001', 2020);


--
-- TOC entry 3386 (class 0 OID 26818)
-- Dependencies: 217
-- Data for Name: teacher; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.teacher VALUES ('T001', 'Anderson', 'Sarah', 'sarah.anderson@example.com', 'G001', 'D001');
INSERT INTO public.teacher VALUES ('T002', 'Wilson', 'Michael', 'michael.wilson@example.com', 'G002', 'D002');
INSERT INTO public.teacher VALUES ('T003', 'Gomez', 'Ana', 'ana.gomez@example.com', 'G001', 'D001');
INSERT INTO public.teacher VALUES ('T004', 'Li', 'Chen', 'chen.li@example.com', 'G002', 'D002');
INSERT INTO public.teacher VALUES ('T005', 'Johnson', 'Robert', 'robert.johnson@example.com', 'G003', 'D003');
INSERT INTO public.teacher VALUES ('T006', 'Kim', 'Minho', 'minho.kim@example.com', 'G001', 'D001');
INSERT INTO public.teacher VALUES ('T007', 'Brown', 'Linda', 'linda.brown@example.com', 'G003', 'D003');
INSERT INTO public.teacher VALUES ('T008', 'Wang', 'Xiaojie', 'xiaojie.wang@example.com', 'G004', 'D004');
INSERT INTO public.teacher VALUES ('T009', 'Garcia', 'Carlos', 'carlos.garcia@example.com', 'G004', 'D004');
INSERT INTO public.teacher VALUES ('T010', 'Chen', 'Yun', 'yun.chen@example.com', 'G003', 'D003');


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 220
-- Name: applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_id_seq', 10, true);


--
-- TOC entry 3235 (class 2606 OID 26851)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (id);


--
-- TOC entry 3231 (class 2606 OID 26827)
-- Name: career career_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career
    ADD CONSTRAINT career_pkey PRIMARY KEY (id, cod_course);


--
-- TOC entry 3225 (class 2606 OID 26807)
-- Name: degree degree_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.degree
    ADD CONSTRAINT degree_pkey PRIMARY KEY (cod_degree);


--
-- TOC entry 3233 (class 2606 OID 26839)
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (proposal_id);


--
-- TOC entry 3227 (class 2606 OID 26812)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3229 (class 2606 OID 26822)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (id);


--
-- TOC entry 3239 (class 2606 OID 26857)
-- Name: applications applications_fk_proposals; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_proposals FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id);


--
-- TOC entry 3240 (class 2606 OID 26852)
-- Name: applications applications_fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_student FOREIGN KEY (student_id) REFERENCES public.student(id);


--
-- TOC entry 3237 (class 2606 OID 26828)
-- Name: career career_fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career
    ADD CONSTRAINT career_fk_student FOREIGN KEY (id) REFERENCES public.student(id);


--
-- TOC entry 3238 (class 2606 OID 26840)
-- Name: proposals proposals_fk_teacher; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_fk_teacher FOREIGN KEY (supervisor_id) REFERENCES public.teacher(id);


--
-- TOC entry 3236 (class 2606 OID 26813)
-- Name: student student_fk_degree; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


-- Completed on 2023-11-30 17:18:15 CET

--
-- PostgreSQL database dump complete
--

