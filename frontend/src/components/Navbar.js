import { Navbar, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


function NavbarContainer() {

    const navigate = useNavigate();

    return (
        <>
        
        <Navbar expand="lg" className='px-3 navbar-dark d-flex justify-content-between' style={{backgroundColor: "#e68b00"}} >
            <div
                onClick={() => {
                    navigate("/");
                }}
                style={{textDecoration: "none", cursor:'pointer'}}
            >
                <Navbar.Brand>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-mortarboard-fill me-2" viewBox="0 0 16 16">
                        <path d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917l-7.5-3.5Z"/>
                        <path d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466 4.176 9.032Z"/>
                    </svg>
                    THESIS MANAGEMENT
                </Navbar.Brand>
            </div>
            
            <Nav className="mr-auto" style={{color: 'whitesmoke', cursor: 'pointer'}}>
                <svg onClick={() => {
                    navigate("/");
                }} xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                </svg>
            </Nav>
        </Navbar>
        
        </>
    );
}

export default NavbarContainer;
