import { useState } from "react";
import { FaBell, FaSearch } from "react-icons/fa";
import { FcAreaChart } from "react-icons/fc";
import { SlSettings } from "react-icons/sl";

export default function Header() {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    return (
        <div id="header-container" className="flex justify-between items-center p-4">
            {/* Search Bar */}
            <div id="search-bar" className="relative w-full max-w-lg">
                <input
                    id="search-input"
                    type="text"
                    placeholder="Search Here..."
                    className="border border-gray-100 p-2 pr-10 bg-white w-full max-w-lg rounded-md outline-none"
                />
                <FaSearch id="search-icon" className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-300" />
            </div>

            {/* Icon & Profile Section */}
            <div id="icons-container" className="flex items-center space-x-4">
                {/* Icons */}
                <div id="notification-icon" className="relative p-3 bg-blue-100 rounded-2xl text-blue-500 cursor-pointer">
                    <FaBell />
                    <span id="notification-badge" className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-blue-200 rounded-full px-2 py-1 text-xs">50</span>
                </div>
                <div id="chart-icon" className="p-3 bg-blue-100 rounded-2xl cursor-pointer">
                    <FcAreaChart />
                </div>

                {/* Settings Icon & Dropdown */}
                <div className="relative">
                    <div
                        id="settings-icon"
                        className="p-3 bg-red-100 rounded-2xl text-red-500 cursor-pointer"
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    >
                        <SlSettings />
                    </div>

                    {/* Dropdown Menu */}
                    {isSettingsOpen && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg border border-gray-100 z-50 overflow-hidden">
                            <div className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Account</div>
                            <div className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer">Logout</div>
                        </div>
                    )}
                </div>


                {/* Profile Section */}
                <div id="profile-container" className="flex items-center space-x-4 border-l pl-4 border-gray-300">
                    <span id="profile-text">
                        Hello, <b>Arya Ibrahim</b>
                    </span>
                    <img
                        id="profile-avatar"
                        src="\img\download.jpg"
                        className="w-10 h-10 rounded-full"
                    />
                </div>
            </div>
        </div>
    );
}