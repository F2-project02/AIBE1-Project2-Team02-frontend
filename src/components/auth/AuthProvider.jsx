import { useEffect } from 'react';
import useAuth from "../../hooks/useAuth";

export default function AuthProvider({ children }) {
    const { checkAuthStatus } = useAuth();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return children;
}