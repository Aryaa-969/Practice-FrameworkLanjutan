import { MdDashboard } from "react-icons/md";
import { RiCustomerServiceFill, RiListUnordered } from "react-icons/ri";
import { FaPlus, FaPen } from "react-icons/fa";
import { BsGraphUpArrow } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { BiSolidError } from "react-icons/bi";

export default function Sidebar() {

    const menuClass = ({ isActive }) =>
        `flex cursor-pointer items-center rounded-xl p-4 space-x-2 transition-all
        ${isActive ?
            "text-hijau bg-green-200 font-extrabold" :
            "text-gray-600 hover:text-hijau hover:bg-green-200 hover:font-extrabold"
        }`;

    return (
        <div id="sidebar" className="flex min-h-screen w-90 flex-col bg-white p-10 shadow-lg">
            {/* Logo */}
            <div className="flex flex-col">
                <span className="font-poppins font-[1000] text-[48px]">Sedap<b className="text-green-500">.</b></span>
                <span className="text-gray-400 font-semibold font-barlow text-sm">Modern Admin Dashboard</span>
            </div>

            {/* List Menu - Ditambahkan mb-10 agar tidak menempel ke bawah */}
            <div id="sidebar-menu" className="mt-10 mb-10 overflow-y-auto custom-scrollbar">
                <ul id="menu-list" className="space-y-3">
                    <li>
                        <NavLink to="/" className={menuClass}>
                            <MdDashboard className="mr-4 text-xl" /> Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/orders" className={menuClass}>
                            <RiListUnordered className="mr-4 text-xl" /> Orders
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/customers" className={menuClass}>
                            <RiCustomerServiceFill className="mr-4 text-xl" /> Customers
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/products" className={menuClass}>
                            <RiListUnordered className="mr-4 text-xl" /> Products
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/components" className={menuClass}>
                            <RiListUnordered className="mr-4 text-xl" /> Components
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/fitur-xyz" className={menuClass}>
                            <RiListUnordered className="mr-4 text-xl" /> Fitur XYZ
                        </NavLink>
                    </li>

                    {/* Error Menu Section */}
                    <li>
                        <NavLink to="/error/400" className={menuClass}>
                            <BiSolidError className="mr-4 text-xl" /> Error 400
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/error/401" className={menuClass}>
                            <BiSolidError className="mr-4 text-xl" /> Error 401
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/error/403" className={menuClass}>
                            <BiSolidError className="mr-4 text-xl" /> Error 403
                        </NavLink>
                    </li>
                </ul>
            </div>

            {/* Sidebar Footer - Ditambahkan pt-5 untuk jarak ekstra */}
            <div id="sidebar-footer" className="mt-auto pt-5">
                <div id="footer-card" className="bg-hijau px-4 py-4 rounded-3xl shadow-lg mb-8 flex items-center justify-between gap-4">
                    <div id="footer-text" className="flex-1 flex flex-col items-start">
                        <p className="text-white text-[11px] font-medium leading-tight mb-3">
                            Please organize your menus through button below!
                        </p>
                        <button id="add-menu-button" className="flex justify-center items-center w-full py-2 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
                            <FaPlus className="text-gray-600 text-xs mr-2" />
                            <span className="text-gray-700 font-bold text-xs">Add Menus</span>
                        </button>
                    </div>
                    <div className="flex-shrink-0">
                        <img
                            id="footer-avatar"
                            src="/img/download.jpg"
                            alt="Support Avatar"
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-white/20"
                        />
                    </div>
                </div>

                <div className="px-2">
                    <span id="footer-brand" className="block font-bold text-gray-400 text-xs">
                        Sedap Restaurant Admin Dashboard
                    </span>
                    <p id="footer-copyright" className="font-light text-gray-400 text-[10px] mt-1">
                        &copy; 2025 All Right Reserved
                    </p>
                </div>
            </div>
        </div>
    );
}