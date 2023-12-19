import React, { useEffect, useRef, useState } from 'react';
import NavbarContainer from '../components/Navbar';
import TitleBar from '../components/TitleBar';
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { getAllTeachers, insertNewThesisRequest } from '../api/ProposalsAPI';
import { useNavigate } from 'react-router-dom';

function ThesisRequestDetailsPage({ }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [supervisor, setSupervisor] = useState("");
    //const [coSupervisor, setCoSupervisor] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [teachersList, setTeacherList] = useState([]);
    const navigate = useNavigate();
    const targetRef = useRef(null);

    /**
     * It is used to show a message error in the page to the user
     */
    const scrollToTarget = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleRequestCheck = () => {
        if (!title || title?.trim() === "") {
            setErrorMessage("Please enter a valid title.");
            scrollToTarget();
            return false;
        }

        if (!description || description?.trim() === "") {
            setErrorMessage("Please enter a valid description.");
            scrollToTarget();
            return false;
        }

        if (!supervisor || supervisor?.trim() === "") {
            setErrorMessage("Please enter a valid supervisor.");
            scrollToTarget();
            return false;
        }

        return true;
    };

    const handleCreateRequest = async () => {
        if (!handleRequestCheck()) {
            return;
        }

        const newRequest = {
            title: title,
            description: description,
            supervisor: supervisor
        };

        try {
            await insertNewThesisRequest(newRequest);
            setSuccessMessage("The thesis request has been added correctly!");  // TODO: adding this success message in the home page
            scrollToTarget();
            navigate("/");
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(error.message);
            scrollToTarget();
        }
    };

    useEffect(() => {
        getAllTeachers()
            .then(result => setTeacherList(result))
            .catch(error => {
                setSuccessMessage("");
                setErrorMessage(error);
                scrollToTarget();
            });
    }, []);

    return (
        <>
            <NavbarContainer />
            <TitleBar />

            <Container className="proposal-details-container" fluid>
                <Container>
                    <div ref={targetRef}>
                        {errorMessage &&
                            <Row>
                                <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
                            </Row>
                        }
                        {successMessage &&
                            <Row>
                                <Alert variant="success" dismissible onClose={() => setSuccessMessage("")}>{successMessage}</Alert>
                            </Row>
                        }
                    </div>
                    <Form>
                        <Row>
                            <h3 id='title-page-thesis-request'>
                                Add Thesis Request
                            </h3>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>
                                            <span className="proposal-field-mandatory">*</span>
                                            Title:
                                        </Card.Title>
                                        <Form.Group>
                                            <Form.Control
                                                type='text'
                                                name='title'
                                                rows={1}
                                                aria-label='Enter title'
                                                placeholder='Enter title'
                                                value={title}
                                                onChange={(e) => {
                                                    setTitle(e.target.value);
                                                }}
                                                required
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>
                                            <span className="proposal-field-mandatory">*</span>
                                            Description:
                                        </Card.Title>
                                        <Form.Group>
                                            <Form.Control
                                                as='textarea'
                                                name='description'
                                                aria-label='Enter description'
                                                placeholder='Enter description'
                                                value={description}
                                                onChange={(e) => {
                                                    setDescription(e.target.value);
                                                }}
                                                rows={10}
                                                maxLength={10000}
                                                required
                                            />
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={12} md={6} className="mb-1 mb-md-0">
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>
                                            <span className="proposal-field-mandatory">*</span>
                                            Supervisor:
                                        </Card.Title>
                                        <Form.Group>
                                            <Form.Select
                                                id="supervisor"
                                                name='supervisor'
                                                defaultValue={supervisor}
                                                onChange={(e) => {
                                                    setSupervisor(e.target.value);
                                                }}
                                                required
                                            >
                                                <option value={""} disabled>Select a supervisor</option>
                                                {
                                                    teachersList.map((teacher, index) => (
                                                        <option key={index} value={teacher.id}>{teacher.surname} {teacher.name} ({teacher.email})</option>
                                                    ))
                                                }
                                            </Form.Select>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col xs={12} md={6}>
                                <Card className="h-100">
                                    <Card.Body>
                                        <Card.Title>Co-Supervisor:</Card.Title>
                                        <Form.Control
                                            id="supervisor"
                                            value={""}
                                            disabled
                                            required
                                        />
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button id="go-back" onClick={() => { navigate('/') }}>
                                    Return
                                </Button>
                            </Col>
                            <Col className={"d-flex flex-row-reverse"}>
                                <Button
                                    id="add-request-btn"
                                    onClick={handleCreateRequest}>
                                    Create Request
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </Container>
        </>
    );
}

export default ThesisRequestDetailsPage;