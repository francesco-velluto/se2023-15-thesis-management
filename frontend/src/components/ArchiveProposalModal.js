import { useEffect, useState } from "react";
import { Button, Container, Modal, Spinner } from "react-bootstrap";
import { getAllApplicationsByProposalId } from "../api/ApplicationsAPI";
import { getStudentById } from "../api/StudentsAPI";
import { useNavigate } from "react-router-dom";

function ArchiveProposalModal({ show, onHide, proposal_id, proposal_title }) {

    const navigate  = useNavigate();

    const [applications, setApplications] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {

        async function getApplications() {
            setLoading(true);
            const applicationsDB = await getAllApplicationsByProposalId(proposal_id);
            setApplications(applicationsDB ? applicationsDB : []);

            if((applicationsDB ? applicationsDB : []).length > 0) {
                for(const application of applicationsDB) {
                    const studentInfo = await getStudentById(application.student_id);
                    setStudents((students) => {

                        if (!students.some(student => student.id === application.student_id)) {
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
        onHide();
    }

           
    return (
          <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
              <Modal.Title>Archive Proposal</Modal.Title>
            </Modal.Header>
            {
                loading ? (
                    <Container fluid className="text-center my-5">
                    <Spinner animation="border" role="status">
                    </Spinner>
                    </Container>
                ) : 
                    
                <Modal.Body>
                    <Container fluid className="text-center mb-4"><h3>{proposal_title}</h3></Container>
                <p>Are you sure you want to archive this proposal?</p>
                <p>Pay attention, this will cancel all the pending applications on it...</p>
                <p>Actually there {applications.filter(application => application.status === "Pending").length !== 1 ? "are" : "is"} <span style={{fontWeight: "bold"}}>{applications.filter(application => application.status === "Pending").length}</span> pending application{applications.filter(application => application.status === "Pending").length !== 1 ? "s" : ""}.</p>
                {
                    //if there is at least a pending application, show the list of them. A pending application is an application that has the status "pending"
                    applications.filter(application => application.status === "Pending").length > 0 && (
                    <div>
                        <p>Application{applications.filter(application => application.status === "Pending").length !== 1 ? "s" : ""} to be cancelled:</p>
                        <ul>
                        {
                            applications.filter(application => application.status === "Pending").map(application => {
                            return <li>
                                
                                {students.filter(student => student.id === application.student_id)[0].name + " " + students.filter(student => student.id === application.student_id)[0].surname + " - " + students.filter(student => student.id === application.student_id)[0].id}
                                
                                </li>
                            })
                        }
                        </ul>
                    </div>
                    )
                }

                {
                    //if there is at least a pending application, show the list of them. A pending application is an application that has the status "pending"
                    applications && applications.filter(application => application.status === "Pending").length > 0 && 
                    <Button className="mt-5" variant="outline-warning" onClick={() => navigate('/applications')}>
                        Browse applications
                    </Button>
                }

                </Modal.Body>
            }
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>Cancel</Button>
              <Button variant="primary" onClick={handleArchiveProposal}>Archive</Button>
            </Modal.Footer>
          </Modal>
        )
      ;
}
export default ArchiveProposalModal;