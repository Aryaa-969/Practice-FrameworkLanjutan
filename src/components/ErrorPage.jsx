// src/components/ErrorPage.jsx
import { Link } from "react-router-dom";

export default function ErrorPage({ errorCode, description, image }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-10 text-center">
            <img src={image} alt={`Error ${errorCode}`} className="w-80 h-auto mb-8 opacity-80" />
            <h1 className="text-8xl font-black text-gray-200 absolute -z-10 select-none">
                {errorCode}
            </h1>
            <div className="z-10">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Error {errorCode}</h2>
                <p className="text-gray-500 max-w-md mx-auto mb-8">
                    {description}
                </p>
                <Link
                    to="/"
                    className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-600 transition-all"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}