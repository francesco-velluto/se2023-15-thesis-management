import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";


import { useNavigate, useParams } from "react-router-dom";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { getApplicationById, acceptOrRejectApplication } from "../api/ApplicationsAPI";
import { Spinner, Row, Col, Alert, CardHeader, Card, CardBody, Button, CardFooter, Modal } from "react-bootstrap";
import { getStudentById } from "../api/StudentsAPI";
import { format } from 'date-fns';
import { UnAuthorizationPage } from "../App";


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
    const [choice, setChoice] = useState("");

    const handleShow = () => setShowModal(true);
    const handleClose = () => {setShowModal(false); setChoice("");}

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
                        console.log("different teacher")
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

    const handleSetStatus = async (status) =>{

        try {
            await acceptOrRejectApplication(status, application_id);
            navigate("/applications");
        } catch (error) {
            setErrorMessage("Some error occurred during the operation!");
        }
    }


    return (
        <>
            {!isLoading && !authorized && <UnAuthorizationPage /> }
            { (isLoading || authorized) &&
            <>
            <NavbarContainer />
            <TitleBar title={"Application details"} />

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
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                {!isLoading && infoApplication &&
                    <>
                        <StudentInfo infoStudent={infoStudent} infoApplication={infoApplication} />

                        <ProposalInfo infoProposal={infoProposal} />

                        <Row className="py-1 my-2">
                            <Col className="text-start" >
                                <Button variant="outline-secondary" onClick={() => navigate("/applications")}> Go back</Button>
                            </Col>
                            <Col className="text-end" >
                                <Button id="accept-application" className="mx-2" variant="outline-success" onClick={() => handleButton("Accepted")}>Accept</Button>
                                <Button id="reject-application" variant="outline-danger" onClick={() => handleButton("Rejected")}>Reject</Button>
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
                    </>
                }

            </Col>
            </>}
        </>
    )
}



function StudentInfo(props) {

    const infoStudent = props.infoStudent;
    const infoApplication = props.infoApplication;

    const formattedDate = (date) => {
        return format(new Date(date), "EEEE, MMMM do yyyy")
    }
    return (
        <Row className="my-2">
            <Col>
                <Card style={{ borderColor: "#6D5D6E" }} >
                    <CardHeader style={{ borderColor: "#6D5D6E" }} className="text-center fw-bold fs-3">
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

                    </CardBody>
                    <CardFooter style={{ borderColor: "#6D5D6E" }}>
                        Applied for this thesis on {formattedDate(infoApplication.application_date)}
                    </CardFooter>
                </Card>
            </Col>
        </Row>
    )
}

function ProposalInfo(props) {

    const infoProposal = props.infoProposal;

    const formattedDate = (date) => {
        return format(new Date(date), "EEEE, MMMM do yyyy")
    }

    return (
        <Row>
            <Col>
                <Card style={{ borderColor: "#6D5D6E" }} >
                    <CardHeader style={{ borderColor: "#6D5D6E" }} className="text-center fw-bold fs-3">
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

export default ApplicationDetails;