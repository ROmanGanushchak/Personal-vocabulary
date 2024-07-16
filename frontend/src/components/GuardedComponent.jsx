import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../context/auth/useAuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function GuardedComponent() {
    const { isLogged } = useContext(AuthContext);
    
    return (
        <>
            {isLogged.current ? <Outlet/> : <Navigate to="/login"/>}
        </>
    )
}

export default GuardedComponent;