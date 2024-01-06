import React, { useState, useEffect, useContext } from 'react';
import { fetchStudentResume } from '../api/StudentsAPI';
import { LoggedUserContext } from "../context/AuthenticationContext";

const PreviewResume = () => {
  const [fileUrl, setFileUrl] = useState(null);
  const { loggedUser } = useContext(LoggedUserContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await fetchStudentResume(loggedUser.id);
        setFileUrl(url);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, []); 

  return (
    <div>
      {fileUrl ? (
        <iframe
          title="Resume Preview"
          src={fileUrl}
          width="100%"
          style={{ height: '100vh' }}
        ></iframe>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PreviewResume;
