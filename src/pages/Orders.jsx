import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import { productService } from '../services/productService';
import { FaTrash, FaPlus, FaChevronDown, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { ImSpinner2 } from 'react-icons/im';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState("");

    // Form states
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedItems, setSelectedItems] = useState([{ productId: "", quantity: 1, price: 0, stock: 0 }]);
    const [activeStatusMenu, setActiveStatusMenu] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const [ordersData, customersData, productsData] = await Promise.all([
                orderService.fetchAllOrders(),
                customerService.fetchCustomers(),
                productService.fetchProducts()
            ]);
            setOrders(ordersData);
            setCustomers(customersData);
            setProducts(productsData);
        } catch (err) {
            console.error("Gagal memuat data orders:", err);
            setError("Gagal memuat data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-700 border border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Cancelled": return "bg-red-100 text-red-700 border border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    const handleAddItemRow = () => {
        setSelectedItems([...selectedItems, { productId: "", quantity: 1, price: 0, stock: 0 }]);
    };

    const handleRemoveItemRow = (index) => {
        const items = [...selectedItems];
        items.splice(index, 1);
        setSelectedItems(items);
    };

    const handleItemProductChange = (index, productId) => {
        const product = products.find(p => p.id.toString() === productId.toString());
        const items = [...selectedItems];
        items[index] = {
            productId: productId,
            quantity: 1,
            price: product ? product.price : 0,
            stock: product ? product.stock : 0
        };
        setSelectedItems(items);
    };

    const handleItemQtyChange = (index, qty) => {
        const items = [...selectedItems];
        const stock = items[index].stock;
        const validQty = Math.max(1, Math.min(qty, stock));
        items[index].quantity = validQty;
        setSelectedItems(items);
    };

    const calculateGrandTotal = () => {
        return selectedItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setActiveStatusMenu(null);
            loadData();
        } catch (err) {
            console.error("Gagal merubah status:", err);
            alert("Gagal merubah status: " + err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!selectedCustomerId) {
            setError("Pilih Customer terlebih dahulu!");
            return;
        }

        const validItems = selectedItems.filter(item => item.productId && item.quantity > 0);
        if (validItems.length === 0) {
            setError("Tambahkan minimal 1 produk!");
            return;
        }

        try {
            const grandTotal = calculateGrandTotal();
            await orderService.createOrder(selectedCustomerId, validItems, grandTotal);
            setShowForm(false);
            setSelectedCustomerId("");
            setSelectedItems([{ productId: "", quantity: 1, price: 0, stock: 0 }]);
            loadData();
        } catch (err) {
            console.error("Gagal membuat order:", err);
            setError(err.message || "Gagal membuat order");
        }
    };

    return (
        <div id="orders-page" className="pb-10">
            <PageHeader
                title="Order List"
                breadcrumb={["Dashboard", "Order List"]}
            >
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-[#00B074] hover:bg-[#009663] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-sm flex items-center gap-2"
                >
                    <FaPlus /> Add New Order
                </button>
            </PageHeader>

            <div className="px-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                            <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                            <span>Memuat data transaksi...</span>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Belum ada pesanan terdaftar.
                        </div>
                    ) : (
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
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 font-bold text-gray-800">{order.orderNumber}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-700 font-medium">{order.customerName}</span>
                                                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{order.customerTier} Tier</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{order.orderDate}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{formatRupiah(order.totalPrice)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center relative">
                                                <div className="flex justify-center gap-1">
                                                    {order.status === "Pending" && (
                                                        <>
                                                            <button 
                                                                onClick={() => handleStatusChange(order.id, "Completed")}
                                                                className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-50 transition-all"
                                                                title="Complete Order"
                                                            >
                                                                <FaCheckCircle className="text-lg" />
                                                            </button>
                                                            <button 
                                                                onClick={() => handleStatusChange(order.id, "Cancelled")}
                                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"
                                                                title="Cancel Order"
                                                            >
                                                                <FaTimesCircle className="text-lg" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status !== "Pending" && (
                                                        <span className="text-xs text-gray-400 font-semibold italic">Selesai</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
                        Showing {orders.length} entries
                    </div>
                </div>
            </div>

            {/* Modal Add Order */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Transaction</h2>
                        
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Member Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-2">Select Customer *</label>
                                <select 
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none"
                                    required
                                >
                                    <option value="">-- Choose Member --</option>
                                    {customers.map(c => (
                                        <option key={c.dbId} value={c.dbId}>
                                            {c.customerName} ({c.loyalty} - {c.points} pts)
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Products Table Builder */}
                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-sm font-semibold text-gray-600">Product List</label>
                                    <button 
                                        type="button" 
                                        onClick={handleAddItemRow}
                                        className="text-xs text-[#00B074] hover:text-[#009663] font-bold flex items-center gap-1"
                                    >
                                        <FaPlus /> Add Item
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {selectedItems.map((item, index) => (
                                        <div key={index} className="flex gap-3 items-end">
                                            {/* Product Select */}
                                            <div className="flex-1">
                                                <select
                                                    value={item.productId}
                                                    onChange={(e) => handleItemProductChange(index, e.target.value)}
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none text-sm"
                                                    required
                                                >
                                                    <option value="">-- Product --</option>
                                                    {products.map(p => (
                                                        <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                                                            {p.title} (Stock: {p.stock}) - {formatRupiah(p.price)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Quantity Input */}
                                            <div className="w-24">
                                                <input 
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleItemQtyChange(index, parseInt(e.target.value, 10))}
                                                    placeholder="Qty" 
                                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none text-sm"
                                                    min="1"
                                                    required
                                                />
                                            </div>

                                            {/* Subtotal Display */}
                                            <div className="w-32 p-3 bg-gray-50 border border-gray-100 rounded-xl text-right font-semibold text-sm text-gray-700">
                                                {formatRupiah(item.price * item.quantity)}
                                            </div>

                                            {/* Remove row */}
                                            {selectedItems.length > 1 && (
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveItemRow(index)}
                                                    className="text-red-500 hover:text-red-700 p-3 rounded-xl hover:bg-red-50"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Grand Total */}
                            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl">
                                <span className="font-bold text-gray-700">Grand Total</span>
                                <span className="text-xl font-black text-[#00B074]">{formatRupiah(calculateGrandTotal())}</span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                                <button 
                                    type="button" 
                                    onClick={() => setShowForm(false)} 
                                    className="px-6 py-2 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="bg-[#00B074] text-white px-8 py-2 rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-[#009663] transition-all"
                                >
                                    Submit Order
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}