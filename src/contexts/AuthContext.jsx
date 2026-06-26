import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const SUPABASE_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = (token = null) => {
    const headers = {
        apikey: API_KEY,
        "Content-Type": "application/json"
    };

    const authToken = token || localStorage.getItem("supabase_token");
    if (authToken) {
        headers.Authorization = `Bearer ${authToken}`;
    }

    return headers;
};

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async (uid, token) => {
        try {
            const response = await axios.get(
                `${SUPABASE_URL}/rest/v1/profiles?id=eq.${uid}&select=*`,
                { headers: getHeaders(token) }
            );
            if (response.data && response.data.length > 0) {
                return response.data[0];
            }
            return null;
        } catch (err) {
            console.error('Error fetching profile:', err);
            return null;
        }
    };

    const refreshProfile = async () => {
        const token = localStorage.getItem("supabase_token");
        if (user && token) {
            const prof = await fetchProfile(user.id, token);
            setProfile(prof);
        }
    };

    useEffect(() => {
        const checkSession = async () => {
            const token = localStorage.getItem("supabase_token");
            if (token) {
                try {
                    const response = await axios.get(
                        `${SUPABASE_URL}/auth/v1/user`,
                        { headers: getHeaders(token) }
                    );
                    if (response.data) {
                        setUser(response.data);
                        const prof = await fetchProfile(response.data.id, token);
                        setProfile(prof);
                    } else {
                        localStorage.removeItem("supabase_token");
                    }
                } catch (err) {
                    console.error("Session check failed, clearing token", err);
                    localStorage.removeItem("supabase_token");
                }
            }
            setLoading(false);
        };

        checkSession();
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
                { email, password },
                { headers: getHeaders() }
            );

            const { access_token, user: loggedUser } = response.data;
            localStorage.setItem("supabase_token", access_token);
            setUser(loggedUser);

            const prof = await fetchProfile(loggedUser.id, access_token);
            setProfile(prof);
            setLoading(false);
            return { user: loggedUser, profile: prof };
        } catch (err) {
            setLoading(false);
            throw new Error(err.response?.data?.error_description || err.response?.data?.msg || "Email atau password salah");
        }
    };

    const signUp = async (email, password, fullName, phone) => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${SUPABASE_URL}/auth/v1/signup`,
                {
                    email,
                    password,
                    data: {
                        full_name: fullName,
                        phone: phone
                    }
                },
                { headers: getHeaders() }
            );
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            throw new Error(err.response?.data?.msg || err.response?.data?.error_description || "Gagal melakukan registrasi");
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await axios.post(`${SUPABASE_URL}/auth/v1/logout`, {}, { headers: getHeaders() });
        } catch (err) {
            console.error("Logout request error:", err);
        } finally {
            localStorage.removeItem("supabase_token");
            setUser(null);
            setProfile(null);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
