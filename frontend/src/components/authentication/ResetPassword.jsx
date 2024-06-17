import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import '@styles/authentication/signup.css'
import Button from 'react-bootstrap/Button';
import api from '@api'

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate()
    const [password, setPassword] = useState()
    const [password2, setPassword2] = useState("")
    const [errorText, setErrorText] = useState("")

    const resetPassword = () => {
        if (password !== password2)
            setErrorText("Passwords have to be equal")
        else {
            api.post('auth/password/change/', {
                'password_reset_token': token, 
                'new_password': password
            }).then(response => {
                if (response.status === 200)
                    navigate('/login')
                else 
                    setErrorText("Error: " + response.data['detail'])
            }).catch(error => {
                if (error.response)
                    setErrorText(error.response.data['detail'])
                else 
                    setErrorText("Unknown error")
            })
        }
    }

    return (
        <div className="container">
            <form className="sign_up_default">
                <h1> Set new password </h1>
                <div className="input_field_conteiner">
                    <label> Password: </label>
                    <input type='password' onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className="input_field_conteiner">
                    <label> Password2: </label>
                    <input type='password' onChange={(e) => setPassword2(e.target.value)} />
                </div>

                <Button variant="primary" className="btn-primary submit-btn" onClick={resetPassword}> Submit </Button>{' '}
                <label className="error-text"> {errorText} </label>
            </form>
        </div>
    )
}

export default ResetPassword;