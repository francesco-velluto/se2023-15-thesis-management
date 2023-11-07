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

-- ROP DATABASE "Thesis-Management-System";
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

-- CREATE SCHEMA public;

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


ALTER TABLE public.degree OWNER TO postgres;


--
-- Name: Student; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.student (
    student_id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender CHAR(1),
    nationality VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_degree VARCHAR(10),
    enrollment_year INT
);


ALTER TABLE public.student OWNER TO postgres;

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


--
-- Name: Teachers; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.teacher (
    teacher_id VARCHAR(10) PRIMARY KEY,
    surname VARCHAR(50) NOT NULL,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    cod_group VARCHAR(10),
    cod_department VARCHAR(10)
);

ALTER TABLE public.teacher OWNER TO postgres;


--
-- Name: Careers; Type: TABLE; Schema: public; Owner: postgres
-- CANNOT BE CHANGED
--

CREATE TABLE public.career (
    id VARCHAR(10) PRIMARY KEY,
    cod_course VARCHAR(10),
    title_course VARCHAR(50) NOT NULL,
    cfu INT NOT NULL,
    grade INT NOT NULL,
    date DATE NOT NULL
);

ALTER TABLE public.career OWNER TO postgres;

--
-- Name: in; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.follows (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(10) NOT NULL,
    cod_degree VARCHAR(10)
);

ALTER TABLE public.follows OWNER TO postgres;

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_fk_student FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.follows
    ADD CONSTRAINT follows_fk_degree FOREIGN KEY (cod_degree) REFERENCES public.degree(cod_degree);


--
-- Name: Follows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.passed (
    id SERIAL PRIMARY KEY,
    career_id VARCHAR(10),
    student_id VARCHAR(10)
    );


ALTER TABLE public.passed OWNER TO postgres;

ALTER TABLE ONLY public.passed
    ADD CONSTRAINT passed_fk_student FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.passed
    ADD CONSTRAINT passed_fk_career FOREIGN KEY (career_id) REFERENCES public.career(id);

--
-- Name: Thesis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.thesis (
    thesis_id VARCHAR(10) PRIMARY KEY,
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
    cds_programmes TEXT[]
);


ALTER TABLE public.thesis OWNER TO postgres;

ALTER TABLE ONLY public.thesis
    ADD CONSTRAINT thesis_fk_teacher FOREIGN KEY (supervisor_id) REFERENCES public.teacher(teacher_id);

--
-- Name: Applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.applications (
    application_id SERIAL PRIMARY KEY,
    thesis_id VARCHAR(10) NOT NULL,
    student_id VARCHAR(10) NOT NULL,
    status VARCHAR(255) NOT NULL, 
    application_date DATE
);


ALTER TABLE public.applications OWNER TO postgres;

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_student FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.applications
    ADD CONSTRAINT applications_fk_thesis FOREIGN KEY (thesis_id) REFERENCES public.thesis(thesis_id);


--
-- PostgreSQL database dump complete
--

