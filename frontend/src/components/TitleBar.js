function TitleBar(props) {
    const {title} = props;

    return (
        <div className='container-fluid py-2' style={{backgroundColor: "#2d90ba", color: 'whitesmoke', fontSize: "20px"}}>
            {title}
        </div>
    );
}

export default TitleBar;
