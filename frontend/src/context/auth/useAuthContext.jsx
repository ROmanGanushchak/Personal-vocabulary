import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext({});

function isTokenActive(token) {
    if (token) {
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp >= currentTime)
                return true;
            else 
                console.log("The token already expired")
        } catch (e) {
            console.error("Error during tokin validation: ", e);
            return false;
        }
    }
    return false;
}

export const AuthProvider = ({ children }) => {
    const navigateAfterAccessChange = useRef(null);
    const [access, setAccess] = useState(localStorage.getItem('access') || "");
    const isLogged = useRef(isTokenActive(access));
    const navigate = useNavigate();
    
    useEffect(() => {
        async function isLogedIn(access) {
            if (access === null || !isTokenActive(access)) {
                // const newAccess = await refresh();
                // return isTokenActive(newAccess)
                return false;
            } 
            return true;
        }

        async function iHateJS() {
            isLogged.current = await isLogedIn(access);
            if (navigateAfterAccessChange.current !== null) {
                navigate(navigateAfterAccessChange.current);
                navigateAfterAccessChange.current = null;
            }
        }

        iHateJS()
        if (access != "")
            localStorage.setItem('access', access);
    }, [access]);

    return (
        <AuthContext.Provider value={{ access, setAccess, navigateAfterAccessChange, isLogged}}> 
            {children} 
        </AuthContext.Provider>
    )
}

export default AuthContext;