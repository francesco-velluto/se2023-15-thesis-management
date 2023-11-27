import React, { useEffect, useState } from 'react';
import { Accordion, Alert, Card, Container, Row, Col, Spinner, Button } from "react-bootstrap";
import { getAllApplicationsByTeacher } from '../api/ApplicationsAPI';
import { format } from 'date-fns';
import NavbarContainer from '../components/Navbar';
import TitleBar from '../components/TitleBar';
import { useNavigate } from 'react-router-dom';

function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [errors, setErrors] = useState(undefined);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <Row >
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
                                {applications && applications.length > 0 &&
                                    applications.map((proposal, index) => (
                                        <Accordion.Item key={index} eventKey={index.toString()}>
                                            <Accordion.Header>{proposal.title}</Accordion.Header>
                                            <Accordion.Body>
                                                {proposal.applications.map((application, index) => (
                                                    <Card key={index} className='my-3'>
                                                        <Card.Body>
                                                            <Row className="align-items-center">
                                                                <Col>
                                                                    <strong>
                                                                        {application.name} {application.surname}
                                                                    </strong>
                                                                    {' '} has applied for this thesis on {formattedDate(application.application_date)}
                                                                </Col>
                                                                <Col className="text-end">
                                                                    <Button variant="outline-secondary" className='text-end' onClick={()=>navigate(`/applications/${application.application_id}`)}>Show details</Button>
                                                                </Col>
                                                            </Row>


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