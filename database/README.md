# Thesis Management System Database Schema

The database is designed using PostgreSQL.

## Schema Overview

The database schema consists of the following tables:

1. `degree`: Stores information about academic degrees offered.
2. `student`: Stores student information including their personal details, enrolled degree, and enrollment year.
3. `teacher`: Stores information about the teachers.
4. `career`: Stores academic career information such as courses, grades, and completion dates.

These first fours tables, can not be changed and are only use in READ mode.

5. `users`: Stores user login information along with their role in the system.
6. `follows`: Represents the relationship between students and the degrees they follow.
7. `passed`: Stores information about the careers that students have successfully passed.
8. `thesis`: Stores details about the theses available in the system, including their titles, supervisors, keywords, descriptions, and other relevant information.
9. `applications`: Manages the applications submitted by students for different theses, including the application status and date.

## Usage

To use the schema, you can either execute the SQL script in a PostgreSQL database environment.
Refers to Office-Queue-Management documentation.
