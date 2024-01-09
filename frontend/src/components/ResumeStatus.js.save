import React, { useState, useEffect, useContext } from 'react';
import { LoggedUserContext } from "../context/AuthenticationContext";
import { fetchStudentResume, fetchResumeInfo } from "../api/StudentsAPI";
import { AiOutlineFilePdf } from 'react-icons/ai';
import { Col, Row, Container } from 'react-bootstrap';
import UploadResume from './UploadFile';

const ResumeStatus = () => {
  const { loggedUser } = useContext(LoggedUserContext);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await fetchStudentResume(loggedUser.id);
        setFileUrl(url);

        const info = await fetchResumeInfo(loggedUser.id);
        setFileInfo(info);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [loggedUser.id]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
<>
      {fileInfo && fileUrl ? (
        <Container className="resume-container resume-hover">
          <a
            href={`/students/preview`}
            target="_blank"
            rel="noopener noreferrer"
            className="resume-link"
          >
            <Row className="align-items-center">
              <Col xs={2}>
                <AiOutlineFilePdf size={50} className="resume-icon" />
              </Col>
              <Col>
                <p className="mb-0 fw-bold">{fileInfo.data.filename}</p>
                <p className="mb-0">Uploaded on {formatDate(fileInfo.data.date_uploaded)}</p>
              </Col>
            </Row>
          </a>
        </Container>
      ) : (
        <Container className='upload-container'>
            <UploadResume />
        </Container>
      )}
    </>
  );
};

export default ResumeStatus;
