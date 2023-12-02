import { useContext, useEffect, useRef, useState } from "react";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

import { useNavigate, useParams } from "react-router-dom";
import { getAllDegrees, getProposalById, insertNewProposal, updateProposalApi } from "../api/ProposalsAPI";
import { Alert, Badge, Button, Card, Col, Container, Form, ListGroup, Row } from "react-bootstrap";
import ApplicationButton from './ApplicationButton';

import { VirtualClockContext } from "../context/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { UnAuthorizationPage } from "../App";
import dayjs from "dayjs";

/**
 * This page supports three modes:
 *  - Read Mode: Displaying a proposal in read-only format.
 *  - Update Mode: Editing an existing proposal.
 *  - Add Mode: Adding a new proposal.
 *
 * @param {number} mode - An integer indicating the mode:
 *  - 0: Read Mode
 *  - 1: Update Mode
 *  - 2: Add Mode
 */
function ProposalDetailsPage({ mode }) {
    const navigate = useNavigate();

    const { proposal_id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);    // it is useful to hide fields in the page if there is some issues (for example, proposal expired or proposal not found ...)
    const [successMessage, setSuccessMessage] = useState(false);

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
    const [groups, setGroups] = useState([loggedUser.cod_group]);
    const [description, setDescription] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [notes, setNotes] = useState("");
    const [rows, setRows] = useState(3);

    const levelEnum = {
        BACHELOR: "Bachelor",
        MASTER: "Master"
    }
    //const [newGroup, setNewGroup] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    const calculateRows = () => {
        const lineCount = (description.match(/\n/g) || []).length + 1;
        const minRows = 3;
        const calculatedRows = Math.max(lineCount, minRows);
        return calculatedRows;
    };

    const updateRows = () => {
        const calculatedRows = calculateRows();
        setRows(calculatedRows);
    };


    // list of useful data
    const proposalLevelsList = [levelEnum.BACHELOR, levelEnum.MASTER];
    const [proposalDegreeList, setProposalDegreeList] = useState([]);

    const targetRef = useRef(null);

    const scrollToTarget = () => {
        if (targetRef.current) {
            targetRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    /**
    * Filters programs based on the selected education level.
    * @param {string} program - Object representing a study program.
    * @returns {boolean} - Returns true if the program meets the filtering criteria, otherwise false.
    */
    const handleFilterDegreeList = (program) => {
        if (level === levelEnum.BACHELOR && program[0].toUpperCase() === "B") {
            return true;
        }
        return (level === levelEnum.MASTER && (program[0].toUpperCase() === "M" || program[0].toUpperCase() === "D"));
    }

    const handleProposalCheck = () => {
        if (title?.trim() === "") {
            setErrorMessage("Please enter a valid title.");
            scrollToTarget();
            return false;
        }

        if (level?.trim() === "") {
            setErrorMessage("Please select a valid level.");
            scrollToTarget();
            return false;
        }

        if (type?.trim() === "") {
            setErrorMessage("Please select a valid type.");
            scrollToTarget();
            return false;
        }

        if (description?.trim() === "") {
            setErrorMessage("Please enter a valid description.");
            scrollToTarget();
            return false;
        }

        if (!expDate) {
            setErrorMessage("Please select a valid expiration date.");
            scrollToTarget();
            return false;
        }

        if (programmes.length === 0) {
            setErrorMessage("Please select at least one programme.");
            scrollToTarget();
            return false;
        }

        if (keywords.length === 0) {
            setErrorMessage("Please enter at least one keyword.");
            scrollToTarget();
            return false;
        }

        if (groups.length === 0) {
            setErrorMessage("Please enter at least one group.");
            scrollToTarget();
            return false;
        }

        // Check if the level and the programmes are compatible
        if (handleFilterDegreeList(programmes)) {
            setErrorMessage("Please select programmes compatible with the chosen level.");
            scrollToTarget();
            return false;
        }

        return true;
    }

    const handleCreateProposal = async (event) => {
        event.preventDefault();

        if (!handleProposalCheck()) {
            return;
        }

        const newProposal = {
            title: title,
            level: level,
            keywords: keywords,
            type: type,
            groups: groups,
            description: description,
            required_knowledge: knowledge,
            notes: notes,
            expiration_date: expDate,
            programmes: programmes
        };

        try {
            const proposal = await insertNewProposal(newProposal);
            setSuccessMessage(true);
            scrollToTarget();
            navigate("/proposals/" + proposal.proposal_id);
        } catch (err) {
            setSuccessMessage(false);
            setErrorMessage(err.message);
        }
    }

    const handleUpdateProposal = async (e) => {
        e.preventDefault();

        if (!handleProposalCheck()) {
            return;
        }

        const updateProposal = {
            title: title,
            level: level,
            keywords: keywords,
            type: type,
            //groups: groups,
            description: description,
            required_knowledge: knowledge,
            notes: notes,
            expiration_date: expDate,
            programmes: programmes
        };

        try {
            //! it can be implemented when the backend is ready
            //const proposal = await updateProposalApi(updateProposal);

            setErrorMessage("Backend not implemented yet"); //! remove it when the backend is ready

            setSuccessMessage(true);
            //navigate("/proposals/" + proposal.proposal_id);
            scrollToTarget();
        } catch (err) {
            setSuccessMessage(false);
            setErrorMessage(err.message);
        }
    }

    useEffect(() => {
        setIsLoading(true);
        setErrorMessage(null); // reset error message when component is re-rendered
        setUnauthorized(false);

        if (mode === 0 || mode === 1) {       // read and update mode
            updateRows();
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
                            setErrorMessage("We regret to inform you that the sought thesis proposal has expired. Please contact the administrator for further assistance."); //? Change this to render a component ??
                            setUnauthorized(true);
                            scrollToTarget();
                        } else {
                            setTitle(data.title);
                            setSupervisor(data.supervisor_name + " " + data.supervisor_surname);
                            setLevel(data.level);
                            setType(data.type);
                            setExpDate(data.expiration_date);
                            setKeywords(data.keywords);

                            // must be set in an array of cod_degree
                            if (mode === 1) {
                                data.programmes = data.programmes?.map(program => program.cod_degree);
                            }

                            setProgrammes(data.programmes);
                            setGroups(data.groups);
                            setDescription(data.description);
                            setKnowledge(data.required_knowledge);
                            setNotes(data.notes);
                        }
                    } else {
                        setErrorMessage(data.error);
                        setUnauthorized(true);
                        scrollToTarget();
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    setErrorMessage(err.message);
                    setIsLoading(false);
                    setUnauthorized(true);
                    scrollToTarget();
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
    }, [proposal_id, currentDate, mode]);

    return (
        <>
            <NavbarContainer />
            <TitleBar title={"Proposal Details"} />
            {
                isLoading ? (<Alert variant="info" className="d-flex justify-content-center">Loading...</Alert>) : (
                    unauthorized ?
                        (<UnAuthorizationPage error={"Error"} message={errorMessage} />)
                        :
                        (<Container style={{ backgroundColor: "#F4EEE0" }} className={"proposal-details-container"} fluid>
                            <Form>
                                <Container>
                                    <div ref={targetRef}>
                                        {errorMessage &&
                                            <Row>
                                                <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>{errorMessage}</Alert>
                                            </Row>
                                        }
                                        {successMessage &&
                                            <Row>
                                                {mode === 2 && <Alert variant="success" dismissible onClose={() => setSuccessMessage(false)}>The thesis proposal has been created!</Alert>}
                                                {mode === 1 && <Alert variant="success" dismissible onClose={() => setSuccessMessage(false)}>The thesis proposal has been updated!</Alert>}
                                            </Row>
                                        }
                                    </div>
                                    <Row>
                                        <Col>
                                            {mode === 0 ?
                                                <h2 className={"proposal-details-title"}>{title}</h2>
                                                :
                                                <Form.Group>
                                                    <Card className="h-100">
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
                                                    {keywords.map((keyword, index) => <Badge key={index} bg="" style={{ backgroundColor: "#917FB3" }}>{keyword}</Badge>)}
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
                                                            aria-label='Enter description'
                                                            placeholder='Enter description'
                                                            value={description}
                                                            onChange={(e) => {
                                                                setDescription(e.target.value);
                                                            }}
                                                            readOnly={mode === 0}                   // read mode
                                                            plaintext={mode === 0}                  // read mode
                                                            required
                                                            rows={mode !== 0 ? 8 : rows}
                                                            style={{ whiteSpace: 'pre-wrap' }}
                                                        />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <Col xs={12} md={6} className="mb-1 mb-md-0">
                                            <Card className="h-100">
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
                                        <Col >
                                            <Card className="h-100">
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
                                            <Card className="h-100">
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
                                        <Col xs={12} md={6} className="mb-1 mb-md-0">
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>CdS / Programmes:</Card.Title>
                                                    {mode === 0 ?
                                                        <Card.Text>
                                                            {programmes.map((programme, index) => <Badge key={index} bg="" className="me-1" style={{ backgroundColor: "#917FB3", fontSize: "14px" }} >{programme.title_degree}</Badge>)}
                                                        </Card.Text>
                                                        :
                                                        <div>
                                                            <Form.Group>
                                                                {!level &&
                                                                    <div className="disabled-message text-muted" style={{ fontSize: "14px", marginBottom: "10px" }}>
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
                                        <Col xs={12} md={6}>
                                            <Card className="h-100">
                                                <Card.Body >
                                                    <Card.Title>Groups:</Card.Title>
                                                    {mode === 0 ?
                                                        <Card.Text>
                                                            {groups.map((group, index) => <Badge key={index} bg="" className="me-1" style={{ backgroundColor: "#917FB3", fontSize: "14px" }}>{group}</Badge>)}
                                                        </Card.Text>
                                                        :
                                                        <Form.Group className="h-100" >
                                                            {/* 
                                                            <div className="text-plus ">
                                                                <Col xs={8}>
                                                                    <Form.Control
                                                                        as={'input'}
                                                                        name='proposal-groups'
                                                                        aria-label='Enter group'
                                                                        placeholder='Enter group'
                                                                        value={newGroup}
                                                                        onChange={(e) => {
                                                                            setNewGroup(e.target.value);
                                                                        }}
                                                                        disabled
                                                                    />
                                                                </Col>
                                                                <Col >
                                                                    <Button id="add-group-btn" style={{ backgroundColor: "#4F4557", borderColor: "#4F4557" }} disabled onClick={() => {
                                                                        if (!newGroup.trim()) {
                                                                            return;
                                                                        } else if (!groups.includes(newGroup)) {
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
                                                            */}
                                                            <ListGroup className="mt-2">
                                                                {groups.map((group, index) => (
                                                                    <ListGroup.Item key={index} disabled className="d-flex justify-content-between align-items-center my-1">
                                                                        {group}
                                                                        {/*<Button
                                                                            variant="danger"
                                                                            size="sm"
                                                                            onClick={() => {
                                                                                let updated = [...groups];
                                                                                updated.splice(index, 1);
                                                                                setGroups(updated);
                                                                            }}
                                                                            disabled
                                                                        >
                                                                            Delete
                                                                        </Button>*/}
                                                                    </ListGroup.Item>
                                                                ))}
                                                            </ListGroup>
                                                        </Form.Group>
                                                    }
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                    {mode !== 0 &&
                                        <Row>
                                            <Col xs={12} md={6} className="mb-1 mb-md-0">
                                                <Card className="h-100">
                                                    <Card.Body>
                                                        <Card.Title>Expiration Date:</Card.Title>
                                                        <Form.Group>
                                                            <Form.Control
                                                                id="expiration-date"
                                                                type="date"
                                                                min={currentDate}
                                                                value={dayjs(expDate).format("YYYY-MM-DD")}
                                                                onChange={(e) => {
                                                                    setExpDate(e.target.value);
                                                                }}
                                                                required
                                                            />
                                                        </Form.Group>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <Card className="h-100">
                                                    <Card.Body >
                                                        <Card.Title>Keywords</Card.Title>
                                                        <Form.Group>
                                                            <div className="text-plus">
                                                                <Col xs={10} >
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
                                                                <Col >
                                                                    <Button id="add-keyword-btn" style={{ backgroundColor: "#4F4557", borderColor: "#4F4557" }} onClick={() => {
                                                                        if (!newKeyword.trim()) {
                                                                            return;
                                                                        } else if (!keywords.includes(newKeyword)) {
                                                                            setKeywords([...keywords, newKeyword]);
                                                                            setNewKeyword('');
                                                                        } else {
                                                                            setErrorMessage("This keyword is already in the list!");
                                                                            scrollToTarget();
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
                                            </Col>
                                        </Row>}
                                    <Row>
                                        <Col xs={12} md={6} className="mb-1 mb-md-0">
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>Required Knowledge:</Card.Title>
                                                    <Form.Group>
                                                        <Form.Control
                                                            as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                            name='required-knowledge'
                                                            rows={mode === 0 ? 1 : 4}               // read mode
                                                            aria-label='Enter required knowledge'
                                                            placeholder={mode === 0 ? "Not specified" : 'Enter required knowledge'}
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
                                        <Col xs={12} md={6}>
                                            <Card className="h-100">
                                                <Card.Body>
                                                    <Card.Title>Notes:</Card.Title>
                                                    <Form.Group>
                                                        <Form.Control
                                                            as={mode === 0 ? 'input' : 'textarea'}  // read mode
                                                            name='additional-notes'
                                                            rows={mode === 0 ? 1 : 4}               // read mode
                                                            aria-label='Enter notes'
                                                            placeholder={mode === 0 ? "Not specified" : 'Enter notes'}
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
                                        {mode === 0 &&
                                            <Col>
                                                <Button style={{ backgroundColor: "#6D5D6E", borderColor: "#6D5D6E" }}
                                                    onClick={() => { navigate('/proposals') }}>
                                                    {loggedUser.role === 1 ? "Back to Search Proposal" : "Back to Browse Proposals"}
                                                </Button>
                                            </Col>
                                        }

                                        {mode !== 0 &&
                                            <Col>
                                                <Button style={{ backgroundColor: "#6D5D6E", borderColor: "#6D5D6E" }}
                                                    onClick={() => { navigate('/proposals') }}>
                                                    Back to Browse Proposals
                                                </Button>
                                            </Col>
                                        }

                                        <Col className={"d-flex flex-row-reverse"}>
                                            {mode === 0 && loggedUser.role === 1 &&
                                                <ApplicationButton setErrMsg={setErrorMessage} proposalID={proposal_id} />}

                                            {mode === 1 && loggedUser.role === 0 &&
                                                <Button
                                                    id="add-proposal-btn"
                                                    style={{ backgroundColor: "#4F4557", borderColor: "#4F4557" }}
                                                    onClick={handleUpdateProposal}>
                                                    Save
                                                </Button>}

                                            {mode === 0 && loggedUser.role === 0 &&
                                                <Button
                                                    id="add-proposal-btn"
                                                    style={{ backgroundColor: "#4F4557", borderColor: "#4F4557" }}
                                                    onClick={handleCreateProposal}>
                                                    Create Proposal
                                                </Button>}
                                        </Col>
                                    </Row>
                                </Container>
                            </Form>
                        </Container>
                        )
                )
            }
        </>
    );
}

export default ProposalDetailsPage;