import { Navbar, Nav, Button, Col, Form, Dropdown, InputGroup } from 'react-bootstrap';
import { FaCalendar, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { LoggedUserContext } from '../context/AuthenticationContext';
import { VirtualClockContext } from '../context/VirtualClockContext';
import { useContext, useEffect, useState } from 'react';

import dayjs from 'dayjs';
import Logo from '../images/logo_poli_bianco_260.png'

function NavbarContainer() {
    const { currentDate, updateCurrentDate } = useContext(VirtualClockContext);
    const [selectedDate, setSelectedDate] = useState("");
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

    useEffect(() => {
        setSelectedDate(currentDate);
    }, [currentDate]);

    return (
        <Navbar expand="md" className='px-3 navbar-dark d-flex'>
            <Navbar.Brand as={Link} to={"/"}>
                <div>
                    <img src={Logo} alt="Logo" width="60" height="auto" className="bi bi-mortarboard-fill me-2" />
                    <span id="navbar-title"> THESIS MANAGEMENT </span>
                </div>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" id="basic-navbar-toggle"/>
            <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                <Nav className="mr-auto" id="navbar-toggle">
                    <Col className='me-0 me-md-3 my-3 my-md-0 d-flex justify-content-center'>
                        <InputGroup className='d-flex justify-content-center me-2'>

                            {!showFormControl && (
                                <Button id="show-virtual-clock-btn" onClick={handleButtonClick} >
                                    <FaCalendar />
                                </Button>
                            )}
                            {showFormControl && (
                                <>
                                    <Form.Control
                                        id="virtual-clock-form"
                                        type="date"
                                        min={dayjs(currentDate).format("YYYY-MM-DD")}
                                        value={selectedDate}
                                        onChange={(ev) => setSelectedDate(ev.target.value)}
                                    />
                                    {!dayjs(selectedDate).isSame(currentDate) &&
                                    <Button variant='success' disabled={dayjs(selectedDate).isSame(currentDate)} id="apply-new-date" onClick={() => updateCurrentDate(selectedDate)} >
                                        <FaCheck />
                                    </Button>}
                                </>
                            )}
                        </InputGroup>
                        <Dropdown show={showDropdown} onToggle={toggleDropdown} className='d-flex flex-column justify-content-center align-items-center' >
                            <Dropdown.Toggle
                                variant="danger"
                                id="dropdown-basic"
                            >
                                <svg
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
                            <Dropdown.Menu >
                                <Dropdown.Item id="logout-id" onClick={handleLogout} >Logout</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default NavbarContainer;
