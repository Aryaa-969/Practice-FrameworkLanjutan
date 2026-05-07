// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-9xl font-extrabold text-green-500">404</h1>
            <p className="text-2xl font-semibold mt-4 text-gray-800">Ups! Halaman Tidak Ditemukan</p>
            <p className="text-gray-500 mt-2">Maaf, halaman yang kamu cari tidak tersedia.</p>
            <Link
                to="/"
                className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-all"
            >
                Kembali ke Dashboard
            </Link>
        </div>
    );
}