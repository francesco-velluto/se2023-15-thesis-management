import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";

import ApplicationsAPI from "../api/ApplicationsAPI";

import "../style/StudentApplications.css";
import { LoggedUserContext } from "../context/AuthenticationContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function StudentApplicationsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);

    const { loggedUser } = useContext(LoggedUserContext);

    useEffect(() => {
        try {
            ApplicationsAPI.getAllApplicationsByStudent(loggedUser.id)
                .then(applicationsList => {
                    setApplications(applicationsList);
                    setIsLoading(false);
                })
                .catch(err => {
                    setError(err[0]);
                    setIsLoading(false);
                });
        } catch (err) {
            console.error('[FRONTEND ERROR] Error in get student application list: ' + err[0]);
            setError(err[0]);
            setIsLoading(false);
        }
    }, []);

    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Student's Applications"} />
            <Container className={"justify-content-center student-applications-container"}>
                {isLoading ? (
                    <Row className={"justify-content-center"}>
                        <Col>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </Col>
                    </Row>
                ) : (
                    error ? (
                        <Row className={"justify-content-center"}>
                            <Col>
                                <Alert variant='danger'>{error}</Alert>
                            </Col>
                        </Row>
                    ) : applications && (
                        applications.map((application, index) =>
                            <Row key={index} className={"justify-content-center student-application-row"}>
                                <Col lg={7}>
                                    <Card text={"light"}
                                        bg={application.status === "Accepted" ? 'success' : (application.status === "Rejected" ? 'danger' : (application.status === "Pending" ? 'secondary' : 'dark'))}
                                    >
                                        <Card.Header>
                                            {application.status === "Accepted" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
                                                (application.status === "Canceled" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> :
                                                    (application.status === "Pending" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                                    )
                                                )
                                            } <b>{application.status}</b>
                                        </Card.Header>
                                        <Card.Body className={"student-application-card-body"}>
                                            <Card.Title>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg> {application.title}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> {application.supervisor_surname} {application.supervisor_name}
                                            </Card.Subtitle>
                                            <Card.Text>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> You applied on <i>{dayjs(application.application_date).format('dddd, DD MMMM YYYY')}</i>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )
                    )
                )}
            </Container>
        </>
    );
}

export default StudentApplicationsPage;