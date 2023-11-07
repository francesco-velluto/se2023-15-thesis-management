# Thesis Management System

The Thesis Management System is a web application that allows students to submit their thesis proposals and faculty to review and approve them.

## Create a .env file with these informations

```
BACKEND_SERVER_PORT=
FRONTEND_PORT=
DB_PASSWORD=
DB_USER=
```

## Starting using docker
Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed.

Modify the file `./backend/service/db.js`, replace 
``` 
 host: 'localhost',
```
by
```
 host: 'db',
```
Run the command 
``` 
docker compose up -d
```
Here you are ! :) 

NOTE :
To list all containers :
```
docker ps -a
```
To list all images :
```
docker image ls 
```

## Installation and Booting

### Backend server

Go to the `backend` folder with the following command:

```bash
cd backend
```

From this folder, run the following commands:

```bash
npm install
npm start
```

This will install all the dependencies and start the server on port 8080.

Please refer to the [README.md](backend/README.md) in the `backend` folder for more details about the development mode, testing, code coverage, and API documentation.

### Frontend server

Go to the `frontend` folder with the following command:

```bash
cd frontend
```

From this folder, run the following commands:

```bash
npm install
npm start
```

This will install all the dependencies and start the server on port 3000.

Please refer to the [README.md](frontend/README.md) in the `frontend` folder for more details about and API interface, pages and components.
