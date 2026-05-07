import React, { useState } from 'react';
import PageHeader from "../components/PageHeader";
// 1. Import data JSON pelanggan
import customersData from "../data/customers.json";
import { FaSearch, FaEllipsisV } from "react-icons/fa";

export default function Customers() {
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Fungsi untuk warna label Loyalty
    const getLoyaltyStyle = (loyalty) => {
        switch (loyalty) {
            case "Gold": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Silver": return "bg-gray-100 text-gray-700 border border-gray-200";
            case "Bronze": return "bg-orange-100 text-orange-700 border border-orange-200";
            default: return "bg-blue-100 text-blue-700";
        }
    };

    // Filter data berdasarkan pencarian (opsional namun berguna)
    const filteredCustomers = customersData.filter(customer =>
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div id="customers-page" className="pb-10">
            {/* 2. Pemanggilan PageHeader dengan Props dan Children */}
            <PageHeader
                title="Customer"
                breadcrumb={["Dashboard", "Customer List"]}
            >
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#00B074] hover:bg-[#009663] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md shadow-green-100"
                >
                    + Add New Customer
                </button>
            </PageHeader>

            <div className="px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Search Bar Inside Table Header */}
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-xl font-bold text-gray-800">Customer Database</h2>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search customer name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#00B074] outline-none w-72 transition-all"
                            />
                        </div>
                    </div>

                    {/* 3. Tabel Data Pelanggan */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50/50">
                                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Customer ID</th>
                                    <th className="px-6 py-4 font-bold">Customer Name</th>
                                    <th className="px-6 py-4 font-bold">Email</th>
                                    <th className="px-6 py-4 font-bold">Phone Number</th>
                                    <th className="px-6 py-4 font-bold">Loyalty Level</th>
                                    <th className="px-6 py-4 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCustomers.map((customer, index) => (
                                    <tr key={index} className="hover:bg-green-50/30 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-700">{customer.customerId}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-[#00B074] text-white flex items-center justify-center font-bold text-xs">
                                                    {customer.customerName.charAt(0)}
                                                </div>
                                                <span className="font-semibold text-gray-800">{customer.customerName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{customer.email}</td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{customer.phone}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getLoyaltyStyle(customer.loyalty)}`}>
                                                {customer.loyalty}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button className="text-gray-400 hover:text-[#00B074] p-2 rounded-full hover:bg-green-50 transition-all">
                                                <FaEllipsisV />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Simple Pagination Info */}
                    <div className="p-6 bg-gray-50/30 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                        <p>Showing {filteredCustomers.length} of {customersData.length} customers</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-1 border border-gray-200 rounded-lg hover:bg-white transition-all">Previous</button>
                            <button className="px-4 py-1 bg-[#00B074] text-white rounded-lg shadow-sm">1</button>
                            <button className="px-4 py-1 border border-gray-200 rounded-lg hover:bg-white transition-all">Next</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Modal Form Add New Customer */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-10 rounded-[32px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
                        <h2 className="text-2xl font-bold text-gray-800 mb-8">Add New Customer</h2>
                        <form className="space-y-5">
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-2 block">Customer Name</label>
                                <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00B074] outline-none" placeholder="e.g. Budi Santoso" />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-500 mb-2 block">Email Address</label>
                                <input type="email" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00B074] outline-none" placeholder="example@mail.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-500 mb-2 block">Phone</label>
                                    <input type="text" className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00B074] outline-none" placeholder="08..." />
                                </div>
                                <div>
                                    <label className="text-sm font-bold text-gray-500 mb-2 block">Loyalty</label>
                                    <select className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[#00B074] outline-none appearance-none">
                                        <option>Bronze</option>
                                        <option>Silver</option>
                                        <option>Gold</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-4 mt-10">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-gray-400 font-bold hover:text-gray-600 transition-colors">Cancel</button>
                                <button type="button" className="bg-[#00B074] text-white px-10 py-3 rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-[#009663] transition-all">Save Customer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}