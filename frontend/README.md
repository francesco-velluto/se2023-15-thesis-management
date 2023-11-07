# Thesis Management System Frontend Server

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
From this folder, run the following commands:
```bash
npm install
npm start
```

This will install all the dependencies and start the server on port 3000.

## API Interface

All API interfaces are in the `src/api` folder. The API interfaces are placed in different files based on the resource they are related to.

A config file is present in `src/api/config.js` which contains the base URL of the backend server.
This can be changed if the backend server is running on a different port.
Also, the config file contains the headers to be sent with each request. Currently, it contains the `Content-Type` header.

### API Usage

The API interfaces can be used in the following way using then/catch:
```javascript
import AuthenticationAPI from "../api/AuthenticationAPI";

const fetchLogin = () => {
    AuthenticationAPI.login('admin', 'admin')
        .then(async response => {
            let data = await response.json();

            if (response.ok) {
                console.log("token: " + data.token);
            } else {
                console.error("error: " + data.error);
            }
        })
        .catch(error => {
            console.error("error in fetch login: " + error);
        });
};
```

## Pages

All pages are in the `src/pages` folder. The pages are placed in different files based on the resource they are related to.

### HomePage

The home page is in `src/pages/HomePage.js`.

### LoginPage

The login page is in `src/pages/LoginPage.js`.
