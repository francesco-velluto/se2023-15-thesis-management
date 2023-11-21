function TitleBar(props) {
    const {title} = props;

    return (
        <div className='container-fluid py-2' style={{backgroundColor: "#d17f00", color: 'whitesmoke', fontSize: "23px", textAlign: "center", fontWeight: "bold"}}>
            {title}
        </div>
    );
}

export default TitleBar;
