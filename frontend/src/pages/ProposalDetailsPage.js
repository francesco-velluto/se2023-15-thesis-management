import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import { useNavigate, useParams } from "react-router-dom";
import { getProposalById } from "../api/ProposalsAPI";
import { Alert, Badge, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import ApplicationButton from './ApplicationButton';

import "../ProposalDetails.css";
import { VirtualClockContext } from "../components/VirtualClockContext";

/**
 * This page supports three modes:
 *  - Read Mode: Displaying a proposal in read-only format.
 *  - Write Mode: Editing an existing proposal.
 *  - Add Mode: Adding a new proposal.
 * 
 * @param {number} mode - An integer indicating the mode:
 *  - 0: Read Mode
 *  - 1: Write Mode
 *  - 2: Add Mode 
 */
function ProposalDetailsPage({ mode }) {
    const navigate = useNavigate();

    const { proposal_id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);

    const { currentDate } = useContext(VirtualClockContext);

    const [title, setTitle] = useState("");
    const [supervisor, setSupervisor] = useState("");
    const [level, setLevel] = useState("");
    const [type, setType] = useState("");
    const [expDate, setExpDate] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    // const [coSupervisors, setCoSupervisors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [description, setDescription] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [notes, setNotes] = useState("");


    useEffect(() => {
        if (mode === 0) {       // if it is in read mode
            setIsLoading(true);
            setErrorMessage(null); // reset error message when component is re-rendered

            getProposalById(proposal_id)
                .then(async res => {
                    let data = await res.json()

                    if (res.status === 200) {
                        if (data.expiration_date < currentDate) {
                            // don't expose any data in the component state
                            setTitle("");
                            setSupervisor("");
                            setLevel("");
                            setType("");
                            setExpDate("");
                            setKeywords([]);
                            setProgrammes([]);
                            setGroups([]);
                            setDescription("");
                            setKnowledge("");
                            setNotes("");
                            setErrorMessage("Proposal expired!"); //? Change this to render a component ??
                        } else {
                            setTitle(data.title);
                            setSupervisor(data.supervisor_name + " " + data.supervisor_surname);
                            setLevel(data.level);
                            setType(data.type);
                            setExpDate(data.expiration_date);
                            setKeywords(data.keywords);
                            setProgrammes(data.programmes);
                            setGroups(data.groups);
                            setDescription(data.description);
                            setKnowledge(data.required_knowledge);
                            setNotes(data.notes);
                        }
                    } else {
                        setErrorMessage(data.error)
                    }

                    setIsLoading(false)
                })
                .catch(err => {
                    setErrorMessage(err.message);
                    setIsLoading(false);
                });
        }
    }, [proposal_id, currentDate]);



    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Proposal Details"} />
            {
                isLoading ? (<Alert variant="info">Loading...</Alert>) : (
                    errorMessage ? (
                        <Container>
                            <Row>
                                <Col>
                                    <Alert variant="danger">{errorMessage}</Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Button variant={"secondary"} onClick={() => navigate("/proposals")}>Back to Search Proposals</Button>
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                        <Container fluid className={"proposal-details-container"}>
                            <Form>
                                <Row>
                                    <Col>
                                        <h2 className={"proposal-details-title"}>{title}</h2>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className={"proposal-details-keyword"}>
                                        {keywords.map((keyword) => <Badge bg={"secondary"} className="mr-1">{keyword}</Badge>)}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className={"proposal-details-expiration"}>
                                        <Badge bg={"danger"}>Expires on {new Date(expDate).toLocaleDateString("it-IT")}</Badge>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Description</Card.Title>
                                                <Card.Text>{description}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Supervisor</Card.Title>
                                                <Card.Text>{supervisor}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Proposal Programmes</Card.Title>
                                                <Card.Text>
                                                    {programmes.map((programme) => <Badge className="mr-1">{programme.title_degree}</Badge>)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Proposal Type</Card.Title>
                                                <Card.Text>{type}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Proposal Level</Card.Title>
                                                <Card.Text>{level}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Required Knowledge</Card.Title>
                                                <Card.Text>{knowledge}</Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Proposal Groups</Card.Title>
                                                <Card.Text>
                                                    {groups.map((group) => <Badge className="mr-1">{group}</Badge>)}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Additional Notes</Card.Title>
                                                <Form.Group>
                                                    <Form.Control
                                                        type='text'
                                                        name='additional-notes'
                                                        aria-label='enter additional notes'
                                                        placeholder='enter additional notes'
                                                        value={notes}
                                                        onChange={(e) => {
                                                            setNotes(e.target.value);
                                                        }}
                                                        readOnly={mode === 0 /* read mode */}
                                                        plaintext={mode === 0 /* read mode */}
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col>
                                        <Button className={"proposal-details-back"} variant={"secondary"} onClick={() => {
                                            navigate('/proposals')
                                        }}>Back to Search Proposal</Button>
                                    </Col>
                                    <Col className={"d-flex flex-row-revers"}>
                                        <ApplicationButton proposalID={proposal_id} />
                                    </Col>
                                </Row>

                            </Form>
                        </Container>
                    )
                )
            }
        </>
    );
}

export default ProposalDetailsPage;