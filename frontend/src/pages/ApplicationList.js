import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Card, Container, Row, Spinner } from "react-bootstrap";
import { getAllApplicationsByTeacher } from '../api/ApplicationsAPI';
import { format } from 'date-fns';
import MyNavbar from './Navbar';
import NavbarContainer from '../components/Navbar';
import TitleBar from '../components/TitleBar';

function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [errors, setErrors] = useState(undefined);
    const [loading, setLoading] = useState(true);

    const formattedDate = (date) => {
        return format(new Date(date), "EEEE, MMMM do yyyy")
    }

    useEffect(() => {
        getAllApplicationsByTeacher()
            .then(applicationsList => {
                setApplications(applicationsList);
                setLoading(false);
            })
            .catch(err => {
                setErrors(err);
                setLoading(false);
            });

    }, []);

    return (
        <>
            <NavbarContainer />

            <TitleBar title={"Browse Applications"} />
            <Container>
                <Row className='mt-2'>
                    {errors?.map((error, index) => (
                        <Alert variant='danger'
                            dismissible={true}
                            onClose={() => setErrors(undefined)}
                            key={index}>
                            {error}
                        </Alert>
                    ))}
                </Row>

                <Row className='browse-application'>
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        <>
                            <Accordion alwaysOpen>
                                {applications && Object.keys(applications).length > 0 &&
                                    Object.keys(applications).map((key, index) => (
                                        <Accordion.Item key={index} eventKey={index.toString()}>
                                            <Accordion.Header>{applications[key][0].title}</Accordion.Header>
                                            <Accordion.Body>
                                                {applications[key].map((proposal, index) => (
                                                    <Card key={index} className='my-3'>
                                                        <Card.Body>
                                                            <strong>
                                                                {proposal.name} {proposal.surname}
                                                            </strong>
                                                            {' '} has applied for this thesis on {formattedDate(proposal.application_date)}
                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                            </Accordion>
                            {(applications === undefined || Object.keys(applications).length === 0) &&
                                <Card className='my-3 fs-5'>
                                    <Card.Body>
                                        No applications were found for your thesis proposals!
                                    </Card.Body>
                                </Card>
                            }
                        </>
                    )}
                </Row>
            </Container>
        </>
    );
}

export default ApplicationList;