import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";
import { AiOutlineFilePdf} from 'react-icons/ai';

import { useNavigate, useParams } from "react-router-dom";
import {
  getAllDegrees,
  getProposalById,
  insertNewProposal,
  updateProposalApi,
  deleteProposal,
} from "../api/ProposalsAPI";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  ListGroup,
  Row,
  Modal,
  Spinner
} from "react-bootstrap";
import ApplicationButton from "../components/ApplicationButton";

import { VirtualClockContext } from "../context/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { UnAuthorizationPage } from "../App";
import dayjs from "dayjs";
import "../style/ProposalDetails.css";
import ArchiveProposalModal from "../components/ArchiveProposalModal";

/**
 * This page supports three modes:
 *  - Read Mode: Displaying a proposal in read-only format.
 *  - Update Mode: Editing an existing proposal.
 *  - Add Mode: Adding a new proposal.
 *  - Copy Mode: Copying an existing proposal.
 *
 * @param {string} mode - A string indicating the mode:
 *  - "read"
 *  - "update"
 *  - "add"
 *  - "copy"
 */
function ProposalDetailsPage({ mode }) {
  const navigate = useNavigate();

  const { proposal_id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [unauthorized, setUnauthorized] = useState(false); // it is useful to hide fields in the page if there is some issues (for example, proposal expired or proposal not found ...)
  const [successMessage, setSuccessMessage] = useState("");

  const { currentDate } = useContext(VirtualClockContext); //! VIRTUAL CLOCK: remove this line in production
  const { loggedUser } = useContext(LoggedUserContext);

  const [title, setTitle] = useState("");
  const [supervisor, setSupervisor] = useState("");
  const [level, setLevel] = useState("");
  const [type, setType] = useState("");
  const [expDate, setExpDate] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  // const [coSupervisors, setCoSupervisors] = useState([]);
  const [groups, setGroups] = useState([{ cod_group: loggedUser.cod_group }]);
  const [description, setDescription] = useState("");
  const [knowledge, setKnowledge] = useState("");
  const [notes, setNotes] = useState("");
  const [archived, setArchived] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [timer, setTimer] = useState(5);

  const [showModal, setShowModal] = useState(false);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const truncatedDescription = description?.slice(0, 1500);
  // this is used to show the modal when the user clicks on the apply button
  const [applyingState, setApplyingState] = useState("no-applying");


  //const [newGroup, setNewGroup] = useState('');
  const [newKeyword, setNewKeyword] = useState("");

  const [fileSent, setFileSent] = useState(false);
  const [isFile, setIsFile] = useState(false);

  const targetRef = useRef(null);

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
  };

  const levelEnum = {
    BACHELOR: "Bachelor",
    MASTER: "Master",
  };

  // list of useful data
  const proposalLevelsList = [levelEnum.BACHELOR, levelEnum.MASTER];
  const [proposalDegreeList, setProposalDegreeList] = useState([]);

  const [showArchiveModal, setShowArchiveModal] = useState(false);

  /**
   * It is used to show a message error in the page to the user
   */
  const scrollToTarget = () => {
    if (targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" });
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
    return (
      level === levelEnum.MASTER &&
      (program[0].toUpperCase() === "M" || program[0].toUpperCase() === "D")
    );
  };

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
    for (let program of programmes) {
      if (!handleFilterDegreeList(program.title_degree)) {
        setErrorMessage(
          "Please select programmes compatible with the chosen level."
        );
        scrollToTarget();
        return false;
      }
    }

    return true;
  };

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
      description: description,
      required_knowledge: knowledge,
      notes: notes,
      expiration_date: expDate,
      programmes: programmes.map((program) => program.cod_degree), // it takes only the cod degree
    };

    try {
      const proposal = await insertNewProposal(newProposal);
      setSuccessMessage("The thesis proposal has been added correctly!");
      scrollToTarget();
      navigate("/proposals/" + proposal.proposal_id);
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage(err.message);
      scrollToTarget();
    }
  };

  const handleUpdateProposal = async (e) => {
    e.preventDefault();

    if (!handleProposalCheck()) {
      return;
    }

    const updatedProposal = {
      proposal_id: proposal_id,
      title: title,
      level: level,
      keywords: keywords,
      type: type,
      description: description,
      required_knowledge: knowledge,
      notes: notes,
      expiration_date: expDate,
      programmes: programmes.map((program) => program.cod_degree), // it takes only the cod degree
    };

    try {
      const proposal = await updateProposalApi(updatedProposal);

      setSuccessMessage("The thesis proposal has been updated correctly!");
      navigate("/proposals/" + proposal.proposal_id);
      scrollToTarget();
    } catch (err) {
      setSuccessMessage("");
      setErrorMessage(err.message);
      scrollToTarget();
    }
  };

  const handleDeleteProposal = async () => {
    const result = await deleteProposal(proposal_id);

    if (!(result instanceof Error)) {
      setDeleted(true);

      setTimeout(() => navigate("/proposals"), 5000);
    } else {
      setErrorMessage(result.message);
      handleClose();
    }
  };

  useEffect(() => {
    if (deleted) {
      const countdownInterval = setInterval(() => {
        setTimer((prevCount) => prevCount - 1);
      }, 1000);

      // Reindirizzamento dopo 5 secondi
      setTimeout(() => {
        clearInterval(countdownInterval);
        navigate("/proposals");
      }, 5000);
    }
  }, [deleted]);

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage(null); // reset error message when component is re-rendered
    setUnauthorized(false);
    setSuccessMessage("");

    if (mode === "read" || mode === "update" || mode === "copy") {
      // read, update and copy mode
      getProposalById(proposal_id)
        .then(async (res) => {
          let data = await res.json();

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
              setErrorMessage(
                "We regret to inform you that the sought thesis proposal has expired. Please contact the administrator for further assistance."
              ); //? Change this to render a component ??
              setUnauthorized(true);
              scrollToTarget();
            } else {
              setTitle(data.title);
              setSupervisor(
                data.supervisor_name + " " + data.supervisor_surname
              );
              setLevel(data.level);
              setType(data.type);
              setExpDate(dayjs(data.expiration_date).format("YYYY-MM-DD"));
              setKeywords(data.keywords);

              setArchived(data.archived);
              setDeleted(data.deleted);

              // must be set in an array of cod_degree
              if (mode === "update" || mode === "copy") {
                // get all degrees list
                getAllDegrees()
                  .then((list) => setProposalDegreeList(list))
                  .catch((err) => {
                    setErrorMessage(err);
                    setProposalDegreeList([]);
                    scrollToTarget();
                  });
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
        .catch((err) => {
          setErrorMessage(err.message);
          setIsLoading(false);
          setUnauthorized(true);
          scrollToTarget();
        });
    } else if (mode === "add") {
      setTitle("");
      setSupervisor(loggedUser.name + " " + loggedUser.surname);
      setLevel("");
      setType("");
      setExpDate("");
      setKeywords([]);
      setProgrammes([]);
      setGroups([{ cod_group: loggedUser.cod_group }]);
      setDescription("");
      setKnowledge("");
      setNotes("");

      setNewKeyword("");
      setProposalDegreeList([]);

      setIsLoading(false);
      getAllDegrees()
        .then((list) => setProposalDegreeList(list))
        .catch((err) => {
          setErrorMessage(err);
          setProposalDegreeList([]);
        });
    }
  }, [proposal_id, currentDate, mode]); //! VIRTUAL CLOCK: re-render component each time the virtual date changes; remove this dependency in production

  return (
    <>
      <NavbarContainer />
      <TitleBar />
      {isLoading ? (
        <Alert variant="info" className="d-flex justify-content-center">
          Loading...
        </Alert>
      ) : unauthorized ? (
        <UnAuthorizationPage error={"Error"} message={errorMessage} />
      ) : deleted ? (
        <Container>
          <Alert variant="info" className="d-flex justify-content-center">
            <p>
              <strong>Your proposal has been deleted succesfully!</strong>
              <br />
              <br />
              You will be redirected to the proposals list in {timer} ...
            </p>
          </Alert>
        </Container>
      ) : (
        <Container className="proposal-details-container" fluid>
          <Form>
            <Container>
              <div ref={targetRef}>
                {errorMessage && (
                  <Row>
                    <Alert
                      variant="danger"
                      dismissible
                      onClose={() => setErrorMessage("")}
                    >
                      {errorMessage}
                    </Alert>
                  </Row>
                )}
                {successMessage && (
                  <Row>
                    <Alert
                      variant="success"
                      dismissible
                      onClose={() => setSuccessMessage("")}
                    >
                      {successMessage}
                    </Alert>
                  </Row>
                )}
              </div>
              {mode === "add" || mode === "copy" &&
                <Row>
                  <h3 id='title-page'>
                    Add Proposal
                  </h3>
                </Row>}
                {mode === "update" &&
                <Row>
                  <h3 id='title-page'>
                    Update Proposal
                  </h3>
                </Row>}
              <Row>
                <Col>
                  {mode === "read" ? (
                    <Form.Group>
                      <Form.Control
                        id="proposal-title"
                        type="text"
                        className="proposal-details-title"
                        value={title}
                        plaintext
                        readOnly
                      />
                    </Form.Group>
                  ) : (
                    <Form.Group>
                      <Card className="h-100">
                        <Card.Body>
                          <Card.Title>
                            <span className="proposal-field-mandatory">*</span>
                            Title:
                          </Card.Title>
                          <Form.Control
                            type="text"
                            name="title"
                            rows={1}
                            aria-label="Enter title"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                            required
                          />
                        </Card.Body>
                      </Card>
                    </Form.Group>
                  )}
                </Col>
              </Row>
              {mode === "read" && (
                <>
                  <Row>
                    <Col className={"proposal-details-keyword"}>
                      {keywords.map((keyword, index) => (
                        <Badge
                          className={"proposal-details-keyword"}
                          bg=""
                          key={index}
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </Col>
                  </Row>
                  <Row>
                    <Col className={"proposal-details-expiration my-2"}>
                      <Badge bg={"danger"}>
                        Expires on {dayjs(expDate).format("DD/MM/YYYY")}
                      </Badge>
                    </Col>
                  </Row>
                </>
              )}
              <Row>
                <Col>
                  {mode === "read" && (
                    <Card>
                      <Card.Body>
                        <Card.Title>Description:</Card.Title>
                        <p
                          id="description"
                          style={{
                            maxHeight: !showFullDescription
                              ? "none"
                              : `${50 * 1.2}em`, // 1.2em is an approximate line height
                            overflowY: !showFullDescription
                              ? "visible"
                              : "auto",
                            whiteSpace: "pre-line",
                          }}
                          onKeyDown={() => { }}
                          role="button"
                          tabIndex={0}
                        >
                          <span>
                            {showFullDescription
                              ? description
                              : truncatedDescription}
                            <span
                              id="show-more"
                              onKeyDown={() => { }}
                              onClick={() =>
                                setShowFullDescription(!showFullDescription)
                              }
                              role="button"
                            >
                              {!showFullDescription &&
                                description.length >
                                truncatedDescription.length &&
                                " Show more..."}
                            </span>
                          </span>
                        </p>
                        <span
                          id="show-less"
                          onKeyDown={() => { }}
                          onClick={() =>
                            setShowFullDescription(!showFullDescription)
                          }
                          role="button"
                        >
                          {showFullDescription && " Show less..."}
                        </span>
                      </Card.Body>
                    </Card>
                  )}

                  {mode !== "read" && (
                    <Card>
                      <Card.Body>
                        <Card.Title>
                          <span className="proposal-field-mandatory">*</span>
                          Description:
                        </Card.Title>
                        <Form.Group>
                          <Form.Control
                            as="textarea"
                            name="description"
                            aria-label="Enter description"
                            placeholder="Enter description"
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
                  )}
                </Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col xs={12} md={6} className="mb-1 mb-md-0">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>
                        {mode !== "read" && (
                          <span className="proposal-field-mandatory">*</span>
                        )}
                        Supervisor:
                      </Card.Title>
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
                <Col>
                  <Card className="h-100">
                    {mode === "read" ? (
                      <Card.Body>
                        <Card.Title>Level:</Card.Title>
                        <Card.Text name="proposal-level">{level}</Card.Text>
                      </Card.Body>
                    ) : (
                      <Card.Body>
                        <Card.Title>
                          <span className="proposal-field-mandatory">*</span>
                          Level:
                        </Card.Title>
                        <Form.Group>
                          <Form.Select
                            name="proposal-level"
                            defaultValue={level}
                            onChange={(e) => {
                              setLevel(e.target.value);
                              setProgrammes([]);
                            }}
                            required
                          >
                            <option value={""} disabled>
                              Select a level
                            </option>
                            {proposalLevelsList.map((level, index) => (
                              <option key={index} value={level}>
                                {level}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Card.Body>
                    )}
                  </Card>
                </Col>
                <Col>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>
                        {mode !== "read" && (
                          <span className="proposal-field-mandatory">*</span>
                        )}
                        Type:
                      </Card.Title>
                      <Form.Group>
                        <Form.Control
                          id="proposal-type"
                          as={mode === "read" ? "input" : "textarea"}
                          name="proposal-type"
                          rows={1}
                          aria-label="Enter the type"
                          placeholder="Enter the type"
                          value={type}
                          onChange={(e) => {
                            setType(e.target.value);
                          }}
                          readOnly={mode === "read"}
                          plaintext={mode === "read"}
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
                        {mode !== "read" && (
                          <span className="proposal-field-mandatory">*</span>
                        )}
                        CdS / Programmes:
                      </Card.Title>
                      {mode === "read" ? (
                        <Card.Text
                          className={"proposal-badge"}
                          name="proposal-programmes"
                        >
                          {programmes.map((programme, index) => (
                            <Badge key={index} bg="">
                              {programme.title_degree}
                            </Badge>
                          ))}
                        </Card.Text>
                      ) : (
                        <div>
                          <Form.Group>
                            {!level && (
                              <div id="programmes-notes">
                                Please select a proposal level before choosing a
                                program.
                              </div>
                            )}
                            <Form.Select
                              name="proposal-programmes"
                              value={""}
                              onChange={(e) => {
                                if (e.target.value?.trim()) {
                                  let programsList = [...programmes];
                                  programsList.push(JSON.parse(e.target.value));
                                  setProgrammes(programsList);
                                }
                              }}
                              disabled={!level}
                            >
                              <option value={""} disabled>
                                Select a program
                              </option>
                              {proposalDegreeList
                                .filter(
                                  (program) =>
                                    handleFilterDegreeList(
                                      program.title_degree
                                    ) &&
                                    programmes.every(
                                      (p) => p.cod_degree !== program.cod_degree
                                    )
                                )
                                .map((program, index) => (
                                  <option
                                    key={index}
                                    value={JSON.stringify(program)}
                                  >
                                    {program.title_degree}
                                  </option>
                                ))}
                            </Form.Select>
                          </Form.Group>
                          <ListGroup
                            id="proposal-programmes-list"
                            className="mt-2"
                          >
                            {programmes.map((program, index) => (
                              <ListGroup.Item
                                key={index}
                                className="d-flex justify-content-between align-items-center my-1"
                              >
                                <span>{program.title_degree}</span>
                                <Button
                                  variant="danger"
                                  size="sm"
                                  onClick={() => {
                                    let updatedSelectedProgrammes = [
                                      ...programmes,
                                    ];
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
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={12} md={6}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>
                        {mode !== "read" && (
                          <span className="proposal-field-mandatory">*</span>
                        )}
                        Groups:
                      </Card.Title>
                      {mode === "read" ? (
                        <Card.Text id="groups" className={"proposal-badge"}>
                          {groups.map((group, index) => (
                            <Badge key={index} bg="">
                              {group.title_group}
                            </Badge>
                          ))}
                        </Card.Text>
                      ) : (
                        <Form.Group className="h-100">
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
                                                                    <Button id="add-group-btn" } disabled onClick={() => {
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
                          <ListGroup id="groups" className="mt-2">
                            {groups.map((group, index) => (
                              <ListGroup.Item
                                key={index}
                                disabled
                                className="d-flex justify-content-between align-items-center my-1"
                              >
                                {group.cod_group}
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
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              {mode !== "read" && (
                <Row>
                  <Col xs={12} md={6} className="mb-1 mb-md-0">
                    <Card className="h-100">
                      <Card.Body>
                        <Card.Title>
                          <span className="proposal-field-mandatory">*</span>
                          Expiration Date:
                        </Card.Title>
                        <Form.Group>
                          <Form.Control
                            id="expiration-date"
                            type="date"
                            min={currentDate} //! VIRTUAL CLOCK: remove this line in production
                            // min={dayjs().format("YYYY-MM-DD")} //! VIRTUAL CLOCK: uncomment this line in production
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
                      <Card.Body>
                        <Card.Title>
                          <span className="proposal-field-mandatory">*</span>
                          Keywords
                        </Card.Title>
                        <Form.Group>
                          <div className="text-plus">
                            <Col xs={10}>
                              <Form.Control
                                as={"input"}
                                name="proposal-keywords"
                                aria-label="Enter keyword"
                                placeholder="Enter keyword"
                                value={newKeyword}
                                onChange={(e) => {
                                  setNewKeyword(e.target.value);
                                }}
                              />
                            </Col>
                            <Col>
                              <Button
                                id="add-keyword-btn"
                                onClick={() => {
                                  let exists = true;

                                  if (!newKeyword.trim()) {
                                    return;
                                  } else if (!keywords.includes(newKeyword)) {
                                    const keywordsLowerCase = keywords.map(
                                      (k) => k.toLowerCase()
                                    );
                                    if (
                                      keywordsLowerCase.includes(
                                        newKeyword.toLowerCase()
                                      )
                                    ) {
                                      exists = true;
                                    } else {
                                      setKeywords([...keywords, newKeyword]);
                                      setNewKeyword("");
                                      exists = false;
                                    }
                                  }

                                  if (exists) {
                                    setErrorMessage(
                                      "This keyword is already in the list!"
                                    );
                                    scrollToTarget();
                                  }
                                }}
                              >
                                Add
                              </Button>
                            </Col>
                          </div>
                        </Form.Group>
                        <ListGroup id="proposal-keywords-list" className="mt-2">
                          {keywords.map((keyword, index) => (
                            <ListGroup.Item
                              key={index}
                              className="d-flex border justify-content-between align-items-center my-1"
                            >
                              {keyword}
                              <Button
                                className="delete-keyword-btn"
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
                </Row>
              )}
              <Row>
                <Col xs={12} md={6} className="mb-1 mb-md-0">
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>Required Knowledge:</Card.Title>
                      <Form.Group>
                        <Form.Control
                          as={mode === "read" ? "input" : "textarea"}
                          name="required-knowledge"
                          rows={mode === "read" ? 1 : 4}
                          aria-label="Enter required knowledge"
                          placeholder={
                            mode === "read"
                              ? "Not specified"
                              : "Enter required knowledge"
                          }
                          value={knowledge}
                          onChange={(e) => {
                            setKnowledge(e.target.value);
                          }}
                          readOnly={mode === "read"}
                          plaintext={mode === "read"}
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
                          as={mode === "read" ? "input" : "textarea"}
                          name="additional-notes"
                          rows={mode === "read" ? 1 : 4}
                          aria-label="Enter notes"
                          placeholder={
                            mode === "read" ? "Not specified" : "Enter notes"
                          }
                          value={notes}
                          onChange={(e) => {
                            setNotes(e.target.value);
                          }}
                          readOnly={mode === "read"}
                          plaintext={mode === "read"}
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button
                    id="go-back"
                    onClick={() => {
                      navigate("/proposals");
                    }}>
                    Return
                  </Button>
                </Col>
                <Col>
                  <Row className="no-gutters m-0 p-0">
                    {mode === "read" &&
                      loggedUser.role === 0 &&
                      !archived &&
                      !deleted && (
                        <Col as={Row} xs={12} sm={3}>
                          <Button
                            id="archive-proposal-btn"
                            variant="outline-warning"
                            onClick={() => setShowArchiveModal(true)}
                          >
                            Archive proposal
                          </Button>
                        </Col>
                      )}

                    {mode === "read" && loggedUser.role === 0 && (
                      <Col as={Row} xs={12} sm={3}>
                        <Button
                          id="update-proposal-btn"
                          variant="outline-primary"
                          onClick={() =>
                            navigate("/proposals/" + proposal_id + "/update")
                          }
                        >
                          Update proposal
                        </Button>
                      </Col>
                    )}

                    {mode === "read" && loggedUser.role === 0 && (
                      <Col as={Row} xs={12} sm={3}>
                        <Button
                          id="copy-proposal-btn"
                          variant="outline-success"
                          onClick={() =>
                            navigate("/proposals/" + proposal_id + "/copy")
                          }
                        >
                          Copy proposal
                        </Button>
                      </Col>
                    )}

                    {mode === "read" && loggedUser.role === 0 && !deleted && (
                      <Col as={Row} xs={12}>
                        <Button
                          id="delete-proposal-btn"
                          variant="outline-danger"
                          onClick={handleShow}
                        >
                          Delete proposal
                        </Button>
                      </Col>
                    )}
                  </Row>
                </Col>

                {mode === "read" && loggedUser.role === 1 &&
                  <Col as={Row} xs={12} sm={3}>
                    <ApplicationButton
                      setErrMsg={setErrorMessage}
                      proposalID={proposal_id}
                      applicationStatusCallback={setApplyingState}
                      setFileSent={setFileSent}
                      setIsFile={setIsFile}
                    />
                  </Col>
                }

                {mode === "update" && loggedUser.role === 0 && (
                  <Col as={Row} xs={12} sm={3}>
                    <Button
                      id="add-proposal-btn"
                      onClick={handleUpdateProposal}
                    >
                      Save
                    </Button>
                  </Col>
                )}

                {(mode === "add" || mode === "copy") &&
                  loggedUser.role === 0 && (
                    <Col as={Row} xs={12} sm={3} className="d-flex flex-row-reverse">
                      <Button
                        id="add-proposal-btn"
                        onClick={handleCreateProposal}
                      >
                        Create Proposal
                      </Button>
                    </Col>
                  )}
              </Row>
              <Modal show={showModal} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                  <Modal.Title>Are you sure?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  You are <strong>deleting</strong> this application:{" "}
                  <strong>{title}</strong>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    id="cancel-delete-proposal"
                    variant="danger"
                    onClick={handleClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    id="confirm-delete-proposal"
                    variant="success"
                    onClick={handleDeleteProposal}
                  >
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
              {showArchiveModal && (
                <ArchiveProposalModal
                  show={showArchiveModal}
                  onHide={() => setShowArchiveModal(false)}
                  proposal_id={proposal_id}
                  proposal_title={title}
                  setSuccessMessage={setSuccessMessage}
                  setErrorMessage={setErrorMessage}
                  scrollToTarget={scrollToTarget}
                  setArchived={setArchived}
                />
              )}
              <Modal show={applyingState !== "no-applying"}>
                <Modal.Header>
                  <Modal.Title>Applying for this proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body className={"align-content-center align-items-center"}>
                  <Container>
                    <Row className={"align-items-center align-content-center"}>
                      <Col lg={3}>
                        {applyingState === "applying" ?
                          <Spinner animation="border" role="status" style={{ margin: "auto" }} /> :
                          <>
                            <svg className="svg-icon" width={50} height={50} viewBox="0 0 20 20">
                              <path d="M17.388,4.751H2.613c-0.213,0-0.389,0.175-0.389,0.389v9.72c0,0.216,0.175,0.389,0.389,0.389h14.775c0.214,0,0.389-0.173,0.389-0.389v-9.72C17.776,4.926,17.602,4.751,17.388,4.751 M16.448,5.53L10,11.984L3.552,5.53H16.448zM3.002,6.081l3.921,3.925l-3.921,3.925V6.081z M3.56,14.471l3.914-3.916l2.253,2.253c0.153,0.153,0.395,0.153,0.548,0l2.253-2.253l3.913,3.916H3.56z M16.999,13.931l-3.921-3.925l3.921-3.925V13.931z"></path>
                            </svg>
                            {
                              applyingState === "applied_mail_success" ?
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> :
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            }
                          </>
                        }
                      </Col>
                      <Col id={"email-sending-message"}>
                        {applyingState === "applying" &&
                          <>
                            You have <b>applied</b> for this proposal!<br />
                            <i>We are inserting your application and sending an email notification to the teacher.</i>
                          </>
                        }
                        {applyingState === "error" &&
                          <>
                            There was an <b>error</b> while applying for this proposal. Retry later.<br />
                          </>
                        }
                        {applyingState === "applied_mail_success" &&
                          <>
                            Your application has been inserted successfully!<br />
                            <i>An email notification has been sent to the teacher.</i>
                          </>
                        }
                        {applyingState === "applied_mail_error" &&
                          <>
                            Your application has been inserted successfully!<br />
                            <i>There was an error while sending the email notification to the teacher, but your application has still been inserted anyways.</i>
                          </>
                        }
                      </Col>
                    </Row>
                    <Row>
                      { fileSent && isFile ? (
                         <Col className="d-flex align-items-center text-success">
                         <AiOutlineFilePdf size={50} /> 
                         <i>Your file has been added successfully to your application.</i>
                         </Col>
                      ) : !fileSent && isFile ? (
                        <Col className="d-flex align-items-center text-danger">
                         <AiOutlineFilePdf size={50} />
                         <i>An error occured, your file has not been sent with your application</i>
                         </Col>
                      ) :(
                        <></>
                      )
                      }
                    </Row>
                  </Container>
                </Modal.Body>
                {
                  applyingState === "error" && (
                    <Modal.Footer>
                      <Button id="close-modal" variant="secondary" onClick={() => {
                        setApplyingState("no-applying");
                      }}>
                        Go back
                      </Button>
                    </Modal.Footer>
                  )
                }
                {
                  (applyingState === "applied_mail_success" || applyingState === "applied_mail_error") && (
                    <Modal.Footer>
                      <Button id="close-modal" variant="secondary" onClick={() => {
                        navigate("/applications");
                      }}>
                        Go to your applications
                      </Button>
                    </Modal.Footer>

                  )
                }
              </Modal>
            </Container>
          </Form>
        </Container>
      )
      }
    </>
  );
}

ProposalDetailsPage.propTypes = {
  mode: PropTypes.string,
};

export default ProposalDetailsPage;
