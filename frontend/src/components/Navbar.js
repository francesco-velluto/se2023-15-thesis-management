import { Navbar, Nav, Button, Col, Form, Dropdown, InputGroup, FormControl } from 'react-bootstrap';
import { FaCalendar } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { VirtualClockContext } from '../context/VirtualClockContext';
import { useContext, useState } from 'react';

import dayjs from 'dayjs';
import Logo from '../images/logo_poli_bianco_260.png'

function NavbarContainer() {

    const navigate = useNavigate();
    const { currentDate, setCurrentDate } = useContext(VirtualClockContext);
    const [showFormControl, setShowFormControl] = useState(false);
    const { handleLogout } = useContext(LoggedUserContext);
    const { loggedUser } = useContext(LoggedUserContext);
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
      };
      const handleButtonClick = () => {
        setShowFormControl(true);
      };

    return (
        <>
            <Navbar expand="md" className='px-3 navbar-dark d-flex justify-content-between' style={{ backgroundColor: "#393646" }} >
                <Navbar.Brand as={Link} to={"/"}>
                <div>
                <img src={Logo} alt="Logo" width="70" height="auto" className="bi bi-mortarboard-fill me-2"  />
                <span  style={{ fontSize: '20px', fontWeight: "bold"}}> THESIS MANAGEMENT </span>
                </div>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    <Nav className="mr-auto" style={{ color: 'whitesmoke', cursor: 'pointer' }}>
                        <Col className='me-0 me-md-3 my-3 my-md-0'>
                                <InputGroup className='d-flex justify-content-center'>

                                    {!showFormControl && (
                                        <Button id="show-virtual-clock-btn" onClick={handleButtonClick} style={{ backgroundColor: 'white', color: '#393646', borderColor: 'white', height: '50px', width: '50px' }}>
                                            <FaCalendar />
                                        </Button>
                                    )}
                                    {showFormControl && (
                                        <Form.Control
                                        id="virtual-clock-form"
                                        type="date"
                                        min={dayjs().format("YYYY-MM-DD")}
                                        value={currentDate}
                                        onChange={(ev) => setCurrentDate(ev.target.value)}
                                        style={{ backgroundColor: 'white', color: '#393646', borderColor: 'white', height: '50px', width:'135px', lineHeight: '37px'  }}
                                        />
                                    )}
                                </InputGroup>
                        </Col>
                        <Col className='me-0 me-md-3 my-3 my-md-0 d-flex justify-content-center align-items-center'>
                            <Dropdown show={showDropdown} onToggle={toggleDropdown} className='d-flex flex-column justify-content-center align-items-center' >
                            <Dropdown.Toggle
                                variant="danger"
                                id="dropdown-basic"
                                style={{ backgroundColor: 'white', color: '#393646', height: '50px', borderColor: 'white', justifySelf: 'center', display: 'flex', alignItems: 'center', fontSize: '16px' }}
                            >
                                <svg
                                onClick={() => navigate("/")}
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="40"
                                fill="currentColor"
                                className="bi bi-person-fill"
                                viewBox="0 0 16 16"
                                >
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                                {' ' + (loggedUser.name || 'Guest')}
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ minWidth: "120px" }}>
                                <Dropdown.Item onClick={handleLogout} style={{ backgroundColor: 'white', color: '#393646', fontSize:"16px"}}>Logout</Dropdown.Item>
                            </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>

        </>
    );
}

export default NavbarContainer;
