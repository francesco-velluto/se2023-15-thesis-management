import { useContext, useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import NavbarContainer from "../components/Navbar";
import TitleBar from "../components/TitleBar";

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
import ApplicationButton from "./ApplicationButton";

import { VirtualClockContext } from "../context/VirtualClockContext";
import { LoggedUserContext } from "../context/AuthenticationContext";
import { UnAuthorizationPage } from "../App";
import dayjs from "dayjs";
import "../style/ProposalDetails.css";
import ArchiveProposalModal from "../components/ArchiveProposalModal";
import { set } from "date-fns";

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

  const [showModal, setShowModal] = useState(false);

  const [showFullDescription, setShowFullDescription] = useState(false);
  const truncatedDescription = description?.slice(0, 1500);
    // this is used to show the modal when the user clicks on the apply button
    const [applyingState, setApplyingState] = useState("no-applying");

    const [showFullDescription, setShowFullDescription] = useState(false);
    const truncatedDescription = description?.slice(0, 1500);

  //const [newGroup, setNewGroup] = useState('');
  const [newKeyword, setNewKeyword] = useState("");

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
      navigate("/proposals");
      setDeleted(true);
    } else {
      setErrorMessage(result.message);
      handleClose();
    }
  };

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
              {mode === "add" &&
                <Row>
                  <h3 id='title-page'>
                    Add Proposal
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
                    }}
                  >
                    Return
                  </Button>
                </Col>
                <Col className={"d-flex flex-row-reverse"}>
                  {mode === "read" && loggedUser.role === 0 && !deleted && (
                    <Button
                      id="delete-proposal-btn"
                      variant="outline-danger"
                      onClick={handleShow}
                    >
                      Delete proposal
                    </Button>
                  )}
                  {mode === "read" &&
                    loggedUser.role === 0 &&
                    !archived &&
                    !deleted && (
                      <Button
                        id="archive-proposal-btn"
                        variant="outline-warning"
                        className="me-2"
                        onClick={() => setShowArchiveModal(true)}
                      >
                        Archive proposal
                      </Button>
                    )}

                  {mode === "read" && loggedUser.role === 0 && (
                    <Button
                      id="update-proposal-btn"
                      variant="outline-primary"
                      className="me-2"
                      onClick={() =>
                        navigate("/proposals/" + proposal_id + "/update")
                      }
                    >
                      Update proposal
                    </Button>
                  )}

                  {mode === "read" && loggedUser.role === 0 && (
                    <Button
                      id="copy-proposal-btn"
                      variant="outline-success"
                      className="me-2"
                      onClick={() =>
                        navigate("/proposals/" + proposal_id + "/copy")
                      }
                    >
                      Copy proposal
                    </Button>
                  )}

                                            {mode === "read" && loggedUser.role === 1 &&
                                                <ApplicationButton
                                                    setErrMsg={setErrorMessage}
                                                    proposalID={proposal_id}
                                                    applicationStatusCallback={setApplyingState}
                                                />
                                            }

                  {mode === "update" && loggedUser.role === 0 && (
                    <Button
                      id="add-proposal-btn"
                      onClick={handleUpdateProposal}
                    >
                      Save
                    </Button>
                  )}

                  {(mode === "add" || mode === "copy") &&
                    loggedUser.role === 0 && (
                      <Button
                        id="add-proposal-btn"
                        onClick={handleCreateProposal}
                      >
                        Create Proposal
                      </Button>
                    )}
                </Col>
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
            </Container>
          </Form>
        </Container>
      )}
    </>
  );
}

ProposalDetailsPage.propTypes = {
  mode: PropTypes.string,
};

export default ProposalDetailsPage;
