import React, { useEffect, useState } from 'react';
import { Container } from "react-bootstrap";
import { getAllApplicationsByTeacher } from '../api/ApplicationsAPI';

function ApplicationList() {
    const [applications, setApplications] = useState([]);

    useEffect(() => {
        getAllApplicationsByTeacher()
            .then((applicationsList) => setApplications(applicationsList))
            .catch(err => console.log(err));

    }, []);

    console.log(applications);

    return (
        <Container>

        </Container>
    );
}

export default ApplicationList;