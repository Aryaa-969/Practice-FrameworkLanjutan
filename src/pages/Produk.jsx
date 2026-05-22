import { useState } from 'react';
import PageHeader from '../components/PageHeader';
// 1. Import data JSON (Pastikan file ini sudah ada di src/data/products.json)
import productsData from '../data/products.json';
import { FaEllipsisV } from "react-icons/fa";
import { Link } from 'react-router-dom'; // Dipertahankan dari snippet sebelumnya untuk link detail

export default function Product() {
    const [showForm, setShowForm] = useState(false);

    // Helper untuk mengubah angka ke format Rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Fungsi untuk menentukan label status berdasarkan jumlah stok
    const getStockStatusLabel = (stock) => {
        if (stock === 0) return "Out of Stock";
        if (stock <= 10) return "Low Stock";
        return "In Stock";
    };

    // Fungsi untuk styling warna status stok sesuai template Orders
    const getStatusStyle = (stock) => {
        if (stock === 0) {
            return "bg-red-100 text-red-700 border border-red-200"; // Mirip "Cancelled"
        } else if (stock <= 10) {
            return "bg-yellow-100 text-yellow-700 border border-yellow-200"; // Mirip "Pending"
        } else {
            return "bg-green-100 text-green-700 border border-green-200"; // Mirip "Completed"
        }
    };

    return (
        <div id="products-page" className="pb-10">
            <PageHeader
                title="Product List"
                breadcrumb={["Dashboard", "Product List"]}
            >
                {/* Mengirim tombol sebagai children ke PageHeader */}
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#00B074] hover:bg-[#009663] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
                >
                    + Add New Product
                </button>
            </PageHeader>

            {/* 2. Konten Tabel Utama */}
            <div className="px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    
                    {/* 1. Tambahkan `max-h-[60vh]` (Tinggi maksimal 60% dari tinggi layar web)
                      2. Tambahkan `overflow-y-auto` agar bisa di-scroll ke bawah
                    */}
                    <div className="max-h-[60vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                            {/* 3. Tambahkan `sticky top-0 z-10` agar header tabel tidak ikut tergulung ke atas */}
                            <thead className="bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(229,231,235,1)]">
                                <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="px-6 py-4 font-bold w-[120px] bg-gray-50">Code</th>
                                    <th className="px-6 py-4 font-bold min-w-[220px] bg-gray-50">Product Name</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50">Category</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50">Brand</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50">Price</th>
                                    <th className="px-6 py-4 font-bold bg-gray-50">Stock Status</th>
                                    <th className="px-6 py-4 font-bold text-center w-[80px] bg-gray-50">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {/* Melakukan Mapping 30 Data JSON Produk */}
                                {productsData.map((item, index) => (
                                    <tr key={item.id || index} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">{item.code}</td>
                                        <td className="px-6 py-4 max-w-[260px] truncate font-medium">
                                            <Link to={`/products/${item.id}`} className="text-[#00B074] hover:text-[#009663] transition-colors">
                                                {item.title}
                                            </Link>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{item.category}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{item.brand}</td>
                                        <td className="px-6 py-4 font-bold text-gray-800">{formatRupiah(item.price)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(item.stock)}`}>
                                                {getStockStatusLabel(item.stock)} ({item.stock})
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

                    {/* Footer Tabel - Tetap berada di bawah pembungkus scroll */}
                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
                        Showing {productsData.length} entries
                    </div>
                </div>
            </div>

            {/* 4. Modal Form Sesuai Atribut JSON Produk */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Product</h2>
                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Product Code</label>
                                    <input type="text" placeholder="e.g. PRD-001" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Brand</label>
                                    <input type="text" placeholder="e.g. Apple, Nike" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Product Name / Title</label>
                                <input type="text" placeholder="Product Name" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none">
                                    <option>Electronics</option>
                                    <option>Shoes</option>
                                    <option>Accessories</option>
                                    <option>Clothing</option>
                                    <option>Furniture</option>
                                    <option>Appliances</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Price (IDR)</label>
                                    <input type="number" placeholder="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Stock Quantity</label>
                                    <input type="number" placeholder="0" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Cancel</button>
                                <button type="button" className="bg-[#00B074] text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#009663] transition-all">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}