import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


function TitleBar() {

    const navigate = useNavigate();
    const location = useLocation();
    const [title, setTitle] = useState("");

    useEffect(() => {
        if(location.pathname === "/proposals"){
            setTitle("Thesis Proposals");
        }
        else{
            setTitle("");
            navigate("/");
        }
    })

    return (
        <>

        <div className='container-fluid py-2' style={{backgroundColor: "#2d90ba", color: 'whitesmoke', fontSize: "20px"}}>
            {title}
        </div>
        
        </>
    );
}

export default TitleBar;
