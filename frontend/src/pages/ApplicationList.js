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

            <TitleBar/>
            <Container >
                <Row>
                    <Col className='d-flex justify-content-center align-items-center'>
                    {errors?.map((error, index) => (
                        <Alert variant='danger'
                            className='w-50 mt-3'
                            dismissible={true}
                            onClose={() => setErrors(undefined)}
                            key={index}>
                            {error}
                        </Alert>
                    ))}
                    </Col>
                    
                </Row>

                <Row className='browse-application'>
                    {loading ? (
                        <Row>
                        <Col className="d-flex flex-column justify-content-center align-items-center mt-5">
                          <Spinner animation="border" className="loadingSpinner" />
                          <span className="mt-3 loadingText">Loading...</span>
                        </Col>
                      </Row>
                    ) : (
                        <>
                            <Accordion alwaysOpen>
                                {applications && applications.length > 0 &&
                                    applications.map((proposal) => (
                                        <Accordion.Item key={proposal.proposal_id}
                                            eventKey={proposal.proposal_id.toString()}>
                                            <Accordion.Header>{proposal.title}</Accordion.Header>
                                            <Accordion.Body>
                                                {proposal.applications.map((application) => (
                                                    <Card key={application.application_id} className='my-3'>
                                                        <Card.Body>
                                                            <Row className="align-items-center">
                                                                <Col xs={12} sm={6}>
                                                                    <strong>
                                                                        {application.name} {application.surname}
                                                                    </strong>
                                                                    {' '} has applied for this thesis on {formattedDate(application.application_date)}
                                                                </Col>
                                                                <Col xs={12} sm={6} className="text-end mt-2 mt-sm-3 mt-sm-0 d-flex justify-content-center align-items-start d-sm-block">
                                                                    <Button variant="outline-secondary" className='text-end show-details-btn'
                                                                        onClick={()=>navigate(`/applications/${application.application_id}`)}>
                                                                            Show details
                                                                    </Button>
                                                                </Col>
                                                            </Row>


                                                        </Card.Body>
                                                    </Card>
                                                ))}
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))}
                            </Accordion>
                            {
                              !loading && (!errors || errors.length === 0) && applications && applications.length === 0 &&
                              <Card className='my-3 fs-5 w-75 text-center' >
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