import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { ImSpinner2 } from 'react-icons/im';

export default function Register() {
    const { signUp } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const { fullName, email, phone, password, confirmPassword } = formData;

        if (!fullName || !email || !password || !confirmPassword) {
            setError("Harap isi semua kolom wajib!");
            return;
        }

        if (password !== confirmPassword) {
            setError("Password dan Konfirmasi Password tidak cocok!");
            return;
        }

        if (password.length < 6) {
            setError("Password harus minimal 6 karakter!");
            return;
        }

        try {
            setLoading(true);
            await signUp(email, password, fullName, phone);
            setSuccess(true);
            setFormData({
                fullName: "",
                email: "",
                phone: "",
                password: "",
                confirmPassword: ""
            });
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            setError(err.message || "Gagal melakukan registrasi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Create Your Account ✨
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-200 mb-5 p-4 text-sm text-red-700 rounded-lg flex items-center gap-2">
                    <BsFillExclamationDiamondFill className="text-red-500 text-lg flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="bg-green-100 border border-green-200 mb-5 p-4 text-sm text-green-700 rounded-lg">
                    Registrasi sukses! Silakan cek email Anda untuk konfirmasi, atau masuk menggunakan akun Anda. Anda akan dialihkan ke halaman login...
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nama Lengkap *
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nama Lengkap"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email *
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="you@example.com"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nomor Telepon
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="081234567890"
                    />
                </div>

                <div className="mb-4">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Password *
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="********"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Konfirmasi Password *
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="********"
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
                            Mendaftar...
                        </>
                    ) : (
                        'Register'
                    )}
                </button>
            </form>

            <div className="mt-4 text-center">
                <span className="text-sm text-gray-500">Sudah punya akun? </span>
                <Link to="/login" className="text-sm text-green-500 hover:underline font-semibold">
                    Masuk di sini
                </Link>
            </div>
        </div>
    );
}
