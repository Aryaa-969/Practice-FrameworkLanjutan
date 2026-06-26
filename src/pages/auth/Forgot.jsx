import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';

const SUPABASE_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = () => {
    return {
        apikey: API_KEY,
        "Content-Type": "application/json"
    };
};

export default function Forgot() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        try {
            await axios.post(
                `${SUPABASE_URL}/auth/v1/recover`,
                { email },
                { 
                    headers: getHeaders(),
                    params: { redirect_to: `${window.location.origin}/login` }
                }
            );
            setSuccess(true);
            setEmail("");
        } catch (err) {
            setError(err.response?.data?.msg || err.message || "Gagal mengirim link reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-2 text-center">
                Forgot Your Password?
            </h2>
            
            <p className="text-sm text-gray-500 mb-6 text-center">
                Enter your email address and we'll send you a link to reset your
                password.
            </p>

            {error && (
                <div className="bg-red-100 border border-red-200 mb-5 p-4 text-sm text-red-700 rounded-lg flex items-center">
                    <BsFillExclamationDiamondFill className="text-red-500 me-2 text-lg flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-200 mb-5 p-4 text-sm text-green-700 rounded-lg">
                    Link reset password telah dikirim! Silakan periksa kotak masuk email Anda.
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="you@example.com"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-gray-400"
                >
                    {loading ? (
                        <>
                            <ImSpinner2 className="mr-2 animate-spin" />
                            Mengirim...
                        </>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-green-500 hover:underline font-semibold">
                    Kembali ke Login
                </Link>
            </div>
        </div>
    );
}
