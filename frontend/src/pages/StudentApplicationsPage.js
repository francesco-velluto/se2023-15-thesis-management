import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";
import { Alert, Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { fetchFileInfo } from '../api/ApplicationsAPI';
import { useNavigate } from "react-router-dom";

import ApplicationsAPI from "../api/ApplicationsAPI";

import { LoggedUserContext } from "../context/AuthenticationContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { AiOutlineFilePdf, AiOutlineSearch} from 'react-icons/ai';


function StudentApplicationsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [isApplication, setIsApplication] = useState(false);

    const [fileInfo, setFileInfo] = useState({});
    const [isUploaded, setIsUploaded] = useState(false);

    const { loggedUser } = useContext(LoggedUserContext);
    const navigate = useNavigate();


    useEffect(() => {
        try {
            ApplicationsAPI.getAllApplicationsByStudent(loggedUser.id)
            .then(applicationsList => {
                setApplications(applicationsList);
                setIsLoading(false);

                const fetchFileInformation = async (application) => {
                    try {
                        const res = await fetchFileInfo({ application_id: application.id });
                        console.log(res.data)
                        if (res.data.length !== 0 ) {
                            setFileInfo(prevState => ({ ...prevState, [application.id]: res }));
                            setIsUploaded(true);
                            setIsApplication(true);
                        }                        
                    } catch (err) {
                        console.error("Error fetching uploaded file:", err);
                    }
                };

                applicationsList.forEach(application => {
                    fetchFileInformation(application);
                });
            })
        
        } catch (err) {
            console.error('[FRONTEND ERROR] Error in get student application list: ' + err[0]);
            setError(err[0]);
            setIsLoading(false);
        }
    }, [loggedUser.id]);

    return (
        <>
            <NavbarContainer />
            <TitleBar/>
            <Container className={"justify-content-center student-applications-container"}>
                {isLoading ? (
                    <Row className={"justify-content-center"}>
                        <Col>
                            <Spinner animation="border">
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
                    ) :  applications?.map((application) =>
                            <Row key={application.id} className={"justify-content-center student-application-row"}>
                                <Col lg={7}>
                                    <Card text={"light"}
                                              id={"student-application-card"}
                                        bg={application.status === "Accepted" ? 'success' : (application.status === "Rejected" ? 'danger' : (application.status === "Pending" ? 'secondary' : 'dark'))}
                                    >
                                        <Card.Header id="student-application-card-header">
                                            {application.status === "Accepted" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
                                                (application.status === "Canceled" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> :
                                                    (application.status === "Pending" ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                                    )
                                                )
                                            } <b>{application.status}</b>
                                        </Card.Header>
                                        <Card.Body className={"student-application-card-body"}>
                                            <Card.Title id="student-application-card-title">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V8l-6-6z" /><path d="M14 3v5h5M16 13H8M16 17H8M10 9H8" /></svg> {application.title}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> {application.supervisor_surname} {application.supervisor_name}
                                            </Card.Subtitle>
                                            <Card.Text>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> You applied on <i>{dayjs(application.application_date).format('dddd, DD MMMM YYYY')}</i>
                                            </Card.Text>
                                            {isUploaded && fileInfo[application.id] && (
                                            <div className="file-container">
                                                <Row className="d-flex align-items-center">
                                                    <Col xs={1}>
                                                        <AiOutlineFilePdf size={28} />
                                                    </Col>
                                                    <Col>
                                                        <p className="mb-0 fw-bold" >{fileInfo[application.id].data.filename}</p>
                                                    </Col>
                                                    <Col>
                                                        <AiOutlineSearch />
                                                        <a
                                                            href={`/applications/file/${application.id}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="resume-link"
                                                        >
                                                            See preview
                                                        </a>
                                                    </Col>
                                                </Row>
                                            </div>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        )
                    )
                }
                { isApplication ? (
                <Row className={"justify-content-center"}>
                    <Col lg={2}>
                        <Button id='back-to-homepage-button' className="w-100 my-3" as={Link} to="/">
                            Return
                        </Button>
                    </Col>
                </Row>
            ) : (
                <Card style={{margin: "2rem"}}>
                    <Row>
                        <Col xs={12} className="d-flex flex-row justify-content-center text-center my-4">
                            <p style={{ fontSize: '1.5rem', color: '#555' }}>
                                You haven't applied for any thesis yet
                            </p>
                        </Col>
                        <Col xs={12} className="d-flex flex-row justify-content-center my-4">
                            <Button
                                onClick={() => {
                                    navigate("/proposals/");
                                }}
                                id="no-application"
                            >
                                Go to proposals list
                            </Button>
                        </Col>
                    </Row>
                </Card>
            
            )}
            </Container>
        </>

    );
}

export default StudentApplicationsPage;