import React, { useState } from "react";
import '@styles/authentication/signup.css'
import api from '@api_un'
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';

function ResetPasswordEmail() {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [errorText, setErrorText] = useState("")

    const sendEmail = () => {
        api.post('auth/password/request_change/', {'email': email}).then(response => {
            console.log(response.status)
            if (response.status === 200) 
                // navigate('/')
                setErrorText('email was sent')
            else 
                setErrorText(response.data['detail'])
        }).catch(error => {
            if (error.status)
                setErrorText(error.response.data['detail'])
            else 
                setErrorText(error.message)
        })
    }

    return (
        <div className="container">
            <form className="sign_up_default">
                <h1> ResetPassword </h1>

                <div className="input_field_conteiner">
                    <label> EmailAdress: </label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} />
                </div>

                <Button variant="primary" className="btn-primary submit-btn" onClick={sendEmail}> Send email </Button>{' '}
                <label className="error-text"> {errorText} </label>
            </form>
        </div>
    )
}

export default ResetPasswordEmail;