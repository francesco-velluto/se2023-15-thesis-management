# Thesis Management System Backend Server

## Installation and Booting
From this folder, run the following commands:
```bash
npm install
npm start
```
This will install all the dependencies and start the server on port 8080.

### Configuration

A configuration file is present in `src/config.json`. 
Currently it contains the following configuration options:
- `BACKEND_SERVER_PORT`: Port on which the backend server will run

### Starting the server in development mode
```bash
npm run dev
```
This will start the server in development mode using _nodemon_, which will automatically restart the server when any changes are made to the source code.

## Testing
To run the tests, run the following command:
```bash
npm test
```
This will run all the tests in the `tests` folder.

Other tests can be added in the `tests` folder. The test files should be named as `*.unit.test.js`.
They will be automatically picked up by the test runner when running the above command.

## Code Coverage
To generate the code coverage report, run the following command:
```bash
npm run coverage
```
This will generate a code coverage report in the `coverage` folder.

## API Documentation
_TODO:_ Please note that the following documentation is just an example, change if needed.

### Authentication

#### Login

POST `/api/authentication/login`
- Request Query Parameters: _none_
- Request Body:
  - `username`: Username of the user
  - `password`: Password of the user
- `SUCCESS 200` Response Body:
  - `token`: token to be used for authentication in subsequent requests
- Errors:
  - `ERROR 400` Response Body: `{"error": "Missing username or password"}`
  - `ERROR 401` Response Body: `{"error": "Invalid username or password"}`
  - `ERROR 500` Response Body: `{"error": "Internal Server Error"}`

### Proposals

#### Get all proposals

**GET** `/api/proposals`
- Get all the thesis proposals related to the same degree of the student
- Authentication: required
- Authorization: only a student can see all the proposals related to his degree 
- Request Query Parameters: _none_
- Request Body: _none_
- `SUCCESS 200` Response Body:
  - `proposals`: Array of proposals. Each proposal has  the following attributes:
    - `proposal_id` : ID of the proposal
    - `title` : Title of the proposal
    - `supervisor_surname` : Surname of the supervisor
    - `supervisor_name` : Name of the supervisor
    - `keywords` : Array of keywords
    - `type` : Type of the proposal (Bachelor or Master)
    - `groups` : Array of groups of teachers of the proposal
    - `description` : Description of the proposal
    - `required_knowledge` : Required knowledge for the proposal
    - `level` : Level of the proposal
    - `degrees` : Array of degrees for the proposal
- Errors:
  - `ERROR 500` Response Body: `{"error": "Internal Server Error"}`
  - `ERROR 401` Response Body: `{"error": "Must be authenticated to make this request!"}`

**POST** `/api/proposals`
- Insert a new thesis proposal
- Authentication: required
- Authorization: only a professor can access this endpoint
- Request Query Parameters: _none_
- Request Body:

  | Field name | Type | Required* | Description |
  | ----------- | ----------- | ----------- | ----------- |
  | `title` | _string_ | Yes | Title of the proposal |
  | `keywords` | _string[]_ | Yes | Keywords related to the proposal |
  | `type` | _string_ | Yes | Type of thesis (e.g. research, experimental...) |
  | `groups` | _string[]_ | Yes | List of research groups related to the thesis proposal |
  | `description` | _string_ | Yes | Description of the activities of the thesis |
  | `required_knowledge` | _string_ | No | Description of the knowledge required for the thesis |
  | `notes` | _string_ | No | Additional notes by the professor |
  | `expiration_date` | _string_ | Yes | Date in ISO 8601 format YYYY-MM-DD |
  | `level` | _string_ | Yes | Level of the thesis (e.g. Bachelor, Master) |
  | `programmes` | _string[]_ | Yes | Programmes related to the thesis |

  \* ***Required*** means that the field cannot be undefined or empty (e.g. empty array or empty string)

- `SUCCESS 201` Response Body:
  - `proposal`: Object representing the inserted proposal. All the fields are the same of the request body, but there is an additional field which represents the id of the proposal and the supervisor_id field which represents the id of the teacher supervisor of the thesis.\
    - `id` | string: ID of the proposal
    - `supervisor_id` | string: ID of the teacher supervisor
    - ...

- Errors:
  - `ERROR 401` Response Body: `{ "error": "Not authenticated" }`
  - `ERROR 401` Response Body: `{ "error": "Not authorized" }`
  - `ERROR 422` Response Body: `{ "error": <message that specifies the validation error> }`
  - `ERROR 500` Response Body: `{"error": "Internal Server Error" }`

**GET** `/api/proposals/:proposal_id`
- Retrieve a proposal by its id
- Authentication: required
- Authorization: both students and professors can access this endpoint
- Request Query Parameters: 
  - `proposal_id`: id of the proposal
- Request Body: _none_
- `SUCCESS 200` Response Body:

  | Field name           | Type | Required* | Description                                                             |
  |----------------------| ----------- | ----------- |-------------------------------------------------------------------------|
  | `title`              | _string_ | Yes | Title of the proposal                                                   |
  | `supervisor_name`    | _string_ | Yes | Name of the supervisor of the proposal                                  |
  | `supervisor_surname` | _string_ | Yes | Surname of the supervisor of the proposal                               |
  | `keywords`           | _string[]_ | Yes | Keywords related to the proposal                                        |
  | `type`               | _string_ | Yes | Type of thesis (e.g. research, experimental...)                         |
  | `groups`             | _string[]_ | Yes | List of research groups related to the thesis proposal                  |
  | `description`        | _string_ | Yes | Description of the activities of the thesis                             |
  | `required_knowledge` | _string_ | No | Description of the knowledge required for the thesis                    |
  | `notes`              | _string_ | No | Additional notes by the professor                                       |
  | `expiration_date`    | _string_ | Yes | Date in ISO 8601 format YYYY-MM-DD                                      |
  | `level`              | _string_ | Yes | Level of the thesis (e.g. Bachelor, Master)                             |
  | `programmes`         | _[]_ | Yes | Programmes related to the thesis, both with cod_degree and degree_title |
- Errors:
  - `ERROR 401` Response Body: `{ "error": "Not authenticated" }`
  - `ERROR 404` Response Body: `{ "error": "Proposal not found" }`
  - `ERROR 500` Response Body: `{ "error": "Internal Server Error" }`


### Teachers

**GET** `/api/teachers`
- Retrieve the list of teachers
- Authentication: required
- Authorization: both students and professors can access this endpoint
- Request Query Parameters: _none_
- Request Body: _none_

- `SUCCESS 200` Response Body:
  - `teachers`: array of objects with the following fields

    | Field name | Type | Description |
    | ----------- | ----------- | ----------- |
    | `id` | _string_ | Id of the teacher |
    | `name` | _string_ | Name of the teacher |
    | `surname` | _string_ | Surname of the teacher |
    | `email` | _string_ | Email of the teacher |
    | `cod_group` | _string_ | Code of the group that the teacher belongs to |
    | `cod_department` | _string_ | Code of the department that the teacher belongs to |

- Errors:
  - `ERROR 401` Response Body: `{ "error": "Not authenticated" }`
  - `ERROR 500` Response Body: `{"error": "Internal Server Error" }`

### Degrees

**GET** `/api/degrees`
- Retrieve the list of programmes
- Authentication: required
- Authorization: both students and professors can access this endpoint
- Request Query Parameters: _none_
- Request Body: _none_

- `SUCCESS 200` Response Body:
  - `degrees`: array of objects with the following fields

    | Field name | Type | Description |
    | ----------- | ----------- | ----------- |
    | `cod_degree` | _string_ | Id code of the degree |
    | `title_degree` | _string_ | Title of the degree |

- Errors:
  - `ERROR 401` Response Body: `{ "error": "Not authenticated" }`
  - `ERROR 500` Response Body: `{"error": "Internal Server Error" }`


### Applications

**POST** `/api/applications`
- Insert a new application
- Authentication: required
- Authorization: only a student can access this endpoint
- Request Query Parameters: _none_
- Request Body:

  | Field name | Type | Required* | Description |
  | ----------- | ----------- | ----------- | ----------- |
  | `proposal_id` | _string_ | Yes | ID of the proposal |

- `SUCCESS 200`
- Errors:
 - `ERROR 500` Response Body: `{"error": "Student/Proposal not found or already applied" }`

**PUT** `/api/applications/:application_id`
- Set the status of an application to "Accepted" or "Rejected".
The others pending applications relative to the same proposal are set to "Canceled".
The proposal is archived.

- Authentication: required
- Authorization: only a teacher can accept or reject an application
- Request query parameters:
  - `application_id`: the id of the application
- Request body:

  | Field name | Type | Required* | Description |
  | ----------- | ----------- | ----------- | ----------- |
  | status | _string_ | Yes | New status: can only be `Accepted` or `Rejected`

- `Success 200`  Response body:
  - The application modified with the new status:
    - `proposal_id`: id of the thesis
    - `id`: id of the student
    - `status`: status updated
    - `application_date`: date of the application

- `Error`:
  - `400`: Error in the parameters:
    - New status is something different from "Accepted" or "Rejected"
    - The application_id corresponds to a non-existing proposal or to a proposal not belonging to the teacher.
  - `401`: Not authenticated or not authorized
  - `500`: Internal server error

**GET** `api/applications/application/:application_id`
- Get an application given its id

- Authentication: required
- Authorization: must be a teacher
- Request query parameters:
  - `application_id`: the id of the application
- Request body: _none_

- `Success 200`  Response body:
  - The application:
    - `proposal_id`: id of the thesis
    - `id`: id of the student
    - `status`: status updated
    - `application_date`: date of the application

- `Error`:
  - `404`: Application not found
  - `401`: Not authenticated or not authorized
  - `500`: Internal server error

### Students

**GET** `/api/students/student_id`

- Get the info of a student given its id

- Authentication: required
- Authorization: must be a teacher to get student info
- Request query parameters:
  - `student_id`: the id of the student
- Request body: _none_

- `Success 200`  Response body:
  - The student:
    - `id`: id of the student
    - `surname`: surname of the student
    - `name`: name of the student
    - `gender`: gender of the student
    - `nationality`: nationality of the student
    - `email`: email of the student
    - `cod_degree`: id of the degree attended by the student
    - `enrollment_year`: enrollement year of the student
    - `role`: the role of the student is 1

- `Error`:
  - `404`: Student not found
  - `401`: Not authenticated or not authorized
  - `500`: Internal server error

