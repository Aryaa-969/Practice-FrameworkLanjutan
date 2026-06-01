import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

export default function MainLayout() {
    return (
        <div id="app-container" className="h-screen flex overflow-hidden bg-gray-100">

            <Sidebar />

            <div id="main-content" className="flex-1 overflow-y-auto p-6">

                <Header />
                <Outlet />

            </div>
        </div>
    );
}