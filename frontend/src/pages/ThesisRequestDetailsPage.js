import React, { useEffect, useRef, useState } from 'react';
import NavbarContainer from '../components/Navbar';
import TitleBar from '../components/TitleBar';
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { getAllTeachers, getThesisRequest, insertNewThesisRequest } from '../api/ProposalsAPI';
import { useNavigate } from 'react-router-dom';

function ThesisRequestDetailsPage() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [supervisor, setSupervisor] = useState("");
    //const [coSupervisor, setCoSupervisor] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [teachersList, setTeacherList] = useState([]);
    const [disabledFields, setDisabledFields] = useState(true);
    const navigate = useNavigate();
    const targetRef = useRef(null);
    const [loading, setLoading] = useState(true);

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
            setSuccessMessage("The thesis request has been added correctly!");
            scrollToTarget();
            let supervisorChoosen = teachersList.find(teacher => teacher.id === supervisor);
            setSupervisor(supervisorChoosen.surname + " " + supervisorChoosen.name);
            setDisabledFields(true);
        } catch (error) {
            setSuccessMessage("");
            setErrorMessage(error.message);
            scrollToTarget();
        }
    };

    useEffect(() => {
        getThesisRequest()
            .then(result => {
                if (result) {
                    setTitle(result.title);
                    setDescription(result.description);
                    setSupervisor(result.supervisor.surname + " " + result.supervisor.name);
                    setSuccessMessage("There is already a thesis request!");
                    scrollToTarget();
                    setDisabledFields(true);
                } else {
                    setTitle("");
                    setDescription("");
                    setSupervisor("");
                    setSuccessMessage("");
                    setErrorMessage("");
                    setDisabledFields(false);
                }
            }).catch(error => {
                setSuccessMessage("");
                setErrorMessage(error.error);
                scrollToTarget();
            });

        getAllTeachers()
            .then(result => {
                setTeacherList(result);
                setLoading(false);
            })
            .catch(error => {
                setSuccessMessage("");
                setErrorMessage(error);
                scrollToTarget();
                setLoading(false);
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

                    {loading ?
                      <Row>
                          <Col className="d-flex flex-column justify-content-center align-items-center mt-5">
                              <Spinner animation="border" className="loadingSpinner" />
                              <span className="mt-3 loadingText">Loading...</span>
                          </Col>
                      </Row>
                        :
                        <Form>
                            <Row>
                                {disabledFields === false &&
                                    <h3 id='title-page'>
                                        Add Thesis Request
                                    </h3>
                                }
                                {disabledFields === true &&
                                    <h3 id='title-page'>
                                        View Thesis Request
                                    </h3>
                                }
                            </Row>
                            <Row>
                                <Col>
                                    <Card className="h-100">
                                        {disabledFields == true ?
                                            <Card.Body>
                                                <Card.Title>Title:</Card.Title>
                                                <Card.Text>{title}</Card.Text>
                                            </Card.Body>
                                            :
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
                                                        disabled={disabledFields}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        }
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card className="h-100">
                                        {disabledFields == true ?
                                            <Card.Body>
                                                <Card.Title>Description:</Card.Title>
                                                <Card.Text>{description}</Card.Text>
                                            </Card.Body>
                                            :
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
                                                        disabled={disabledFields}
                                                        required
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        }
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={6} className="mb-1 mb-md-0">
                                    <Card className="h-100">
                                        {disabledFields == true ?
                                            <Card.Body>
                                                <Card.Title>Supervisor:</Card.Title>
                                                <Card.Text>{supervisor}</Card.Text>
                                            </Card.Body>
                                            :
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
                                                        disabled={disabledFields}
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
                                        }
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
                                <Col xs={12} sm={6} className='my-2'>
                                    <Button id="go-back" className="w-100" onClick={() => { navigate('/') }}>
                                        Return
                                    </Button>
                                </Col>
                                {disabledFields === false &&
                                    <Col xs={12} sm={6} className="my-2">
                                        <Button
                                            id="add-request-btn"
                                            className="w-100"
                                            onClick={handleCreateRequest}>
                                            Create Request
                                        </Button>
                                    </Col>
                                }
                            </Row>
                        </Form>

                    }
                </Container>
            </Container>
        </>

    );
}

export default ThesisRequestDetailsPage;