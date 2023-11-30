import React, { useState, useContext, useEffect } from 'react';
import { insertNewApplication, getAllApplicationsByStudent } from '../api/ApplicationsAPI';
import { Button } from "react-bootstrap";
import { LoggedUserContext } from "../context/AuthenticationContext";

const ApplicationButton = ({ proposalID, setErrMsg }) => {
  const [applied, setApplied] = useState(false);
  const [disabled, setDisabled] = useState(false);

  const { loggedUser } = useContext(LoggedUserContext);

  const getApplicationList = async () => {
    try {
      const Applist = await getAllApplicationsByStudent(loggedUser.id);

      if (Applist.length !== 0) {
        // student can apply only if they have no application currently pending or accepted
        if (Applist.some((a) => a.proposal_id === proposalID)) {
          setApplied(true);
        } else if (Applist.some((a) => a.status !== "Rejected" && a.proposal_id !== proposalID)) {
          setDisabled(true);
          setErrMsg("You can't apply to this proposal because you currently have pending or accepted applications.");
        }
      }
    } catch (error) {
      console.error('[FRONTEND ERROR] getting application list', error);
    }
  };

  useEffect(() => {
    getApplicationList();
  }, [loggedUser.id, proposalID]);

  const handleButtonClick = async () => {
    try {
      const response = await insertNewApplication({ proposalID });

      if (response.length !== 0 ) {
        setApplied(true);

        getApplicationList();
      } else {
        let data = await response.json();
        console.error('[FRONTEND ERROR] Apply function', data.errors[0]);
      }
    } catch (error) {
      console.error('[FRONTEND ERROR] Apply function', error);
    }
  };

  return (
    <Button id={"apply-button"} variant="secondary" onClick={handleButtonClick}
      disabled={applied || disabled}
      style={{marginLeft: "auto"}}>
      {applied ? 'Applied' : 'Apply'}
    </Button>
  );
};

export default ApplicationButton;
