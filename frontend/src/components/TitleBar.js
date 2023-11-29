import { Button, Col, Nav, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function TitleBar({ title }) {

    return (
        <div className='row-bar'>
            {title}
        </div>
    );
}

export default TitleBar;
