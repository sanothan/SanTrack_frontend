import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored token and hydrate user from canonical backend profile
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                try {
                    const userData = await authService.getProfile();
                    localStorage.setItem('user', JSON.stringify(userData));
                    setUser(userData);
                } catch (error) {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        setUser(JSON.parse(storedUser));
                    } else {
                        console.error("Auth init failed:", error);
                        logout();
                    }
                }
            }
            setLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email, password) => {
        const data = await authService.login(email, password);
        // Assumes response contains { token, user: { id, name, role... } }
        localStorage.setItem('token', data.token);
        try {
            const fullProfile = await authService.getProfile();
            localStorage.setItem('user', JSON.stringify(fullProfile));
            setUser(fullProfile);
        } catch (_error) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const googleLogin = async (credential) => {
        const data = await authService.googleLogin(credential);
        localStorage.setItem('token', data.token);
        try {
            const fullProfile = await authService.getProfile();
            localStorage.setItem('user', JSON.stringify(fullProfile));
            setUser(fullProfile);
        } catch (_error) {
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
        }
        return data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, googleLogin, logout, AuthLoading: loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
