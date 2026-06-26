import { useState } from "react";
import { BsFillExclamationDiamondFill } from "react-icons/bs";
import { ImSpinner2 } from "react-icons/im";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        setDataForm({
            ...dataForm,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const { profile } = await signIn(dataForm.email, dataForm.password);
            
            // Redirect based on role
            if (profile && profile.role === "admin") {
                navigate("/");
            } else {
                navigate("/member");
            }
        } catch (err) {
            setError(err.message || "Email atau password salah");
        } finally {
            setLoading(false);
        }
    };

    const errorInfo = error ? (
        <div className="bg-red-100 border border-red-200 mb-5 p-4 text-sm text-red-700 rounded-lg flex items-center">
            <BsFillExclamationDiamondFill className="text-red-500 me-2 text-lg flex-shrink-0" />
            <span>{error}</span>
        </div>
    ) : null;
		
    const loadingInfo = loading ? (
        <div className="bg-gray-100 border border-gray-200 mb-5 p-4 text-sm text-gray-700 rounded-lg flex items-center">
            <ImSpinner2 className="me-2 animate-spin" />
            <span>Mohon Tunggu...</span>
        </div>
    ) : null;

    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
                Welcome Back 👋
            </h2>

            {errorInfo}

            {loadingInfo}

            <form onSubmit={handleSubmit}>
                <div className="mb-5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="you@example.com"
                        name="email"
                        value={dataForm.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <Link to="/forgot" className="text-xs text-green-500 hover:underline">
                            Lupa Password?
                        </Link>
                    </div>
                    <input
                        type="password"
                        id="password"
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="********"
                        name="password"
                        value={dataForm.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:bg-gray-400"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="mt-6 text-center flex flex-col gap-2">
                <span className="text-sm text-gray-500">
                    Belum punya akun?{" "}
                    <Link to="/register" className="text-green-500 hover:underline font-semibold">
                        Daftar di sini
                    </Link>
                </span>
            </div>
        </div>
    );
}
