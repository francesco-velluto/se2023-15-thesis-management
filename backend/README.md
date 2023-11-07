# Thesis Management System Backend Server

## .env file 
```
BACKEND_SERVER_PORT=
FRONTEND_PORT=
DB_PASSORWORD=
DB_USER=
```

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

## Using Docker 

### Docker-compose
Make sure you have [Docker compose](https://docs.docker.com/compose/install/) installed.



### Backend 
To start only the backend :
```
cd backend 
docker build . -t backend-image
docker run -d --env-file .env --name backend -p 127.0.0.1:<BACKEND_SERVER_PORT>:<BACKEND_SERVER_PORT> backend-image
```
Replace <BACKEND_SERVER_PORT> by the value in `.env` . 


To check that everything is working : 
```
docker logs backend 
```

NOTE :
If you need to run again the container dont forget to first stop and remove the previous "backend" container.
```
docker stop backend 
docker rm backend 
```
To list all containers :
```
docker ps -a
```
To list all images :
```
docker image ls 
```

### Frontend 


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

GET `/api/proposals`
- Request Query Parameters: _none_
- Request Body: _none_
- `SUCCESS 200` Response Body:
  - `proposals`: Array of proposals. Each proposal has the following attributes:
    - `id`: ID of the proposal
    - `title`: Title of the proposal
    - ...
- Errors:
  - `ERROR 500` Response Body: `{"error": "Internal Server Error"}`