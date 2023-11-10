--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0 (Debian 16.0-2)
-- Dumped by pg_dump version 16.0 (Debian 16.0-2)

-- Started on 2023-11-10 19:00:27 CET

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
-- TOC entry 3413 (class 1262 OID 25628)
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
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 25693)
-- Name: applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id integer NOT NULL,
    proposal_id character varying(10) NOT NULL,
    id character varying(10) NOT NULL,
    status character varying(255) NOT NULL,
    application_date date
);


ALTER TABLE public.applications OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 25692)
-- Name: applications_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.applications_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.applications_application_id_seq OWNER TO postgres;

--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 222
-- Name: applications_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.applications_application_id_seq OWNED BY public.applications.application_id;


--
-- TOC entry 218 (class 1259 OID 25649)
-- Name: career; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.career (
    id character varying(10) NOT NULL,
    cod_course character varying(10),
    title_course character varying(50) NOT NULL,
    cfu integer NOT NULL,
    grade integer NOT NULL,
    date date NOT NULL
);


ALTER TABLE public.career OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 25629)
-- Name: degree; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.degree (
    cod_degree character varying(10) NOT NULL,
    title_degree character varying(50) NOT NULL
);


ALTER TABLE public.degree OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 25654)
-- Name: follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    fid SERIAL PRIMARY KEY,
    id VARCHAR(10) NOT NULL,
    cod_degree VARCHAR(10)
);

ALTER TABLE public.follows OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 25667)
-- Name: passed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passed (
    pid SERIAL PRIMARY KEY,
    career_id VARCHAR(10),
    id VARCHAR(10)
    );


ALTER TABLE public.passed OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25680)
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
    cds_programmes text[]
);


ALTER TABLE public.proposals OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 25634)
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
-- TOC entry 217 (class 1259 OID 25644)
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
-- TOC entry 3231 (class 2604 OID 25696)
-- Name: applications application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications ALTER COLUMN application_id SET DEFAULT nextval('public.applications_application_id_seq'::regclass);


--
-- TOC entry 3407 (class 0 OID 25693)
-- Dependencies: 223
-- Data for Name: applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.applications VALUES (1, 'P001', 'S001', 'Pending', '2023-11-01');
INSERT INTO public.applications VALUES (2, 'P002', 'S002', 'Accepted', '2023-10-15');
INSERT INTO public.applications VALUES (3, 'P003', 'S003', 'Pending', '2023-11-05');
INSERT INTO public.applications VALUES (4, 'P004', 'S004', 'Accepted', '2023-10-25');
INSERT INTO public.applications VALUES (5, 'P005', 'S005', 'Pending', '2023-11-08');
INSERT INTO public.applications VALUES (6, 'P006', 'S006', 'Accepted', '2023-10-12');
INSERT INTO public.applications VALUES (7, 'P007', 'S007', 'Pending', '2023-11-15');
INSERT INTO public.applications VALUES (8, 'P008', 'S008', 'Accepted', '2023-10-10');
INSERT INTO public.applications VALUES (9, 'P009', 'S009', 'Pending', '2023-11-18');
INSERT INTO public.applications VALUES (10, 'P010', 'S010', 'Accepted', '2023-10-05');


--
-- TOC entry 3402 (class 0 OID 25649)
-- Dependencies: 218
-- Data for Name: career; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.career VALUES ('C001', 'CRS001', 'Computer Science 101', 5, 90, '2022-05-15');
INSERT INTO public.career VALUES ('C002', 'CRS002', 'Mathematics Basics', 3, 85, '2022-06-20');
INSERT INTO public.career VALUES ('C003', 'CRS003', 'Physics Fundamentals', 4, 88, '2022-07-10');
INSERT INTO public.career VALUES ('C004', 'CRS004', 'History of Art', 3, 92, '2022-08-05');
INSERT INTO public.career VALUES ('C005', 'CRS005', 'Introduction to Marketing', 4, 89, '2022-09-12');
INSERT INTO public.career VALUES ('C006', 'CRS006', 'Advanced Robotics', 5, 91, '2022-10-18');
INSERT INTO public.career VALUES ('C007', 'CRS007', 'Environmental Science', 4, 86, '2022-11-25');
INSERT INTO public.career VALUES ('C008', 'CRS008', 'Literature Appreciation', 3, 93, '2022-12-30');
INSERT INTO public.career VALUES ('C009', 'CRS009', 'Financial Management', 4, 87, '2023-01-15');
INSERT INTO public.career VALUES ('C010', 'CRS010', 'Machine Learning for Beginners', 5, 94, '2023-02-20');


--
-- TOC entry 3399 (class 0 OID 25629)
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
-- TOC entry 3403 (class 0 OID 25654)
-- Dependencies: 219
-- Data for Name: follows; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.follows VALUES ('S001', 'BSC001');
INSERT INTO public.follows VALUES ('S002', 'BSC001');
INSERT INTO public.follows VALUES ('S003', 'MSC001');
INSERT INTO public.follows VALUES ('S004', 'MSC001');
INSERT INTO public.follows VALUES ('S005', 'BSC002');
INSERT INTO public.follows VALUES ('S006', 'BSC002');
INSERT INTO public.follows VALUES ('S007', 'MSC002');
INSERT INTO public.follows VALUES ('S008', 'MSC002');
INSERT INTO public.follows VALUES ('S009', 'PHD001');
INSERT INTO public.follows VALUES ('S010', 'PHD001');


--
-- TOC entry 3404 (class 0 OID 25667)
-- Dependencies: 220
-- Data for Name: passed; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.passed VALUES ('C001', 'S001');
INSERT INTO public.passed VALUES ('C002', 'S001');
INSERT INTO public.passed VALUES ('C001', 'S002');
INSERT INTO public.passed VALUES ('C003', 'S002');
INSERT INTO public.passed VALUES ('C004', 'S003');
INSERT INTO public.passed VALUES ('C005', 'S003');
INSERT INTO public.passed VALUES ('C006', 'S004');
INSERT INTO public.passed VALUES ('C007', 'S004');
INSERT INTO public.passed VALUES ('C008', 'S005');
INSERT INTO public.passed VALUES ('C009', 'S005');


--
-- TOC entry 3405 (class 0 OID 25680)
-- Dependencies: 221
-- Data for Name: proposals; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.proposals VALUES ('P001', 'Web Development', 'T001', '{Web,Development}', 'Bachelor', '{"Group A"}', 'A web development project description.', 'HTML, CSS, JavaScript', 'No special notes.', '2023-12-31', 'Undergraduate', '{CD001}');
INSERT INTO public.proposals VALUES ('P002', 'Machine Learning', 'T002', '{"Machine Learning",AI}', 'Master', '{"Group B"}', 'A machine learning thesis description.', 'Python, TensorFlow', 'N/A', '2024-06-30', 'Graduate', '{CD002}');
INSERT INTO public.proposals VALUES ('P003', 'Artificial Intelligence', 'T003', '{AI,"Machine Learning"}', 'Master', '{"Group A"}', 'An AI research thesis description.', 'Python, TensorFlow', 'N/A', '2024-05-15', 'Graduate', '{CD003}');
INSERT INTO public.proposals VALUES ('P004', 'Environmental Impact Analysis', 'T004', '{"Environmental Science",Analysis}', 'Master', '{"Group B"}', 'An environmental impact analysis thesis description.', 'Environmental Science knowledge', 'N/A', '2023-11-30', 'Graduate', '{CD004}');
INSERT INTO public.proposals VALUES ('P005', 'Marketing Strategies', 'T005', '{Marketing,Strategies}', 'Bachelor', '{"Group C"}', 'A marketing strategies thesis description.', 'Marketing fundamentals', 'N/A', '2023-10-20', 'Undergraduate', '{CD005}');
INSERT INTO public.proposals VALUES ('P006', 'Robotics and Automation', 'T006', '{Robotics,Automation}', 'Master', '{"Group A"}', 'A robotics and automation thesis description.', 'Robotics knowledge', 'N/A', '2024-02-28', 'Graduate', '{CD006}');
INSERT INTO public.proposals VALUES ('P007', 'Climate Change Impact', 'T007', '{"Climate Change",Impact}', 'Master', '{"Group B"}', 'A thesis on climate change impact analysis.', 'Environmental Science knowledge', 'N/A', '2024-03-15', 'Graduate', '{CD007}');
INSERT INTO public.proposals VALUES ('P008', 'Literary Analysis', 'T008', '{Literature,Analysis}', 'Bachelor', '{"Group D"}', 'A literary analysis thesis description.', 'Literary analysis skills', 'N/A', '2023-11-10', 'Undergraduate', '{CD008}');
INSERT INTO public.proposals VALUES ('P009', 'Financial Risk Management', 'T009', '{Financial,"Risk Management"}', 'Master', '{"Group C"}', 'A thesis on financial risk management.', 'Finance knowledge', 'N/A', '2024-04-10', 'Graduate', '{CD009}');
INSERT INTO public.proposals VALUES ('P010', 'Introduction to Machine Learning', 'T010', '{"Machine Learning",AI}', 'Bachelor', '{"Group A"}', 'An introductory thesis on machine learning.', 'Basic AI knowledge', 'N/A', '2023-09-30', 'Undergraduate', '{CD001}');


--
-- TOC entry 3400 (class 0 OID 25634)
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
-- TOC entry 3401 (class 0 OID 25644)
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
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 222
-- Name: applications_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.applications_application_id_seq', 10, true);


--
-- TOC entry 3247 (class 2606 OID 25698)
-- Name: applications applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 3239 (class 2606 OID 25653)
-- Name: career career_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.career
    ADD CONSTRAINT career_pkey PRIMARY KEY (id);


--
-- TOC entry 3233 (class 2606 OID 25633)
-- Name: degree degree_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.degree
    ADD CONSTRAINT degree_pkey PRIMARY KEY (cod_degree);


--
-- TOC entry 3241 (class 2606 OID 25710)
-- Name: follows follows_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_pk PRIMARY KEY (id);


--
-- TOC entry 3243 (class 2606 OID 25716)
-- Name: passed passed_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passed
    ADD CONSTRAINT passed_pk PRIMARY KEY (career_id, id);


--
-- TOC entry 3245 (class 2606 OID 25686)
-- Name: proposals proposals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_pkey PRIMARY KEY (proposal_id);


--
-- TOC entry 3235 (class 2606 OID 25638)
-- Name: student student_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_pkey PRIMARY KEY (id);


--
-- TOC entry 3237 (class 2606 OID 25648)
-- Name: teacher teacher_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher
    ADD CONSTRAINT teacher_pkey PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 25704)
-- Name: applications applications_fk_proposals; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_proposals FOREIGN KEY (proposal_id) REFERENCES public.proposals(proposal_id);


--
-- TOC entry 3255 (class 2606 OID 25699)
-- Name: applications applications_fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_student FOREIGN KEY (id) REFERENCES public.student(id);


--
-- TOC entry 3249 (class 2606 OID 25662)
-- Name: follows follows_fk_degree; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


--
-- TOC entry 3250 (class 2606 OID 25657)
-- Name: follows follows_fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_fk_student FOREIGN KEY (id) REFERENCES public.student(id);


--
-- TOC entry 3251 (class 2606 OID 25675)
-- Name: passed passed_fk_career; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passed
    ADD CONSTRAINT passed_fk_career FOREIGN KEY (career_id) REFERENCES public.career(id);


--
-- TOC entry 3252 (class 2606 OID 25670)
-- Name: passed passed_fk_student; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.passed
    ADD CONSTRAINT passed_fk_student FOREIGN KEY (id) REFERENCES public.student(id);


--
-- TOC entry 3253 (class 2606 OID 25687)
-- Name: proposals proposals_fk_teacher; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.proposals
    ADD CONSTRAINT proposals_fk_teacher FOREIGN KEY (supervisor_id) REFERENCES public.teacher(id);


--
-- TOC entry 3248 (class 2606 OID 25639)
-- Name: student student_fk_degree; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


-- Completed on 2023-11-10 19:00:27 CET

--
-- PostgreSQL database dump complete
--

