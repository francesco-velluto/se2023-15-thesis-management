import { Navbar, Nav, Button, Col, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUserContext } from '../api/Context';
import { VirtualClockContext } from './VirtualClockContext';
import { useContext } from 'react';

function NavbarContainer() {
    const navigate = useNavigate();
    const { currentDate, setCurrentDate } = useContext(VirtualClockContext);
    const { handleLogout } = useContext(LoggedUserContext);

    return (
        <>
            <Navbar expand="lg" className='px-3 navbar-dark d-flex justify-content-between' style={{ backgroundColor: "#e68b00" }} >
                <Navbar.Brand as={Link} to={"/"}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-mortarboard-fill me-2" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z" />
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z" />
                    </svg>
                    THESIS MANAGEMENT
                </Navbar.Brand>

                <Nav className="mr-auto" style={{ color: 'whitesmoke', cursor: 'pointer' }}>
                    <Form.Control type="date" value={currentDate} 
                        onChange={(ev) => setCurrentDate(ev.target.value)} />
                </Nav>
                <Nav className="mr-auto" style={{ color: 'whitesmoke', cursor: 'pointer' }}>
                    <Col className='me-3'>
                        <Button variant="danger" onClick={handleLogout}>Logout</Button>
                    </Col>
                    <Col>
                        <svg onClick={() => { navigate("/") }}
                            xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                        </svg>
                    </Col>
                </Nav>
            </Navbar>

        </>
    );
}

export default NavbarContainer;
