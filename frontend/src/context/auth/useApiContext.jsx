import React, { useEffect, createContext } from 'react'
import useAuth from '../../hooks/auth/useAuth'
import useRefresh from '../../hooks/auth/useRefresh';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ApiContext = createContext({});

export function ApiProvider( {children} ) {
    const { access } = useAuth();
    const refresh = useRefresh();
    const navigate = useNavigate();
    const api = axios.create({
        baseURL: `http://127.0.0.1:8000/`,
        headers: {
            'Authorization': `Bearer ${access}`,
            'Content-Type': 'application/json',
        },
        withCredentials: true,
    });

    useEffect(() => {
        api.defaults.headers['Authorization'] = `Bearer ${access}`;
    }, [access]);

    // useEffect(() => {
    //     api.interceptors.response.use(
    //         response => response,
    //         async (error) => {
    //             console.log("ERROR Chatched : " + error);
    //         }
    //     ) 
    //     const responseIntercecpt = api.interceptors.response.use(
    //         response => response,
    //         async (error) => {
    //             if (error.response) {
    //                 const prevRequest = error.config;
    //                 if (error.response.status === 401 && !prevRequest.sent) {
    //                     sent = true;
    //                     const access = await refresh();
    //                     prevRequest.headers['Authorization'] = `Bearer ${access}`;
    //                     return api(prevRequest);
    //                 } else { 
    //                     navigate('/login');
    //                     return null;
    //                 }
    //             }
    //             return Promise.reject(error);
    //         }
    //     );

    //     return () => {
    //         api.interceptors.response.eject(responseIntercecpt);
    //     };
    // }, []);

    return (
        <ApiContext.Provider value={{ api, refresh }}> 
            {children} 
        </ApiContext.Provider>
    )
}

export default ApiContext;
