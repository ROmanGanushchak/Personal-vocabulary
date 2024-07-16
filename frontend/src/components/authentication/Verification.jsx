import React, { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import '@styles/authentication/signup.css'
import api from '@api_un'
import { useNavigate } from "react-router-dom";

function Verification({title, setFormData, formOutline, submitDefault, errorText, setErrorText}) {
    const navigate = useNavigate()
    const handleInputChange = (e, key) => {
        setFormData(prevState => ({
            ...prevState,
            [key]: e.target.value
        }));
    };

    const handleSignInWithGoogle = async (response) => {
        setErrorText('something')
        const credentials = response.credential
        await api.post('social_auth/google/', {"access_token": credentials}).then(response => {
            if (response.status === 200)
                console.log('works')
            else {
                console.log('set error text')
                setErrorText('error')
            }
                // setErrorText(response.data['detail'])
            console.log(response)
        }).catch(error => console.log(error))
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
    }, [])

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

            <div className="social-auth-conteiner">
                <div id="signInDiv" className='gsignIn'></div>    
            </div>  
        </div>
    );
}

export default Verification;