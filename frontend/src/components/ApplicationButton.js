import React, { useState, useContext, useEffect } from 'react';
import { insertNewApplication, getAllApplicationsByStudent } from '../api/ApplicationsAPI';
import { Button, Container, Modal } from "react-bootstrap";
import { LoggedUserContext } from "../context/AuthenticationContext";
import PropTypes from "prop-types";
import UploadResume from './UploadFile';

const ApplicationButton = ({ proposalID, setErrMsg, applicationStatusCallback, setFileSent, setIsFile }) => {
  const [applied, setApplied] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [uploadId, setUploadId] = useState(null);

  /**
   * This is used to communicate to the proposal details page that the application is being applied.
   * It is used to show a spinner while the application is being applied and error/success states.
   * It can have five values:
   * - no-applying: the application is not being applied
   * - applying: the application is being applied
   * - applied_mail_success: the application has been applied
   * - applied_mail_error: the application has been applied but the email has not been sent
   * - error: an error occurred while applying the application
   */


  const { loggedUser } = useContext(LoggedUserContext);

  const getApplicationList = async () => {
    try {
      const Applist = await getAllApplicationsByStudent(loggedUser.id);

      if (Applist.length !== 0) {
        // student can apply only if they have no application currently pending or accepted
        if (Applist.some((a) => a.proposal_id === proposalID)) {
          setApplied(true);
        } else if (Applist.some((a) => a.status !== "Rejected" && a.status !== "Canceled" && a.proposal_id !== proposalID)) {
          setDisabled(true);
          setErrMsg("You can't apply to this proposal because you currently have pending or accepted applications.");
        }
      }
    } catch (error) {
      console.error('[FRONTEND ERROR] getting application list', error);
    }
  };

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    applicationStatusCallback("no-applying");
    getApplicationList();
  }, [loggedUser.id, proposalID]);

  const handleButtonClick = async () => {
    try {
      await applicationStatusCallback("applying");
      const response = await insertNewApplication({ proposalID }, uploadId);
      if(uploadId){
        setIsFile(true);
      }

      if (response.length !== 0) {
        let data = await response.json();
        setApplied(true);
        setFileSent(data.fileSent)
        await getApplicationList();
        await applicationStatusCallback(data.emailNotificationSent ? "applied_mail_success" : "applied_mail_error");
      } else {
        let data = await response.json();
        console.error('[FRONTEND ERROR] Apply function', data.errors[0]);
      }
    } catch (error) {
      console.error('[FRONTEND ERROR] Apply function', error);
      applicationStatusCallback("error");
    }
  };

  return (
    <Container>
        <Button id={"apply-button"} variant="secondary" onClick={handleShow}
          disabled={applied || disabled}
          style={{ marginLeft: "auto" }}
          >
          {applied ? 'Applied' : 'Apply'}
        </Button>
        <Modal show={showModal} onHide={handleClose} backdrop="static">
          <Modal.Header closeButton>
            <Modal.Title>Add a PDF file (optionnal)</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UploadResume setCallbackUploadId={setUploadId} />
          </Modal.Body>
          <Modal.Footer>
            <Button
              id="confirm-application"
              variant="success"
              onClick={handleButtonClick}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
    </Container>
  );
};

ApplicationButton.propTypes = {
  proposalID: PropTypes.string,
  setErrMsg: PropTypes.func
}

export default ApplicationButton;
