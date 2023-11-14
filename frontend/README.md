# Thesis Management System Frontend Server

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

- ### getAllProposals
    It is used to get all the proposals referred to the degree attended by the logged Student.

    - Parameters: none
    - Return value:

        ```javascript
        {proposals: [
            {
                proposal_id: "P002",
                title: "Machine Learning",
                supervisor_surname: "Wilson",
                supervisor_name: "Michael",
                keywords: [
                    "Machine learning",
                    "AI"
                ],
                type: "Master",
                groups: [
                    "Group B"
                ],
                description: "Proposal description",
                required_knowledge: "Python, TensorFlow",
                notes: "N/A",
                expiration_date: "2024-06-29T22:00:00.000Z",
                level: "Graduate",
                degrees: [
                    "Master of Science"
                ]
            },
            {
                ...
            },...
            ]
        }
        ```
        It can also return an error in case of failure on backend side.

- ### getProposalById
    It is used to get a proposal specifying his Id.
    
    - Parameters: proposal_id
    - Return value:

        ```javascript
        {
            supervisor_name: "Sarah",
            supervisor_surname: "Anderson",
            proposal_id: "P001",
            title: "Web Development",
            supervisor_id: "T001",
            keywords: [
                "Web",
                "Development"
            ],
            type: "Bachelor",
            groups: [
                "Group A"
            ],
            description: "A web development project description.",
            required_knowledge: "HTML, CSS, JavaScript",
            notes: "No special notes.",
            expiration_date: "2023-12-30T23:00:00.000Z",
            level: "Undergraduate",
            programmes: [
                {
                cod_degree: "BSC001",
                title_degree: "Bachelor of Science"
                }
            ]
       }
        ```
        It can also return an error in case of failure on backend side.

- ### insert


## Pages

All pages are in the `src/pages` folder. The pages are placed in different files based on the resource they are related to.

### HomePage

The home page is in `src/pages/HomePage.js`.

### LoginPage

The login page is in `src/pages/LoginPage.js`.
