import { useNavigate } from "react-router-dom";
import { login, logout } from "../api/AuthenticationAPI";
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
     * Perform the login
     *
     * @param username username of the user
     * @param password password of the user
     */
    const handleLogin = async (username, password) => {
        try {
            const user = await login(username, password);
            setLoggedUser(user);
            setErrors(undefined); // clear all errors when the login is successful
            navigate('/');
        } catch (err) {
            setErrors(err);
        }
    };

    /**
     * Perform the logout
     */
    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            setErrors(err);
        }
        setLoggedUser(null);        // delete the state for the logged user
        navigate('/');
    };

    return (
        <LoggedUserContext.Provider value={{ loggedUser, handleLogout, handleLogin, setLoggedUser, errors, setErrors }} >
            {children}
        </LoggedUserContext.Provider>);
}
