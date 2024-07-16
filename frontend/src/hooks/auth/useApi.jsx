import React, { useContext } from 'react'
import ApiContext from '../../context/auth/useApiContext.jsx';

export default function useApi() {
    return useContext(ApiContext);
}