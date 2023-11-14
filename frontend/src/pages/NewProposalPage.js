import "../newProposalPage.css";
import 'bootstrap/dist/css/bootstrap.min.css'
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import NavbarContainer from "../components/Navbar.js";
import TitleBar from "../components/TitleBar.js";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import proposalsAPI from "../api/ProposalsAPI.js";
import React from 'react';


function NewProposalPage() {
    return (
        <>
            <NavbarContainer />
            <TitleBar title="New proposal"/>
            <FormProposal />
        </>
    )
}

function FormProposal() {
    const navigate = useNavigate();

    let mySupervisors = ["Paolo", "Giacomo", "Luigi"];
    let myCoSupervisors = ["Franco", "Alfredo", "Luca"];
    let myGroups = ["group1", "group2", "group3"];


    const [supervisor, setSupervisor] = useState("");
    const [level, setLevel] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [expDate, setExpDate] = useState("");
    const [keywords, setKeywords] = useState([]);
    const [programmes, setProgrammes] = useState([]);
    const [coSupervisors, setCoSupervisors] = useState([]);
    const [groups, setGroups] = useState([]);
    const [description, setDescription] = useState("");
    const [knowledge, setKnowledge] = useState("");
    const [notes, setNotes] = useState("");

    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(supervisor == "" | supervisor.trim() == ""){
            setErrorMsg("Insert a valid Supervisor");
        }

        if(level == "" | level.trim() == ""){
            setErrorMsg("Insert a valid level");
        }

        if(title == "" | title.trim() == ""){
            setErrorMsg("Insert a valid title");
        }

        if(type == "" | type.trim() == ""){
            setErrorMsg("Insert a valid type");
        }

        /*if(expDate == "" | dayjs.(expDate) <= dayjs().today() 1){
            setErrorMsg("Insert a valid expiration date");
        }*/

        //check keywords, groups



        if (supervisor && level && title && type && expDate && description && knowledge){
            // create new proposal function
            const newProposal = {
                title: title,
                level: level,
                supervisor_id: supervisor,
                keywords: keywords,
                type: type,
                groups: groups,
                description: description,
                required_knowledge: knowledge,
                notes: notes,
                expiration_date: expDate,
                programmes: programmes
            }
            console.log(newProposal);

            const res = await proposalsAPI.insertNewProposal(newProposal);
            console.log(res);
            /*const prop_id = res.proposal.id;
            navigate("/proposals/" + prop_id);*/
        }else
            setErrorMsg("Non si possono avere campi vuoti!");
    }

    return (
        <>
            {errorMsg ? <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>{errorMsg}</Alert> : <></>}
            <Form className="form" onSubmit={handleSubmit}>
                <div className="form-line">
                    <SupervisorField mySupervisors={mySupervisors} setSupervisor={setSupervisor}/>
                    <LevelField setLevel={setLevel} />
                    <TitleField setTitle={setTitle} />
                    <TypeField setType={setType} />
                    <ExpirationDateField setExpDate={setExpDate} />
                </div>
                <div className="form-line">
                    <KeywordsField keywords={keywords} setKeywords={setKeywords} />
                    <ProgrammesField programmes={programmes} setProgrammes={setProgrammes} />
                    <CoSupervisorsField myCoSupervisors={myCoSupervisors} setCoSupervisors={setCoSupervisors}
                        coSupervisors={coSupervisors} />
                    <GroupsField myGroups={myGroups} setGroups={setGroups} groups={groups} />
                </div>
                <div className="form-line">

                    <DescriptionField setDescription={setDescription} />
                    <RequiredKnowledgeField setKnowledge={setKnowledge} />
                    <NotesField setNotes={setNotes} />
                </div>
                <div className="form-line">
                    <EndButtons handleSubmit={handleSubmit} />
                </div>

            </Form>
        </>
    )
}

function EndButtons() {
    const navigate = useNavigate();

    return (
        <div className="my-buttons">
            <button type="submit" className="my-buttons p-3" style={{ backgroundColor: "#7DC1FF", color: "black" }}>Create proposal</button>
            <button onClick={() => navigate('/')} className="my-buttons p-3" style={{ backgroundColor: "#CDCDCD", color: "black" }}>Back to homepage</button>
        </div>
    );
}

function NotesField(props) {

    const handleChange = (event) => {
        props.setNotes(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Notes</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="My notes..." onChange={handleChange} id="notes"/>
        </Form.Group>
    );
}

function RequiredKnowledgeField(props) {

    const handleChange = (event) => {
        props.setKnowledge(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Required knowledge</Form.Label>
            <Form.Control as="textarea" rows={4} placeholder="You are required to know..." onChange={handleChange} id="required-knowledge"/>
        </Form.Group>
    );
}


function DescriptionField(props) {

    const handleChange = (event) => {
        props.setDescription(event.target.value);
    }


    return (
        <Form.Group className="form-field">
            <Form.Label>Description</Form.Label>
            <Form.Control id="description" as="textarea" rows={4} placeholder="My long description..." onChange={handleChange} />
        </Form.Group>
    );
}

function GroupsField(props) {

    let [myGroups, setMyGroups] = useState([]);
    let [errGroups, setErrGroups] = useState("");
    let [selected, setSelected] = useState("");

    /*const fetchGroups = async () =>{
        try{
            const groupsList = await getGroupsList();
            setMyGroups(groupsList);
        }catch(err){
            setErrGroups("Error on the fetch of groups.");
            setMyGroups([]);
        }
    }

    useEffect(() =>{
        fetchGroups();
    }, []);
    */


    const handleChange = (event) => {
        setSelected(event.target.value);
    }

    const addGroup = () => {
        if (selected)
            props.setGroups(oldList => { return [selected, ...oldList] });
    }

    return (
        <Form.Group className="form-field ">
            <Form.Label>Groups</Form.Label>
            <div className="text-plus">
                <Form.Control id="group" value={selected} type="text" placeholder=" New group" onChange={handleChange} />
                <Button id="add-group-btn" onClick={addGroup} variant="secondary" className="mx-1 rounded-circle d-flex justify-content-center align-items-center">+</Button>
            </div>
            {props.groups.map((s, i) => (
                <ListElement key={i} value={s} setter={props.setGroups} />
            ))}

        </Form.Group>
    );
}

function CoSupervisorsField(props) {

    let [myCoSupervisors, setMyCoSupervisors] = useState([]);
    let [errCoSuper, setErrCoSuper] = useState("");
    let [selected, setSelected] = useState("");

    /*const fetchCoSupervisors = async () =>{
        try{
            const coSupervisorsList = await getCoSupervisors();
            setMyCoSupervisors(coSupervisorsList);
        }catch(err){
            setErrGroups("Error on the fetch of coSupervisors.");
            setMyCoSupervisors([]);
        }
    }

    useEffect(() =>{
        fetchCoSupervisors();
    }, []);
    */


    const handleChange = (event) => {
        setSelected(event.target.value);
    }

    const addCoSupervisor = () => {
        if (selected)
            props.setCoSupervisors(oldList => { return [selected, ...oldList] });
    }

    return (
        <Form.Group className="form-field ">
            <Form.Label>Co-supervisors</Form.Label>
            <div className="text-plus">
                <Form.Select value={selected} onChange={handleChange} id="" disabled>
                    <option>Select the co-supervisor</option>
                    {myCoSupervisors.map((s, i) => (<option value={s} key={i}>{s}</option>)
                    )}
                </Form.Select>
                <Button disabled onClick={addCoSupervisor} variant="secondary" className="mx-1 rounded-circle d-flex justify-content-center align-items-center">+</Button>
            </div>
            {props.coSupervisors.map((s, i) => (
                <ListElement key={i} value={s} setter={props.setCoSupervisors} />
            ))}
        </Form.Group>
    );
}

function ProgrammesField(props) {

    let [selected, setSelected] = useState("");

    const handleChange = (event) => {
        setSelected(event.target.value);
    }

    const addProgramme = () => {
        if (selected)
            props.setProgrammes(oldList => { return [selected, ...oldList] })
    }

    return (
        <Form.Group className="form-field ">
            <Form.Label>CdS / Programmes</Form.Label>
            <div className="text-plus">
                <Form.Control id="programme" value={selected} type="text" placeholder=" New programme" onChange={handleChange} />
                <Button id="add-programme-btn" onClick={addProgramme} variant="secondary" className="mx-1 rounded-circle d-flex justify-content-center align-items-center">+</Button>
            </div>
            {props.programmes.map((s, i) => (
                <ListElement key={i} value={s} setter={props.setProgrammes} />
            ))}
        </Form.Group>
    );
}


function KeywordsField(props) {

    let [selected, setSelected] = useState("");

    const handleChange = (event) => {
        setSelected(event.target.value);
    }

    const addKeyword = () => {
        if (selected)
            props.setKeywords(oldList => { return [selected, ...oldList] })
    }

    return (
        <Form.Group className="form-field ">
            <Form.Label>Keywords</Form.Label>
            <div className="text-plus">
                <Form.Control type="text" placeholder=" New keyword" onChange={handleChange} id="keyword"/>
                <Button  id="add-keyword-btn" onClick={addKeyword} variant="secondary" className="mx-1 rounded-circle d-flex justify-content-center align-items-center">+</Button>
            </div>
            {props.keywords.map((s, i) => (
                <ListElement key={i} value={s} setter={props.setKeywords} />
            ))}

        </Form.Group>
    );
}

function ExpirationDateField(props) {

    const handleChange = (event) => {
        props.setExpDate(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Expiration date</Form.Label>
            <Form.Control type="date" min={dayjs().format("YYYY-MM-DD")} onChange={handleChange} id="expiration-date"/>

        </Form.Group>
    );
}

function TypeField(props) {

    const handleChange = (event) => {
        props.setType(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Type</Form.Label>
            <Form.Control id="type "type="text" placeholder=" New type" onChange={handleChange} />
        </Form.Group>
    );
}

function TitleField(props) {

    const handleChange = (event) => {
        props.setTitle(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Title</Form.Label>
            <Form.Control id="title" type="text" placeholder=" New title" onChange={handleChange} />
        </Form.Group>
    );
}

function LevelField(props) {

    

    const handleChange = (event) => {
        props.setLevel(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Level</Form.Label>
            <Form.Select onChange={handleChange} id="level">
                <option>Select the level</option>
                <option value="Bachelor">Bachelor</option>
                <option value="Master">Master</option>
                
            </Form.Select>
        </Form.Group>
    );
}

function SupervisorField(props) {

    let [mySupervisors, setMySupervisors] = useState([]);
    let [errSuper, setErrSuper] = useState("");

    const fetchSupervisors = async () =>{
        try{
            const supervisorsList = await proposalsAPI.getAllTeachers();
            setMySupervisors(supervisorsList);

        }catch(err){
            setErrSuper("Error on the fetch of supervisors.");
            setMySupervisors([]);
        }
    }

    useEffect(() =>{
        fetchSupervisors();
    }, []);
    


    const handleChange = (event) => {
        props.setSupervisor(event.target.value);
    }

    return (
        <Form.Group className="form-field">
            <Form.Label>Supervisor</Form.Label>
            <Form.Select onChange={handleChange} id="supervisor">
                <option>Select the supervisor</option>
                {mySupervisors.map((s, i) => (<option value={s.id} key={i}>{s.surname} {s.name}</option>)
                )}
            </Form.Select>
        </Form.Group>
    );
}

function Bar() {
    return (
        <div className="bar">
            <div className="bar-title">Create new thesis proposal</div>
            <AddButton />
        </div>
    )

}

function AddButton() {
    return (
        <div className="add">
            <svg className="add-icon" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M15 0V15H0V25H15V40H25V25H40V15H25V0H15Z" fill="black" />
            </svg>
            <p className="add-text">Create new proposal</p>
        </div>
    )
}

function ListElement(props) {

    const eliminateElement = () => {
        props.setter((oldList) => oldList.filter(s => s != props.value))
    }

    return (
        <>
            <button disabled className="button-chosen ">{props.value}</button>
            <svg onClick={eliminateElement} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 35 40" fill="none" cursor="pointer">
                <path d="M15 0C12.25 0 10 2.25 10 5H5C2.25 5 0 7.25 0 10H35C35 7.25 32.75 5 30 5H25C25 2.25 22.75 0 20 0H15ZM5 15V39.05C5 39.6 5.4 40 5.95 40H29.1C29.65 40 30.05 39.6 30.05 39.05V15H25.05V32.5C25.05 33.9 23.95 35 22.55 35C21.15 35 20.05 33.9 20.05 32.5V15H15.05V32.5C15.05 33.9 13.95 35 12.55 35C11.15 35 10.05 33.9 10.05 32.5V15H5.05H5Z" fill="black" />
            </svg>
        </>
    );
}

export default NewProposalPage;

