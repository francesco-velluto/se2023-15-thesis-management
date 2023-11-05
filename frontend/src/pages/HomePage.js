import AuthenticationAPI from "../api/AuthenticationAPI";
import {useEffect} from "react";

function HomePage() {
    // TODO - this is an example of usage of the API using then/catch instead of async/await, remove it when you start working on the project
    const fetchLogin = () => {
        AuthenticationAPI.login('admin', 'admin')
            .then(async response => {
                let data = await response.json();

                if (response.ok) {
                    console.log("token: " + data.token);
                } else {
                    console.error("error: " + data.error);
                }
            })
            .catch(error => {
                console.error("error in fetch login: " + error);
            });
    }

    useEffect(() => {
        fetchLogin();
    });

    return (
        <div>
            <h1>Thesis Management System</h1>
        </div>
    );
}

export default HomePage;