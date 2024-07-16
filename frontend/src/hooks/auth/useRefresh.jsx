import React, { useContext } from 'react';
import AuthContext from '../../context/auth/useAuthContext';
import api from '@api_un'

function useRefresh() {
    // const { access } = useContext(AuthContext);

    const refresh = async () => {
        // api.post("auth/token/refresh/", {}, {
        //     withCredentials: true
        // }).then(response => {
        //     setAccess(response.data['access_token']);
        //     return response.data['access_token'];
        // }).catch(error => {
        //     return null;
        // });
        return "";
    }

    return refresh;
}

export default useRefresh
