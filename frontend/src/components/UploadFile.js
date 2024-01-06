import React, { useState, useContext } from 'react';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { uploadFile } from '../api/StudentsAPI';
import { Row, Col, Button } from 'react-bootstrap';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

const UploadResume = () => {
  const { loggedUser } = useContext(LoggedUserContext);
  const [file, setFile] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const [{ canDrop, isOver }, drop] = useDrop({
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

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await uploadFile(loggedUser.id, formData);
      console.log(response);
      alert('File uploaded successfully');

      window.location.reload();
    } catch (error) {
      console.error('Error uploading file:', error.message);
      alert('Error uploading file');
    }
  };

  return (
    <div>
    <h > Upload your resume</h>
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
  { !isActive ? (
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
    <Button onClick={handleUpload} id="upload-button" disabled={!isActive}>
      Upload
    </Button>
  </div>
  );
};

export default UploadResume;
