import React from "react";
import api from '@api'
import { Button } from "react-bootstrap";

function logout() {
    refresh = localStorage.getItem('refresh')   
    if (refresh != null) {
        localStorage.removeItem('refresh')
        localStorage.removeItem('access')
        api.post('auth/logout/', {'refresh_token': refresh})
    }
}

function LogOutBtn() {
    return (
        <Button variant="danger" onClick={logout}>Logout</Button>
    )
}

export default LogOutBtn;