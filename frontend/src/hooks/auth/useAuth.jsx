import React, { useContext, useState } from 'react'
import AuthContext from "../../context/auth/useAuthContext.jsx"

export default function useAuth() {
    return useContext(AuthContext);
}