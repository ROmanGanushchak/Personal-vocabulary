import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@styles/authentication/signup.css'
import { useNavigate } from "react-router-dom";
import Verification from "./Verification";
import useAuth from "../../hooks/auth/useAuth";
import useApi from "../../hooks/auth/useApi";

function Signup() {
    const {api} = useApi();
    const { setAccess } = useAuth();
    const navigate = useNavigate()
    const [errorText, setErrorText] = useState('')
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        password2: '',
    });

    const formOutline = [
        {key: 'firstName', text: 'FirstName', type:'text'},
        {key: 'lastName', text: 'LastName', type:'text'},
        {key: 'email', text: 'EmailAdress', type:'email'},
        {key: 'password', text: 'Password', type:'password'},
        {key: 'password2', text: 'ConfirmPassword', type:'password'},
    ];

    const submitDefault = () => {
        if (!(formData.email && formData.firstName && formData.lastName && formData.password && formData.password2)) {
            setErrorText("Not all data are specified");
        } else if (formData.password != formData.password2) {
            setErrorText("Passwords are different");
        } else if (formData.password.length < 6) {
            setErrorText("Password has to have at least 6 characters");
        } else {
            setAccess("");
            api.post('auth/register/', {
                'email': formData.email, 
                'first_name': formData.firstName,
                'last_name': formData.lastName,
                'password': formData.password,
            })
            .then(response => {
                if (!response.ok) 
                    setErrorText(response.status)
                
                console.log(response.data);
                navigate('/email-sent');
            });
        }
    };

    return (
        <Verification 
            title="Signup" 
            setFormData={setFormData} 
            formOutline={formOutline} 
            submitDefault={submitDefault} 
            errorText={errorText} 
            setErrorText={setErrorText}
        />
    );
}

export default Signup