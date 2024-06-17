import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '@styles/authentication/signup.css'
import api from '@api_un'

function Verification({title, setFormData, formOutline, submitDefault, errorText}) {
    const handleInputChange = (e, key) => {
        setFormData(prevState => ({
            ...prevState,
            [key]: e.target.value
        }));
    };

    const handleSignInWithGoogle = async (response) => {
        const credentials = response.credential
        const server_res = await api.post('social_auth/google/', {"access_token": credentials})
        console.log(server_res)
    }

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "765424187599-gbrm5b8s3blv83ks8dj7ijdon0q389rc.apps.googleusercontent.com",
            callback: handleSignInWithGoogle
        });

        google.accounts.id.renderButton(
            document.getElementById('signInDiv'),
            {theme:"outline", text:"google is working"}
        )
    })

    return (
        <div className="container">
            <form className="sign_up_default">
                <h1> {title} </h1>

                {formOutline.map((field) => {
                    return (<div className="input_field_conteiner" key={field.key}>
                        <label> {field.text}: </label>
                        <input type={field.type} onChange={(e) => handleInputChange(e, field.key)} />
                    </div>)
                })}

                <Button variant="primary" className="btn-primary submit-btn" onClick={submitDefault}> Submit </Button>{' '}
                <label className="error-text"> {errorText} </label>
            </form>

            <label className="or-separator"> OR </label>

            <div>
                <Button variant="primary">Google</Button>{' '}
            </div>    

            <div className="">
                <div id="signInDiv" className='gsignIn'></div>    
            </div>  
        </div>
    );
}

export default Verification;