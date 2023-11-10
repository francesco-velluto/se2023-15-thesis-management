import { useNavigate } from "react-router-dom";
import { login } from "../api/AuthenticationAPI";
import { createContext, useState } from "react";

export const LoggedUserContext = createContext();       // context for logged user

/**
 * Context used to get the user logged in the system
 */
export const LoggedUserProvider = ({ children }) => {
    const navigate = useNavigate();
    const [loggedUser, setLoggedUser] = useState(null);
    const [errors, setErrors] = useState(undefined);                          // list of errors

    /**
     * This handle has the responsability to manage all errors in the system 
     */
    const handleErrors = (error) => {
        let errorsList = error;

        if (errorsList !== undefined) {
            errorsList = errorsList.filter(e => e.message !== "Must be authenticated to make this request!");
        }

        setErrors(errorsList);
        console.clear();
    }

    /**
       * Perform the login
       * 
       * @param username username of the user
       * @param password password of the user
       */
    const handleLogin = async (username, password) => {
        await login(username, password)
            .then(user => {
                setLoggedUser(user);
                navigate('/');
            })
            .catch(err => {
                console.log(err);
                //handleErrors(err);
            });
    };

    /**
     * Perform the logout
     */
    const handleLogout = () => {
        /*logout()
            .then(() => {
                console.log("logout con successo");
                //handleErrors(undefined);    // clean all errors
            })
            .catch(err => {
                console.log("errore logout");
                console.log(err);
                //handleErrors(undefined);
                //handleErrors([err]);
            }).finally(() => {
                setLoggedUser(null);        // delete the state for the logged user
                navigate('/');
            });*/
    };

    return (
        <LoggedUserContext.Provider value={{ loggedUser, handleLogout, handleLogin, setLoggedUser, errors, handleErrors }} >
            {children}
        </LoggedUserContext.Provider>);
}
