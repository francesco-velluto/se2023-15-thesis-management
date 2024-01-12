import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import { useNavigate, useParams } from "react-router-dom";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { getApplicationById, acceptOrRejectApplication, fetchFileInfo } from "../api/ApplicationsAPI";
import { Spinner, Row, Col, Container, Alert, CardHeader, Card, CardBody, Button, CardFooter, Modal } from "react-bootstrap";
import { getStudentById } from "../api/StudentsAPI";
import { format } from 'date-fns';
import { UnAuthorizationPage } from "../App";
import PropTypes from "prop-types";
import { AiOutlineFilePdf, AiOutlineSearch} from 'react-icons/ai';


function ApplicationDetails() {

    let { application_id } = useParams();
    const { loggedUser } = useContext(LoggedUserContext);
    const navigate = useNavigate();

    const [authorized, setAuthorized] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [infoProposal, setInfoProposal] = useState(undefined);
    const [infoStudent, setInfoStudent] = useState(undefined);
    const [infoApplication, setInfoApplication] = useState(undefined);

    const [showModal, setShowModal] = useState(false);
    const [showUpdatingModal, setShowUpdatingModal] = useState(false);
    const [choice, setChoice] = useState("");

    const [emailSent, setEmailSent] = useState(undefined);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

    const handleShowUpdatingModal = () => setShowUpdatingModal(true);

    const handleCloseUpdatingModal = () => setShowUpdatingModal(false);

    useEffect(() => {
        const getData = async () => {
            setIsLoading(true);
            setInfoApplication(undefined);
            setInfoProposal(undefined);
            setInfoStudent(undefined);

            if (!loggedUser.id)
                navigate("/login");

            if (loggedUser.role !== 0) { // not a teacher
                setAuthorized(false);
                setIsLoading(false);
                return;
            }

            try {
                const application = await getApplicationById(application_id);

                if (application) {
                    if (loggedUser.id !== application.proposal.supervisor_id) {
                        setAuthorized(false);
                        setIsLoading(false);
                        return;
                    }

                    setInfoApplication(application);
                    setInfoProposal(application.proposal);

                    const student = await getStudentById(application.student_id);
                    setInfoStudent(student);

                } else {
                    setErrorMessage("Error in the fetching of the application.");
                }
            } catch (error) {
                setErrorMessage(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        getData();

    }, [application_id, loggedUser.id, loggedUser.role, navigate]);

    const handleButton = async (status) => {

        setChoice(status);
        handleShow();
    }

    const handleSetStatus = async (status) => {
        try {
            // close the modal
            handleClose();

            // show the updating modal
            handleShowUpdatingModal();

            const applicationModified = await acceptOrRejectApplication(status, application_id);

            setEmailSent(applicationModified.emailNotificationSent);
        } catch (e) {
            console.error("Error in the updating of the application status: ", e);
            setErrorMessage("An error occurred in the updating of the application status.");
            handleClose();
            handleCloseUpdatingModal();
        }
    }


    return (
        <>
            {!isLoading && !authorized && <UnAuthorizationPage /> }
            { (isLoading || authorized) &&
            <>
            <NavbarContainer />
            <TitleBar/>

            <Col md={6} className="text-center mx-auto">
                <Row className='mt-2'>
                    {errorMessage &&
                        <Alert variant='danger'
                            dismissible={true}
                            onClose={() => setErrorMessage("")}>
                            {errorMessage}
                        </Alert>
                    }
                </Row>

                {isLoading &&
                    <Spinner animation="border">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                {!isLoading && infoApplication &&
                    <>
                        <StudentInfo infoStudent={infoStudent} infoApplication={infoApplication} />

                        <ProposalInfo infoProposal={infoProposal} />

                        <Row className="py-1 my-2">
                            <Col className="text-start" >
                                <Button variant="outline-secondary" onClick={() => navigate("/applications")}> Return </Button>
                            </Col>
                            <Col className="text-end" >
                                <Button id="accept-application" className="mx-2" variant="outline-success" onClick={() => handleButton("Accepted")}>Accept</Button>
                                <Button id="reject-application" className="mx-2" variant="outline-danger" onClick={() => handleButton("Rejected")}>Reject</Button>
                            </Col>
                        </Row>

                        <Modal show={showModal} onHide={handleClose} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Attention</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>You are <strong>{choice === "Accepted" ? "accepting" : "rejecting"}</strong> this application!</Modal.Body>
                            <Modal.Footer>
                                <Button id="cancel-reject-application" variant="danger" onClick={handleClose}>
                                    Cancel
                                </Button>
                                <Button id="confirm-reject-application" variant="success" onClick={() => handleSetStatus(choice)}>
                                    Confirm
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <Modal show={showUpdatingModal}>
                            <Modal.Header>
                                <Modal.Title>Updating application status</Modal.Title>
                            </Modal.Header>
                            <Modal.Body className={"align-content-center align-items-center"}>
                                <Container>
                                    <Row className={"align-items-center align-content-center"}>
                                        <Col lg={3}>
                                            {emailSent === undefined ?
                                                <output> 
                                                <Spinner animation="border" role="status" style={{margin: "auto"}}/> </output> :
                                                <>
                                                    <svg className="svg-icon" width={50} height={50} viewBox="0 0 20 20">
                                                        <path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"></path>
                                                    </svg>
                                                    {
                                                        emailSent ?
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                                    }
                                                </>
                                            }
                                        </Col>
                                        <Col id={"email-sending-message"}>
                                            {emailSent === undefined ?
                                                <>
                                                    You have <b>{choice === "Accepted" ? "accepted" : "rejected"}</b> this application!<br/>
                                                    <i>We are updating the status of the application and sending an email notification to the student.</i>
                                                    {choice === "Accepted" && <><br/><i>All other students who applied will receive the notification that their application has been canceled.</i></>}
                                                </>
                                                :
                                                <>
                                                    The application status has been updated successfully!<br/>
                                                    {emailSent ?
                                                        <i>
                                                            An email notification has been correctly sent to the student{choice === "Accepted" && 's'}.
                                                        </i>
                                                        :
                                                        <i>
                                                            Unfortunately an error occurred while sending the email notification to the student{choice === "Accepted" && 's'},
                                                            the application is still {choice === "Accepted" ? "accepted" : "rejected"} anyways
                                                        </i>
                                                    }
                                                </>
                                            }
                                        </Col>
                                    </Row>
                                </Container>
                            </Modal.Body>
                            {
                                emailSent !== undefined &&
                                <Modal.Footer>
                                    <Button id="email-message-back-btn" variant="outline-secondary" onClick={() => navigate("/applications")}>Go back</Button>
                                </Modal.Footer>
                            }
                        </Modal>
                    </>
                }

            </Col>
            </>}
        </>
    )
}



function StudentInfo(props) {
    const [fileInfo, setFileInfo] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const infoStudent = props.infoStudent;
    const infoApplication = props.infoApplication;

    const formattedDate = (date) => {
        return format(new Date(date), "EEEE, MMMM do yyyy")
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const info = await fetchFileInfo({ application_id: infoApplication.id });

                if (info) {
                    setFileInfo(info);
                    setIsUploaded(true);
                }
            } catch (err) {
                console.error('[FRONTEND ERROR] Error in get student application list: ' + err.message);
            }
        };

        fetchData();
    }, [infoApplication.id]);

    return (
        <Row className="my-2">
            <Col>
                <Card id="card-border">
                    <CardHeader id="card-header" className="text-center fw-bold fs-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664z" />
                        </svg>
                        Student info
                    </CardHeader>
                    <CardBody className="text-start">
                        <RowInfo title={"Name"} value={infoStudent.name} />
                        <RowInfo title={"Surname"} value={infoStudent.surname} />
                        <RowInfo title={"E-mail"} value={infoStudent.email} />
                        <RowInfo title={"Enrollment year"} value={infoStudent.enrollment_year} />
                        {isUploaded && fileInfo && (
                            <div className="file-div">
                                <Row className="d-flex align-items-center">
                                    <Col xs={1}>
                                        <AiOutlineFilePdf size={50} />
                                    </Col>
                                    <Col xs={5}>
                                        <p className="d-flex mb-0 fw-bold" >{fileInfo.data.filename}</p>
                                    </Col>
                                    <Col >
                                        <AiOutlineSearch size={30}/>
                                        <a
                                            href={`/applications/file/${infoApplication.id}`}
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
                    </CardBody>
                    <CardFooter style={{ borderColor: "#6D5D6E" }}>
                        Applied for this thesis on {formattedDate(infoApplication.application_date)}
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    )
}

StudentInfo.propTypes = {
    infoStudent: PropTypes.shape({
        name: PropTypes.string,
        surname: PropTypes.string,
        email: PropTypes.string,
        enrollment_year: PropTypes.number
    }),
    infoApplication: PropTypes.shape({
        id: PropTypes.number,
        application_date: PropTypes.string
    }),
};

function ProposalInfo(props) {

    const infoProposal = props.infoProposal;

    const formattedDate = (date) => {
        return format(new Date(date), "EEEE, MMMM do yyyy")
    }

    return (
        <Row>
            <Col>
                <Card id="card-border" >
                    <CardHeader id="card-header" className="text-center fw-bold fs-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-book me-2" viewBox="0 0 16 16">
                            <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811V2.828zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492V2.687zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                        </svg>
                        Proposal info
                    </CardHeader>
                    <CardBody className="text-start">
                        <RowInfo title={"Title"} value={infoProposal.title} />
                        <RowInfo title={"Type"} value={infoProposal.type} />
                        {infoProposal.notes ? <RowInfo title={"Notes"} value={infoProposal.notes} /> : <></>}
                        <RowInfo title={"Expiration date"} value={formattedDate(infoProposal.expiration_date)} />

                    </CardBody>

                </Card>
            </Col>
        </Row>
    )
}

ProposalInfo.propTypes = {
    infoProposal: PropTypes.shape({
        title: PropTypes.string,
        type: PropTypes.string,
        notes: PropTypes.string,
        expiration_date: PropTypes.string
    }),
};

function RowInfo(props) {

    return (
        <Row className="fs-5 mx-4 py-1">
            <Col md={6} xs={12}>
                <strong>{props.title} </strong>:
            </Col>
            <Col md={6} xs={12}>
                {props.value}
            </Col>
        </Row>
    )
}

RowInfo.propTypes = {
    title: PropTypes.string,
    value: PropTypes.any
};

export default ApplicationDetails;