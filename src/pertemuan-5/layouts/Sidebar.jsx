import { MdDashboard } from "react-icons/md";
import { RiCustomerServiceFill } from "react-icons/ri";
import { RiListUnordered } from "react-icons/ri";
import { FaPlus } from "react-icons/fa";
import { FaPen } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";

export default function Sidebar() {
    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            {/* Logo */}
            <div className=" flex flex-col ">
                <span className="font-poppins font-[1000] text-[48px]">Sedap<b className="text-green-500">.</b></span>
                <span className="text-gray-400 font-semibold font-barlow">Modern Admin Dashboard</span>
            </div>

            {/* List Menu */}
            <div id="sidebar-menu" className="mt-10">
                <ul id="menu-list" className="space-y-3">
                    <li>
                        <div id="menu-1" className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold">
                            <MdDashboard className="mr-4 text-xl" />
                            <span>Dashboard</span>
                        </div>
                    </li>
                    <li>
                        <div id="menu-2" className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold">
                            <RiListUnordered className="mr-4 text-xl" />
                            <span>Orders</span>
                        </div>
                    </li>
                    <li>
                        <div id="menu-3" className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold">
                            <RiCustomerServiceFill className="mr-4 text-xl" />
                            <span>Customers</span>
                        </div>
                    </li>
                    <li>
                        <div id="menu-3" className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold">
                            <BsGraphUpArrow className="mr-4 text-xl" />
                            <span>Analytic</span>
                        </div>
                    </li>
                    <li>
                        <div id="menu-3" className="hover:text-hijau flex cursor-pointer items-center rounded-xl p-4 font-medium text-gray-600 hover:bg-green-200 hover:font-extrabold">
                            <FaPen className="mr-4 text-xl" />
                            <span>Riviews</span>
                        </div>
                    </li>
                </ul>
            </div>


            <div id="sidebar-footer" className="mt-auto">
                <div id="footer-card" className="bg-hijau px-4 py-4 rounded-xl shadow-lg mb-8 flex items-center justify-between gap-4">

                    <div id="footer-text" className="flex-1 flex flex-col items-start">
                        <p className="text-white text-xs font-medium leading-relaxed mb-3">
                            Please organize your menus through button below!
                        </p>
                        <button id="add-menu-button" className="flex justify-center items-center w-full py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                            <FaPlus className="text-gray-600 text-sm mr-2" />
                            <span className="text-gray-700 font-semibold text-sm">Add Menus</span>
                        </button>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            id="footer-avatar"
                            src="\img\download.jpg"
                            alt="Support Avatar"
                            className="w-16 h-16 rounded-full object-cover"
                        />
                    </div>
                </div>
                <div>
                    <span id="footer-brand" className="block font-bold text-gray-400 text-sm">
                        Sedap Restaurant Admin Dashboard
                    </span>
                    <p id="footer-copyright" className="font-light text-gray-400 text-xs mt-1">
                        &copy; 2025 All Right Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}
