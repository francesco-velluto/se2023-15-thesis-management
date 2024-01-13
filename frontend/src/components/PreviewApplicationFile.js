import React, { useState, useEffect } from 'react';
import { fetchUploadedFile } from '../api/ApplicationsAPI';
import { useParams } from 'react-router-dom';


const PreviewApplicationFile= () => {
  const { application_id } = useParams();
  const [fileUrl, setFileUrl] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = await fetchUploadedFile({ application_id: application_id });
        setFileUrl(url);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchData();
  }, [application_id]); 

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

export default PreviewApplicationFile;
