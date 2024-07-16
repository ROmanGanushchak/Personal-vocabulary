import React from "react";
import { Button } from "react-bootstrap";
import useAuth from "../../hooks/auth/useAuth";
import useApi from "../../hooks/auth/useApi";

function logout() {
    const { setAccess, navigateAfterAccessChange } = useAuth();
    const { api } = useApi();

    navigateAfterAccessChange.current = "/";
    setAccess("");
    api.post('auth/logout/', {'refresh_token': "refresh_token"})
}

function LogOutBtn() {
    return (
        <Button variant="danger" onClick={logout}>Logout</Button>
    )
}

export default LogOutBtn;