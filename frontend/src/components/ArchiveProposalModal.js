import { useEffect, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import { getAllApplicationsByProposalId } from "../api/ApplicationsAPI";
import { getStudentById } from "../api/StudentsAPI";
import { useNavigate } from "react-router-dom";
import { archiveProposal } from "../api/ProposalsAPI";
import PropTypes from "prop-types";

function ArchiveProposalModal({
  show,
  onHide,
  proposal_id,
  proposal_title,
  setSuccessMessage,
  setErrorMessage,
  scrollToTarget,
  setArchived,
}) {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getApplications() {
      setLoading(true);
      const applicationsDB = await getAllApplicationsByProposalId(proposal_id);
      setApplications(applicationsDB || []);

      if (applicationsDB && applicationsDB.length > 0) {
        for (const application of applicationsDB) {
          const studentInfo = await getStudentById(application.student_id);
          setStudents((students) => {
            if (!students.some((student) => student.id === application.student_id)) {
              students.push(studentInfo);
            }

            return students;
          });
        }
      }

      setLoading(false);
    }
    getApplications();
  }, []);


  async function handleArchiveProposal() {
    try {
      const response = await archiveProposal(proposal_id);

      if (response === true) {
        setSuccessMessage("Proposal archived successfully");
        setErrorMessage("");
        setArchived(true);
      } else {
        setSuccessMessage("");
        setErrorMessage(
          "Something went wrong during the archive of the proposal"
        );
      }
    } catch (err) {
      console.log(err);
      setSuccessMessage("");
      setErrorMessage(
        "Something went wrong during the archive of the proposal"
      );
    }

    scrollToTarget();
    onHide();
  }

  const pendingApplications = applications.filter(
    (application) => application.status === "Pending"
  );

  const acceptedApplication = applications.filter(
    (application) => application.status === "Accepted"
  );

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Archive Proposal</Modal.Title>
      </Modal.Header>
      {loading ? (
        <Container fluid className="text-center my-5">
          <output>
            <Spinner animation="border"></Spinner>
          </output>
        </Container>
      ) : (
        <Modal.Body>
          <Container fluid className="text-center mb-4">
            <h3>{proposal_title}</h3>
          </Container>

            <>
              <p>Are you sure you want to archive this proposal?</p>
              <p>
                Pay attention, this will cancel all the pending applications on
                it...
              </p>
              <p>
                Actually there {pendingApplications.length !== 1 ? "are" : "is"}{" "}
                <span style={{ fontWeight: "bold" }}>
                  {pendingApplications.length}
                </span>{" "}
                pending application{pendingApplications.length !== 1 ? "s" : ""}
                .
              </p>
              {pendingApplications.length > 0 && (
              <div>
                <p>
                  Application{pendingApplications.length !== 1 ? "s" : ""} to be cancelled:
                </p>
                <ul className="pending-applications-names-list">
                  {pendingApplications.map((application) => {
                    const student = students.find((student) => student.id === application.student_id);
                    if (student) {
                      return (
                        <li key={student.id}>
                          {`${student.name} ${student.surname} - ${student.id}`}
                        </li>
                      );
                    }
                    return null;
                  })}
                </ul>
              </div>
            )}
              {applications && pendingApplications.length > 0 && (
                <Button
                  className="mt-5"
                  variant="outline-primary"
                  onClick={() => navigate("/applications")}
                >
                  Browse applications
                </Button>
              )}
            </>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        {acceptedApplication.length === 0 && (
          <Button variant="primary" onClick={handleArchiveProposal}>
            Archive
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

ArchiveProposalModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  proposal_id: PropTypes.string.isRequired,
  proposal_title: PropTypes.string.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
  setErrorMessage: PropTypes.func.isRequired,
  scrollToTarget: PropTypes.func.isRequired,
  setArchived: PropTypes.func.isRequired,
};

export default ArchiveProposalModal;
