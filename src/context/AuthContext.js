import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api';
const AuthContext = createContext(undefined);
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // TODO: Validate token with server
            const userData = localStorage.getItem('user');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        }
        setLoading(false);
    }, []);
    const login = async (uid, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { uid, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            setUser(user);
        }
        catch (error) {
            throw new Error(error.response?.data?.error || 'Login failed');
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
    };
    return (_jsx(AuthContext.Provider, { value: { user, login, logout, loading }, children: children }));
};
