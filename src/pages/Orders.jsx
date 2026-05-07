import { useState } from 'react';
import PageHeader from '../components/PageHeader';
// 1. Import data JSON (Pastikan file ini sudah ada di src/data/orders.json)
import ordersData from '../data/orders.json';
import { FaEllipsisV } from "react-icons/fa";

export default function Orders() {
    const [showForm, setShowForm] = useState(false);

    // Fungsi untuk styling warna status
    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-700 border border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Cancelled": return "bg-red-100 text-red-700 border border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div id="orders-page" className="pb-10">
            <PageHeader
                title="Order List"
                breadcrumb={["Dashboard", "Order List"]}
            >
                {/* Mengirim tombol sebagai children ke PageHeader */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#00B074] hover:bg-[#009663] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                    + Add New Order
                </button>
            </PageHeader>

            {/* 2. Konten Tabel Utama */}
            <div className="px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50">
                                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold">Order ID</th>
                                    <th className="px-6 py-4 font-bold">Customer Name</th>
                                    <th className="px-6 py-4 font-bold">Order Date</th>
                                    <th className="px-6 py-4 font-bold">Total Price</th>
                                    <th className="px-6 py-4 font-bold">Status</th>
                                    <th className="px-6 py-4 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {/* 3. Melakukan Mapping 30 Data JSON */}
                                {ordersData.map((order, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-bold text-gray-800">{order.orderId}</td>
                                        <td className="px-6 py-4 text-gray-700 font-medium">{order.customerName}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{order.totalPrice}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-400">
                                            <button className="hover:text-[#00B074] p-2 rounded-full hover:bg-green-50 transition-all">
                                                <FaEllipsisV />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Footer Tabel (Optional) */}
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
                        Showing {ordersData.length} entries
                    </div>
                </div>
            </div>

            {/* 4. Modal Form Sesuai Atribut JSON */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Order</h2>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Customer Name</label>
                                <input type="text" placeholder="Full Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Order Date</label>
                                <input type="date" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none">
                                    <option>Pending</option>
                                    <option>Completed</option>
                                    <option>Cancelled</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Total Price</label>
                                <input type="text" placeholder="Rp. 0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                            </div>

                            <div className="flex justify-end space-x-3 mt-8">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                                <button type="button" className="bg-[#00B074] text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#009663] transition-all">Save Order</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}