import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '@styles/authentication/signup.css'
import api from "@api";
import { useNavigate } from "react-router-dom";
import Verification from './Verification'

function Login() {
    const navigate = useNavigate()
    const [errorText, setErrorText] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const formOutline = [
        {key: 'email', text: 'EmailAdress', type:'email'},
        {key: 'password', text: 'Password', type:'password'},
    ];

    const submitDefault = () => {
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
                    localStorage.setItem('access', response.data['access']);
                    localStorage.setItem('refresh', response.data['refresh']);
                    navigate('/');
                    if (errorText)
                        setErrorText('')
                } else {
                    console.log('login error')
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
        <Verification title="Login" setFormData={setFormData} formOutline={formOutline} submitDefault={submitDefault} errorText={errorText}/>
    );
}

export default Login