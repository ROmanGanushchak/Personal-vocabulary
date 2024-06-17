import React, { useState } from "react";
import '@styles/authentication/email.css'
import { Button } from "react-bootstrap";
import api from '@api'
import { useNavigate } from "react-router-dom";

function EmailSent() {
    const navigate = useNavigate()
    const [code, setCode] = useState('')
    const [errorText, setErrorText] = useState('')

    const sendCode = () => {
        api.post(`auth/approve/${parseInt(code)}/`).then(responce => {
            localStorage.setItem('access', responce.data['access'])
            localStorage.setItem('refresh', responce.data['refresh'])
            navigate('/')
            setErrorText('')
            console.log('responve allright')
        }).catch(error => {
            setErrorText('Uncorrect code or it has expired')
        });
    }

    return (
        <div className="conteiner">
            <label> In order to finish your authrization confirm your email by inputing the code from the mail </label>
            <p className="code-text"> Code </p>
            <input type="text" placeholder="xxxxxx" className="code-input" onChange={(e) => setCode(e.target.value)} />
            <Button variant="primary" onClick={sendCode} className="send-btn"> Send </Button>
            <p className="error-message">{errorText}</p>
        </div>
    )
}

export default EmailSent;