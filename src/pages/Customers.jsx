import React, { useState, useEffect } from 'react';
import PageHeader from "../components/PageHeader";
import { customerService } from "../services/customerService";
import { FaSearch } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";

export default function Customers() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState("");

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.fetchCustomers();
            setCustomers(data);
        } catch (err) {
            console.error("Gagal memuat customer:", err);
            setError("Gagal memuat database pelanggan");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    const getLoyaltyStyle = (loyalty) => {
        switch (loyalty) {
            case "Gold": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Silver": return "bg-gray-100 text-gray-700 border border-gray-200";
            case "Bronze": return "bg-orange-100 text-orange-700 border border-orange-200";
            default: return "bg-blue-100 text-blue-700 border border-blue-200";
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div id="customers-page" className="pb-10">
            <PageHeader
                title="Customer"
                breadcrumb={["Dashboard", "Customer List"]}
            />

            <div className="px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Search Bar Inside Table Header */}
                    <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                        <h2 className="text-xl font-bold text-gray-800">Customer Database</h2>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau ID..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#00B074] outline-none w-72 transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                            <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                            <span>Memuat database customer...</span>
                        </div>
                    ) : error ? (
                        <div className="p-12 text-center text-red-500 font-semibold">
                            {error}
                        </div>
                    ) : filteredCustomers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Tidak ada pelanggan yang ditemukan.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50/50">
                                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-bold">Customer ID</th>
                                        <th className="px-6 py-4 font-bold">Customer Name</th>
                                        <th className="px-6 py-4 font-bold">Phone Number</th>
                                        <th className="px-6 py-4 font-bold">Points</th>
                                        <th className="px-6 py-4 font-bold">Loyalty Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.dbId} className="hover:bg-green-50/30 transition-colors group">
                                            <td className="px-6 py-4 font-mono font-bold text-gray-700 text-sm">
                                                {customer.customerId}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#00B074] text-white flex items-center justify-center font-bold text-xs uppercase">
                                                        {customer.customerName.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{customer.customerName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 text-sm">{customer.phone}</td>
                                            <td className="px-6 py-4 text-gray-800 font-bold text-sm">{customer.points} pts</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getLoyaltyStyle(customer.loyalty)}`}>
                                                    {customer.loyalty}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
                        Showing {filteredCustomers.length} entries
                    </div>
                </div>
            </div>
        </div>
    );
}