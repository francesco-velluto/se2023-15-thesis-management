import React, { useState, useContext, useEffect } from 'react';
import { insertNewApplication } from '../api/ApplicationsAPI';
import { Button } from "react-bootstrap";
import { getAllApplicationsByStudent } from '../api/ApplicationsAPI';
import { LoggedUserContext } from "../context/AuthenticationContext";

const ApplicationButton = ({ proposalID }) => {
  const [applied, setApplied] = useState(false);
  const { loggedUser } = useContext(LoggedUserContext);

  const getApplicationList = async () => {
    try {
      const Applist = await getAllApplicationsByStudent(loggedUser.id);

      if (Applist.length !== 0) {
        for (let application of Applist) {
          if (application.proposal_id === proposalID) {
            setApplied(true);
            break;
          }
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
      disabled={applied} 
      style={{marginLeft: "auto"}}>
      {applied ? 'Applied' : 'Apply'}
    </Button>
  );
};

export default ApplicationButton;
