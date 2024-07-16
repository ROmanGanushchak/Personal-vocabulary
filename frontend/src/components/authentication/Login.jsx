import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@styles/authentication/signup.css'
import Verification from './Verification'
import useAuth from "../../hooks/auth/useAuth";
import useApi from "../../hooks/auth/useApi";
// import api from "@api"

function Login() {
    const { setAccess, navigateAfterAccessChange } = useAuth();
    const {api} = useApi();
    const [errorText, setErrorText] = useState('');
    const isFirstRender = useRef(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const formOutline = [
        {key: 'email', text: 'EmailAdress', type:'email'},
        {key: 'password', text: 'Password', type:'password'},
    ];

    const submitDefault = () => {
        console.log("navigateAfterAccessChange: " +  navigateAfterAccessChange)

        if (!(formData.email && formData.password)) {
            setErrorText("not all data are specified");
        } else if (formData.password.length < 6) {
            setErrorText("password has to have at least 6 characters");
        } else {
            api.post('auth/token/', {
                'email': formData.email, 
                'password': formData.password,
            })
            .then((response) => {
                if (response.status === 200) {
                    navigateAfterAccessChange.current = "/";
                    setAccess(response.data['access']);
                    if (errorText)
                        setErrorText('')
                } else {
                    setErrorText('Login error: ', response.data['details'])
                }
            }).catch(error => {
                if (error.response)
                    setErrorText("Error: " + error.response.data['detail'])
                else
                    setErrorText("Error: ", error.message)
            });
        }
    };

    return (
        <Verification title="Login" setFormData={setFormData} formOutline={formOutline} submitDefault={submitDefault} errorText={errorText} setErrorText={setErrorText}/>
    );
}

export default Login