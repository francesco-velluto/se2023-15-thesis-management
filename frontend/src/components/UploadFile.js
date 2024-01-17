import React, { useState, useContext } from 'react';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { uploadFile, fetchFileInfo } from '../api/ApplicationsAPI';
import { Row, Col, Button } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import { AiOutlineFilePdf, AiOutlineSearch, AiOutlineDelete } from 'react-icons/ai';
import { NativeTypes } from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import Swal from 'sweetalert2';

const UploadResume = ({ setCallbackUploadId }) => {
  const { loggedUser } = useContext(LoggedUserContext);
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [filename, setFilename] = useState("");
  const [isUploaded, setIsUploaded] = useState(false);
  const [uploadId, setUploadId] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [isFilename, setIsFileName] = useState(false);

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: [NativeTypes.FILE],
    drop: (item) => handleFileDrop(item.files),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    setIsActive(true);
  };

  const handleFileDrop = (files) => {
    setFile(files[0]);
    setIsActive(true);
  };

  const handleFilenameChange = (e) => {
    const enteredFilename = e.target.value;
    setFilename(enteredFilename);
    setIsFileName(true);
    if (enteredFilename === "" ) {
      setIsFileName(false);

    }
  };


  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      if (filename) {
        formData.append('file', file, filename);
        const response = await uploadFile(loggedUser.id, formData);

        const upload_id = response.upload_id;
        setUploadId(upload_id);
        setCallbackUploadId(upload_id);
        setIsUploaded(true);

        const info = await fetchFileInfo({ upload_id: upload_id });
        setFileInfo(info);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      Swal.fire({
        icon: "error",
        title: "An error occured",
        text: "Something went wrong!",
      });
    }
  };

  const handleReset = () => {
    setFile(null);
    setFilename("");
    setIsActive(false);
    setIsFileName(false);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div>
      {!isUploaded && (
        <div>
          <div ref={drop} className={`upload-div ${isActive ? 'active' : ''}`}>
            <Row>
              <Col xs={10}>
                <p className="upload-message">
                  {isActive ? 'File dropped. Click "Upload" to proceed.' : 'Drag a file here or click below'}
                </p>
              </Col>
              <Col></Col>
            </Row>
          </div>
          {!isActive ? (
            <div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="upload-input mt-3"
                title='Browse'
              />
            </div>
          ) : (
            <span> {file.name} </span>
          )}
          <div className="d-flex align-items-center">
            <p className="filename-title"> Enter a filename </p>
            <span className="proposal-field-mandatory">*</span>
            <input
              type="text"
              id="filename"
              title="Filename"
              className='filename-input'
              value={filename}
              onChange={handleFilenameChange}
              required
            />
            <Button onClick={handleReset} id="reset-button" title="Reset file">
              <AiOutlineDelete size={30} />
            </Button>
          </div>
          <Button onClick={handleUpload} id="upload-button" disabled={!isFilename || !isActive}>
            Upload
          </Button>
        </div>
      )}

      {isUploaded && (
        <Row className="d-flex align-items-center">
          <Col xs={2}>
            <AiOutlineFilePdf size={50} />
          </Col>
          {fileInfo && (
            <Col>
              <p className="mb-0 fw-bold">{fileInfo.data.filename}</p>
              <p className="mb-0">Uploaded on {formatDate(fileInfo.data.date_uploaded)}</p>
            </Col>
          )}
          <Col>
            <AiOutlineSearch />
            <a
              href={`/applications/upload/${uploadId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="resume-link"
            >
              See preview
            </a>
          </Col>
        </Row>
      )}
    </div>
  );
};

UploadResume.propTypes = {
  setCallbackUploadId: PropTypes.func,
};

export default UploadResume;
