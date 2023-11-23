function TitleBar(props) {
    const {title} = props;

    return (
        <div className='container-fluid py-2' style={{backgroundColor: "#6D5D6E", color: 'whitesmoke', fontSize: "18px", textAlign: "center", fontWeight: "bold"}}>
            {title}
        </div>
    );
}

export default TitleBar;
