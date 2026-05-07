import { Routes, Route } from "react-router-dom";
import './assets/tailwind.css';
import Header from "./layouts/Header";
import Sidebar from "./layouts/Sidebar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import NotFound from "./pages/NotFound";
import ErrorPage from "./components/ErrorPage";

export default function App() {
    return (
        /* 1. Tambahkan h-screen dan overflow-hidden agar browser tidak scroll global */
        <div id="app-container" className="h-screen flex overflow-hidden bg-gray-100">

            {/* 2. Sidebar tetap di tempat karena kontainer utama h-screen */}
            <Sidebar />

            {/* 3. Main content dibuat flex-col untuk memisahkan Header dan Area Scroll */}
            <div id="main-content" className="flex-1 flex flex-col min-w-0">

                {/* Header tetap di atas */}
                <Header />

                {/* 4. Area ini yang akan menampung scroll. 
                    flex-1 akan mengambil sisa ruang, dan overflow-y-auto memunculkan scroll jika konten penuh */}
                <main className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/customers" element={<Customers />} />
                        <Route path="*" element={<NotFound />} />
                        <Route path="/error/400" element={<ErrorPage errorCode="400" description="Bad Request. Permintaan tidak dapat diproses." image="/img/400.png" />} />
                        <Route path="/error/401" element={<ErrorPage errorCode="401" description="Unauthorized. Anda tidak memiliki akses ke sini." image="/img/401.png" />} />
                        <Route path="/error/403" element={<ErrorPage errorCode="403" description="Forbidden. Akses ditolak secara permanen." image="/img/403.png" />} />
                        <Route path="*" element={<ErrorPage errorCode="404" description="Halaman tidak ditemukan." image="/img/error-404.svg" />} />
                    </Routes>
                </main>

            </div>
        </div>
    );
}