import { useContext, useEffect, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import { useNavigate, useParams } from "react-router-dom";
import { getAllDegrees, getProposalById, insertNewProposal } from "../api/ProposalsAPI";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import ApplicationButton from './ApplicationButton';

import { VirtualClockContext } from "../components/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";

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
    const { loggedUser } = useContext(LoggedUserContext);

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

    const levelEnum = {
        BACHELOR: "Bachelor",
        MASTER: "Master"
    }
    const [newGroup, setNewGroup] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    // list of useful data
    const proposalLevelsList = [levelEnum.BACHELOR, levelEnum.MASTER];
    const [proposalDegreeList, setProposalDegreeList] = useState([]);

    /**
    * Filters programs based on the selected education level.
    * @param {string} program - Object representing a study program.
    * @returns {boolean} - Returns true if the program meets the filtering criteria, otherwise false.
    */
    const handleFilterDegreeList = (program) => {
        if (level === levelEnum.BACHELOR && program[0].toUpperCase() === "B") {
            return true;
        }
        if (level === levelEnum.MASTER && (program[0].toUpperCase() === "M" || program[0].toUpperCase() === "D")) {
            return true;
        }
        return false;
    }

    const handleCreateProposal = async (event) => {
        event.preventDefault();

        if (title?.trim() === "") {
            setErrorMessage("Please enter a valid title.");
            return;
        }

        if (level?.trim() === "") {
            setErrorMessage("Please select a valid level.");
            return;
        }

        if (type?.trim() === "") {
            setErrorMessage("Please select a valid type.");
            return;
        }

        if (description?.trim() === "") {
            setErrorMessage("Please enter a valid description.");
            return;
        }

        if (!expDate) {
            setErrorMessage("Please select a valid expiration date.");
            return;
        }

        if (programmes.length === 0) {
            setErrorMessage("Please select at least one programme.");
            return;
        }

        if (keywords.length === 0) {
            setErrorMessage("Please enter at least one keyword.");
            return;
        }

        if (groups.length === 0) {
            setErrorMessage("Please enter at least one group.");
            return;
        }

        // Check if the level and the programmes are compatible
        if (handleFilterDegreeList(programmes)) {
            setErrorMessage("Please select programmes compatible with the chosen level.");
            return;
        }

        const newProposal = {
            title: title,
            level: level,
            supervisor_id: loggedUser.id,
            keywords: keywords,
            type: type,
            groups: groups,
            description: description,
            required_knowledge: knowledge,
            notes: notes,
            expiration_date: expDate,
            programmes: programmes,
        };

        try {
            await insertNewProposal(newProposal);
            navigate("/");
        } catch (err) {
            setErrorMessage(err.message);
        }
    }

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
                        setErrorMessage(data.error);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setErrorMessage(err.message);
                    setIsLoading(false);
                });
        } else if (mode === 2) {    // add mode
            setIsLoading(false);
            setSupervisor(loggedUser.name + " " + loggedUser.surname);
            getAllDegrees()
                .then(list => setProposalDegreeList(list))
                .catch(err => {
                    setErrorMessage(err);
                    setProposalDegreeList([]);
                });
        }
    }, [proposal_id, currentDate]);

    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Proposal Details"} />
            {
                isLoading ? (<Alert variant="info">Loading...</Alert>) : (
                    <Container className={"proposal-details-container"} fluid>
                        <Form>
                            {errorMessage &&
                                <Row>
                                    <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
                                </Row>
                            }
                            <Container>
                                <Row>
                                    <Col>
                                        {mode === 0 ?
                                            <h2 className={"proposal-details-title"}>{title}</h2>
                                            :
                                            <Form.Group>
                                                <Card>
                                                    <Card.Body>
                                                        <Card.Title>Title:</Card.Title>
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
                                                    </Card.Body>
                                                </Card>
                                            </Form.Group>
                                        }
                                    </Col>
                                </Row>
                                {mode === 0 && (
                                    <>
                                        <Row>
                                            <Col className={"proposal-details-keyword"}>
                                                {keywords.map((keyword) => <Badge bg={"secondary"} className="mr-1">{keyword}</Badge>)}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className={"proposal-details-expiration my-2"}>
                                                <Badge bg={"danger"}>Expires on {new Date(expDate).toLocaleDateString("it-IT")}</Badge>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Description:</Card.Title>
                                                <Form.Group>
                                                    <Form.Control
                                                        as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                        name='description'
                                                        rows={mode === 0 ? 1 : 7}               // read mode
                                                        aria-label='Enter description'
                                                        placeholder='Enter description'
                                                        value={description}
                                                        onChange={(e) => {
                                                            setDescription(e.target.value);
                                                        }}
                                                        readOnly={mode === 0}                   // read mode
                                                        plaintext={mode === 0}                  // read mode
                                                        required
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Container>
                            <Container>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Supervisor:</Card.Title>
                                                <Form.Control
                                                    id="supervisor"
                                                    value={supervisor}
                                                    disabled
                                                    required
                                                />
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col xs={6}>
                                        <Card>
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
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Level:</Card.Title>
                                                {mode === 0 ?
                                                    <Card.Text>{level}</Card.Text>
                                                    :
                                                    <Form.Group>
                                                        <Form.Select
                                                            name='proposal-level'
                                                            defaultValue={level}
                                                            onChange={(e) => {
                                                                setLevel(e.target.value);
                                                                setProgrammes([]);
                                                            }}
                                                            required
                                                        >
                                                            <option value={""} disabled>Select a level</option>
                                                            {
                                                                proposalLevelsList.map((level, index) => (
                                                                    <option key={index} value={level}>{level}</option>
                                                                ))
                                                            }
                                                        </Form.Select>
                                                    </Form.Group>}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Type:</Card.Title>
                                                <Form.Group>
                                                    <Form.Control
                                                        as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                        name='proposal-type'
                                                        rows={1}
                                                        aria-label='Enter the type'
                                                        placeholder='Enter the type'
                                                        value={type}
                                                        onChange={(e) => {
                                                            setType(e.target.value);
                                                        }}
                                                        readOnly={mode === 0}                   // read mode
                                                        plaintext={mode === 0}                  // read mode
                                                        required
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>CdS / Programmes:</Card.Title>
                                                {mode === 0 ?
                                                    <Card.Text>
                                                        {programmes.map((programme) => <Badge className="mr-1">{programme.title_degree}</Badge>)}
                                                    </Card.Text>
                                                    :
                                                    <div>
                                                        <Form.Group>
                                                            {!level &&
                                                                <div className="disabled-message">
                                                                    Please select a proposal level before choosing a program.
                                                                </div>
                                                            }
                                                            <Form.Select
                                                                name='proposal-programmes'
                                                                value={""}
                                                                onChange={(e) => {
                                                                    if (e.target.value?.trim()) {
                                                                        setProgrammes([...programmes, e.target.value]);
                                                                    }
                                                                }}
                                                                disabled={!level}
                                                            >
                                                                <option value={""} disabled>Select a program</option>
                                                                {proposalDegreeList
                                                                    .filter(program => handleFilterDegreeList(program.title_degree) && !programmes.includes(program.cod_degree))
                                                                    .map((program, index) => (
                                                                        <option key={index} value={program.cod_degree}>{program.title_degree}</option>
                                                                    ))
                                                                }
                                                            </Form.Select>
                                                        </Form.Group>
                                                        <ListGroup className="mt-2">
                                                            {programmes.map((program, index) => (
                                                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center my-1">
                                                                    {program}
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            let updatedSelectedProgrammes = [...programmes];
                                                                            updatedSelectedProgrammes.splice(index, 1);
                                                                            setProgrammes(updatedSelectedProgrammes);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    </div>
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Groups:</Card.Title>
                                                {mode === 0 ?
                                                    <Card.Text>
                                                        {groups.map((group) => <Badge className="mr-1">{group}</Badge>)}
                                                    </Card.Text>
                                                    :
                                                    <Form.Group>
                                                        <div className="text-plus">
                                                            <Col xs={9}>
                                                                <Form.Control
                                                                    as={'input'}
                                                                    name='proposal-groups'
                                                                    aria-label='Enter group'
                                                                    placeholder='Enter group'
                                                                    value={newGroup}
                                                                    onChange={(e) => {
                                                                        setNewGroup(e.target.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs={3}>
                                                                <Button onClick={() => {
                                                                    if (!groups.includes(newGroup)) {
                                                                        setGroups([...groups, newGroup]);
                                                                        setNewGroup('');
                                                                    } else {
                                                                        setErrorMessage("This group is already in the list!");
                                                                    }
                                                                }}>
                                                                    Add
                                                                </Button>
                                                            </Col>
                                                        </div>
                                                        <ListGroup className="mt-2">
                                                            {groups.map((group, index) => (
                                                                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center my-1">
                                                                    {group}
                                                                    <Button
                                                                        variant="danger"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            let updated = [...groups];
                                                                            updated.splice(index, 1);
                                                                            setGroups(updated);
                                                                        }}
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                </ListGroup.Item>
                                                            ))}
                                                        </ListGroup>
                                                    </Form.Group>
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                                <Row>
                                {mode !== 0 &&
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>Expiration Date:</Card.Title>
                                                    <Form.Group>
                                                        <Form.Control
                                                            id="expiration-date"
                                                            type="date"
                                                            min={currentDate}
                                                            onChange={(e) => {
                                                                setExpDate(e.target.value);
                                                            }}
                                                            required
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    }
                                    {mode !== 0 &&
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>Keywords</Card.Title>
                                                    <Form.Group>
                                                        <div className="text-plus">
                                                            <Col xs={9}>
                                                                <Form.Control
                                                                    as={'input'}
                                                                    name='proposal-keywords'
                                                                    aria-label='Enter keyword'
                                                                    placeholder='Enter keyword'
                                                                    value={newKeyword}
                                                                    onChange={(e) => {
                                                                        setNewKeyword(e.target.value);
                                                                    }}
                                                                />
                                                            </Col>
                                                            <Col xs={3}>
                                                                <Button onClick={() => {
                                                                    if (!keywords.includes(newKeyword)) {
                                                                        setKeywords([...keywords, newKeyword]);
                                                                        setNewKeyword('');
                                                                    } else {
                                                                        setErrorMessage("This keyword is already in the list!");
                                                                    }
                                                                }}>
                                                                    Add
                                                                </Button>
                                                            </Col>
                                                        </div>
                                                    </Form.Group>
                                                    <ListGroup className="mt-2">
                                                        {keywords.map((keyword, index) => (
                                                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center my-1">
                                                                {keyword}
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        let updated = [...keywords];
                                                                        updated.splice(index, 1);
                                                                        setKeywords(updated);
                                                                    }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </ListGroup.Item>
                                                        ))}
                                                    </ListGroup>
                                                </Card.Body>
                                            </Card>
                                        </Col>}
                                </Row>
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Required Knowledge:</Card.Title>
                                                <Form.Group>
                                                    <Form.Control
                                                        as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                        name='required-knowledge'
                                                        rows={mode === 0 ? 1 : 4}               // read mode
                                                        aria-label='Enter required knowledge'
                                                        placeholder='Enter required knowledge'
                                                        value={knowledge}
                                                        onChange={(e) => {
                                                            setKnowledge(e.target.value);
                                                        }}
                                                        readOnly={mode === 0}                   // read mode
                                                        plaintext={mode === 0}                  // read mode
                                                    />
                                                </Form.Group>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <Card.Title>Notes:</Card.Title>
                                                <Form.Group>
                                                    <Form.Control
                                                        as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                        name='additional-notes'
                                                        rows={mode === 0 ? 1 : 4}               // read mode
                                                        aria-label='Enter notes'
                                                        placeholder='Enter notes'
                                                        value={notes}
                                                        onChange={(e) => {
                                                            setNotes(e.target.value);
                                                        }}
                                                        readOnly={mode === 0}                   // read mode
                                                        plaintext={mode === 0}                  // read mode
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
                                        {mode === 0 && <ApplicationButton proposalID={proposal_id} />}
                                        {mode !== 0 && <Button onClick={handleCreateProposal}>Create Proposal</Button>}
                                    </Col>
                                </Row>
                            </Container>
                        </Form>
                    </Container>
                )
            }
        </>
    );
}

export default ProposalDetailsPage;