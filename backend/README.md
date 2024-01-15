# Thesis Management System Backend Server

## Installation and Booting
From this folder, run the following commands:
```bash
npm install
npm start
```
This will install all the dependencies and start the server on port 8080.

### Starting the server in development mode
```bash
npm run dev
```
This will start the server in development mode using _nodemon_, which will automatically restart the server when any changes are made to the source code.

## Local database rebuild
To rebuild your local database and align it to the one defined in the .sql file with the updated data, run the following command:
```bash
npm run dbrebuild
```

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

## Email Notifications Integration

### Configuration

The email notifications are sent using the SMTP protocol.

The application sends an SMTP request to the SMTP server and provides information about the email to be sent, in particular:

- the sender address
- the recipient address
- the subject
- the html content

The SMTP server is configured in the `.env` file.

In particular, the SMTP Username is also used as the sender address.

The SMTP server used for testing is [Elastic Email](https://elasticemail.com/).

## Crono Jobs

The server supports the scheduling and execution of cron jobs.

The crono module is run in a separate process from the main server process.

This will allow the server to continue to run even if the crono module crashes.

## API Documentation

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
    - `proposal_id` | string: ID of the proposal
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

  | Field name           | Type | Description                                                             |
  |----------------------| ----------- |-------------------------------------------------------------------------|
  | `title`              | _string_ | Title of the proposal                                                   |
  | `supervisor_name`    | _string_ | Name of the supervisor of the proposal                                  |
  | `supervisor_surname` | _string_ | Surname of the supervisor of the proposal                               |
  | `keywords`           | _string[]_ | Keywords related to the proposal                                        |
  | `type`               | _string_ | Type of thesis (e.g. research, experimental...)                         |
  | `groups`             | _string[]_ | List of research groups related to the thesis proposal                  |
  | `description`        | _string_ | Description of the activities of the thesis                             |
  | `required_knowledge` | _string_ | Description of the knowledge required for the thesis                    |
  | `notes`              | _string_ | Additional notes by the professor                                       |
  | `expiration_date`    | _string_ | Date in ISO 8601 format YYYY-MM-DD                                      |
  | `level`              | _string_ | Level of the thesis (e.g. Bachelor, Master)                             |
  | `programmes`         | _[]_ | Programmes related to the thesis, both with cod_degree and degree_title |
- Errors:
  - `ERROR 401` Response Body: `{ "error": "Not authenticated" }`
  - `ERROR 404` Response Body: `{ "error": "Proposal not found" }`
  - `ERROR 500` Response Body: `{ "error": "Internal Server Error" }`

**GET** `/api/proposals/professor`
- Retrieve a proposal belonging to the authenticated professor
- Authentication: required
- Authorization: only professors can access this endpoint
- Request Query Parameters: none
- Request Body: _none_
- `SUCCESS 200` Response Body: Array of proposal objects with the following fields

  | Field name           | Type | Description                                                             |
  |----------------------| ----------- |-------------------------------------------------------------------------|
  | `proposal_id`        | _string_ | Id of the proposal                                                   |
  | `title`              | _string_ | Title of the proposal                                                   |
  | `supervisor_name`    | _string_ | Name of the supervisor of the proposal                                  |
  | `supervisor_surname` | _string_ | Surname of the supervisor of the proposal                               |
  | `keywords`           | _string[]_ | Keywords related to the proposal                                        |
  | `type`               | _string_ | Type of thesis (e.g. research, experimental...)                         |
  | `groups`             | _string[]_ | List of research groups related to the thesis proposal                  |
  | `description`        | _string_ | Description of the activities of the thesis                             |
  | `required_knowledge` | _string_ | Description of the knowledge required for the thesis                    |
  | `notes`              | _string_ | Additional notes by the professor                                       |
  | `expiration_date`    | _string_ | Date in ISO 8601 format YYYY-MM-DD                                      |
  | `level`              | _string_ | Level of the thesis (e.g. Bachelor, Master)                             |
  | `degrees`         | _[]_ | Programmes related to the thesis, both with cod_degree and degree_title |

- Errors:
  - `ERROR 401` Response Body: `{ errors: ['Must be authenticated to make this request!'] }`
  - `ERROR 401` Response Body: `{ errors: ["Not authorized"] }`
  - `ERROR 404` Response Body: `{ "error": "Proposals not found" }`
  - `ERROR 500` Response Body: `{ "error": "Internal Server Error" }`

**PUT** `/api/proposals/:proposal_id`
- Update an existing thesis proposal
- Authentication: required
- Authorization: only the teacher supervisor of the thesis can access this endpoint
- Request Query Parameters: proposal_id
- Request Body:

  | Field name | Type | Required* | Description |
  | ----------- | ----------- | ----------- | ----------- |
  | `title` | _string_ | Yes | Title of the proposal |
  | `keywords` | _string[]_ | Yes | Keywords related to the proposal |
  | `type` | _string_ | Yes | Type of thesis (e.g. research, experimental...) |
  | `description` | _string_ | Yes | Description of the activities of the thesis |
  | `required_knowledge` | _string_ | No | Description of the knowledge required for the thesis |
  | `notes` | _string_ | No | Additional notes by the professor |
  | `expiration_date` | _string_ | Yes | Date in ISO 8601 format YYYY-MM-DD |
  | `level` | _string_ | Yes | Level of the thesis (e.g. Bachelor, Master) |
  | `programmes` | _string[]_ | Yes | Programmes related to the thesis |

  \* ***Required*** means that the field cannot be undefined or empty (e.g. empty array or empty string)

- `SUCCESS 200` Response Body:
  - `proposal`: Object representing the inserted proposal.
    - `proposal_id` | string: ID of the proposal
    - `supervisor_id` | string: ID of the teacher supervisor
    - ...

- Errors:
  - `ERROR 400` If the proposal_id in the body differs from the proposal_id in parameters
  - `ERROR 401` If the user is not authenticated or not a teacher
  - `ERROR 403` If the user is a teacher but the proposal does not belong to them
  - `ERROR 404` If the proposal with the specified proposal_id does not exist
  - `ERROR 422` If the is an error in the validation of the request body fields
  - `ERROR 500` Internal Server Error


**DELETE** `/api/proposals/:proposal_id/archive`
- Archive a proposal
- Authentication: required
- Authorization: only the teacher supervisor of the thesis can access this endpoint
- Request Query Parameters: proposal_id
- Request Body: _none_
- `SUCCESS 202` Response Body: _none_
- Errors:
  - `ERROR 400` If the proposal doesn't exist
  - `ERROR 401` If the user is not the teacher supervisor of the thesis
  - `ERROR 403` If the proposal is expired or already archived or already deleted or accepted
  - `ERROR 404` If the proposal with the specified proposal_id does not exist
  - `ERROR 500` Internal Server Error


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

#### For a student get all applications

**GET** `/api/applications/:student_id`

- Get all the applications of a student
- Authentication: required
- Authorization: only a student can access this endpoint
- Request Query Parameters: _none_
- Request Body: _none_
- `SUCCESS 200` Response Body:
  - Array of applications. Each application has the following attributes:
    - `proposal_id` : ID of the proposal
    - `student_id` : ID of the student
    - `title` : Title of the proposal
    - `supervisor_surname` : Surname of the supervisor
    - `supervisor_name` : Name of the supervisor
    - `status` : Status of the application (e.g. accepted, rejected, pending, canceled)
    - `application_date` : Date of the application when the student applied
- Errors:
  - `ERROR 500` Response Body: `{"error": "Internal Server Error"}`
  - `ERROR 401` Response Body: `{"error": "Must be authenticated to make this request!"}`
  - `ERROR 401` Response Body: `{"error": "Must be a student to make this request!"}`
  - `ERROR 401` Response Body: `{"error": "You cannot get applications of another student"}`
  - `ERROR 404` Response Body: `{"error": "Student not found"}`

#### Accept or reject applications

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

####  Browse a specific application to the teacher's proposals

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


#### For a teacher get all applications

***GET*** `api/applications`
- Get all aplications to his thesis proposals for a teacher

- Authentication: required
- Authorization: must be a teacher
- Request query parameters: _none_
- Request body: _none_

- `Success 200`  Response body:
  - `proposal_id`
  - `title`
  - `type`
  - `description`,
  - `expiration_date`,
  - `level`: level of the thesis,
  - applications:
    - `application_id`: number,
    - `status`: status of the application,
    - `application_date`,
    - `student_id`: is of the student who applied,
    - `surname`: surname of the student,
    - `name`: name of the student,
    - `email`: email of the student,
    - `enrollment_year`: year of enrollment of the student,
    - `cod_degree`: degree of the student

- `Error`
  - `401`: Not authenticated or not authorized
  - `404` Applications not found
  - `500` Internal Server Error

#### For a student apply to a thesis proposal

***POST*** `api/applications`
- Insert a new application for a thesis proposal

- Authentication: required
- Authorization: must be a student
- Request query parameters: _none_
- Request body:
    - proposal_id: number (ID of the thesis proposal)

- `Success 200` Response body:
  - `proposal_id`: id of the thesis
  - `student_id`: id of the student
  - `status`: status updated
  - `application_date`: date of the application
  - `title`: title of the thesis
  - `supervisor_name`: name of the supervisor
  - `supervisor_surname`

- `Error`
  - `400`: Bad Request, parameters not found in the request body
  - `401`: Not authenticated or not authorized (only students are authorized)
  - `500`: Internal Server Error

#### For a student retrieves his thesis request

***GET*** `api/proposals/requests`
- Retrieving all data about thesis reques related to a student

- Authentication: required
- Authorization: must be a student
- Request query parameters: _none_
- Request body: _none_

- `Success 200` Response body: 
    - `request_id`: id of the thesis request
    - `title`: title of the thesis request
    - `description`: description of the thesis request
    - `supervisor_id`: id of the teacher (supervisor for the thesis request)
    - `student_id`: id of the student
    - `co_supervisor_id`: id of the co supervisor for the thesis request
    - `approval_date`: date of the approval
    - `status`: status updated

- `Error`
  - `401`: Unauthorized - if the user is not logged in
  - `404`: Not Found - Thesis request not found for this logged student
  - `500`: Internal Server Error - if something went wrong

### For a student insert a thesis request

***POST*** `api/proposals/requests`
- Insert a new thesis request

- Authentication: required
- Authorization: must be a student
- Request query parameters: _none_
- Request body:
    - title
    - description
    - supervisor

- `Success 201` Response body:
  - `request_id`: id of the thesis request
  - `title`: title of the thesis request
  - `description`: description of the thesis request
  - `supervisor_id`: id of the teacher (supervisor for the thesis request)
  - `student_id`: id of the student
  - `co_supervisor_id`: id of the co supervisor for the thesis request
  - `approval_date`: date of the approval
  - `status`: status updated

- `Error`
  - `401` Unauthorized - if the user is not logged in
  - `403` Unauthorized - there is already a thesis request for the authenticated student
  - `404` Invalid teacher - teacher not found in the db
  - `422` Invalid body - invalid fields in request body
  - `500` Internal Server Error - if something went wrong

#### For a teacher retrieve all applications of a proposal

***GET*** `api/applications/proposals/:proposal_id`
- Retrieving all data about all applications related to a single proposal, defined by its proposal_id

- Authentication: required
- Authorization: must be a teacher
- Request query parameters: proposal_id
- Request body: _none_

- `Success 200` Response body: 
  - Array of applications each one containing these information:
    - `id`: application id
    - `proposal_id`: proposal id
    - `student_id`: student id
    - `status`: status of the application
    - `application_date`: when the application have been received by the server

- `Error`
  - `401`: Not authorized, the teacher cannot see applications to proposals which are not his
  - `404`: Proposal not found
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
