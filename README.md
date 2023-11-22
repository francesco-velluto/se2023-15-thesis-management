# Thesis Management System

The Thesis Management System is a web application that allows students to submit their thesis proposals and faculty to review and approve them.

## [ Release 1 ] Instructions for install and boot the application in docker

### 0) Prerequisites

- Make sure you have [Git](https://git-scm.com/downloads) installed.
- Make sure you have [Postgres](https://www.postgresql.org/download/) installed.
- Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.
- Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed.

### 1) Get Docker Compose files from the GitHub repository

The Thesis Management System application is composed of three fundamental parts:
- the frontend server
- the backend server
- the database server

Each one of these parts is a Docker image that can be built and run independently.

However, to simplify the process, we provide a Docker Compose file that allows you to compose and run the full application at once.

To get the Docker Compose file, clone the GitHub repository with the following command:

```bash
git clone https://github.com/francesco-velluto/se2023-15-thesis-management.git
```

Then go to the project root folder with the following command:

```bash
cd se2023-15-thesis-management
```

### 2) Create a .env file with these informations in the root directory

The .env file is not provided in the GitHub repository because it can contain sensitive information.

You must manually create a .env file in the root directory of the project and fill it with the following information:

```
REACT_APP_BACKEND_SERVER_PORT=the port on which the backend server will run
FRONTEND_PORT=the port on which the frontend server will run
DB_PASSWORD=the password of the database user
DB_USER=the username of the database user
DB_HOST=the host of the database server (must equal to db)
```

Please note that the database server must be running on the same machine as the application on port 5432.

### 3) Get the Docker images and Compose the application

The images for the application components are provided in the Docker Hub repository.

To get the images and compose the application, run the following command:

```bash
docker compose up -d
```

Wait for all the application components to be up and running.

### 4) Access the application

The application is now running on the port specified in the .env file.

To access the application, open a browser and go to the following URL:

```
http://localhost:FRONTEND_PORT
```

where FRONTEND_PORT is the port specified in the .env file.

## Create a .env file with these informations in the root directory

```
REACT_APP_BACKEND_SERVER_PORT=
FRONTEND_PORT=
DB_PASSWORD=
DB_USER=
DB_HOST=
REACT_APP_API_PORT=
```

NOTE : The variable `REACT_APP_API_PORT` is used to set the port of the backend server in the frontend application.
It must be the same value as `BACKEND_SERVER_PORT` variable.

## Starting using docker
Make sure you have [Docker Compose](https://docs.docker.com/compose/install/) installed.

Modify `.env` file :
``` 
DB_HOST=db
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
