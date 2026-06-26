import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { notesAPI } from '../services/notesAPI';
import { useToast } from '../components/Toast';
import { ImSpinner2 } from 'react-icons/im';
import { FaCrown, FaExchangeAlt, FaSignOutAlt, FaBookOpen, FaPlus, FaMinus, FaTrash, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUtensils, FaSearch, FaShoppingCart, FaTimes } from 'react-icons/fa';

export default function MemberDashboard() {
    const { user, profile, signOut, refreshProfile } = useAuth();
    const navigate = useNavigate();
    const { showSuccess, showError, showWarning, showSuccessModal } = useToast();
    
    // Core data states
    const [orders, setOrders] = useState([]);
    const [notes, setNotes] = useState([]);
    const [products, setProducts] = useState([]);
    
    // Loading states
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [submittingOrder, setSubmittingOrder] = useState(false);
    
    // Navigation / Search / Form states
    const [activeTab, setActiveTab] = useState("dashboard"); // "dashboard", "products", or "notes"
    const [searchQuery, setSearchQuery] = useState("");
    const [noteForm, setNoteForm] = useState({ title: "", content: "", status: "Active" });

    // Shopping Cart states
    const [cart, setCart] = useState([]);
    const [showCartModal, setShowCartModal] = useState(false);

    useEffect(() => {
        if (user) {
            loadOrders();
            loadNotes();
            loadProducts();
        }
    }, [user]);

    const loadOrders = async () => {
        try {
            setLoadingOrders(true);
            const data = await orderService.fetchMyOrders(user.id);
            setOrders(data);
        } catch (err) {
            console.error("Gagal memuat orders:", err);
        } finally {
            setLoadingOrders(false);
        }
    };

    const loadNotes = async () => {
        try {
            setLoadingNotes(true);
            const data = await notesAPI.fetchNotes();
            setNotes(data || []);
        } catch (err) {
            console.error("Gagal memuat catatan:", err);
        } finally {
            setLoadingNotes(false);
        }
    };

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const data = await productService.fetchProducts();
            setProducts(data || []);
        } catch (err) {
            console.error("Gagal memuat produk:", err);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleCreateNote = async (e) => {
        e.preventDefault();
        if (!noteForm.title || !noteForm.content) return;

        try {
            setLoadingNotes(true);
            await notesAPI.createNote({
                title: noteForm.title,
                content: noteForm.content,
                status: noteForm.status
            });
            setNoteForm({ title: "", content: "", status: "Active" });
            loadNotes();
        } catch (err) {
            console.error("Gagal menambah catatan:", err);
            showError('Gagal!', 'Gagal menambah catatan: ' + err.message);
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleDeleteNote = async (id) => {
        if (!window.confirm("Hapus catatan ini?")) return;
        try {
            setLoadingNotes(true);
            await notesAPI.deleteNote(id);
            loadNotes();
        } catch (err) {
            console.error("Gagal menghapus catatan:", err);
            showError('Gagal!', 'Gagal menghapus catatan: ' + err.message);
        } finally {
            setLoadingNotes(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut();
            navigate("/login");
        } catch (err) {
            console.error("Gagal logout:", err);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    // Cart Handlers
    const addToCart = (product) => {
        if (product.stock <= 0) {
            showWarning('Stok Habis', 'Maaf, stok produk ini sudah habis!');
            return;
        }

        const existingItem = cart.find(item => item.product.id === product.id);
        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                showWarning('Batas Tercapai', `Hanya ada ${product.stock} unit stok tersedia.`);
                return;
            }
            setCart(cart.map(item => 
                item.product.id === product.id 
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            ));
        } else {
            setCart([...cart, { product, quantity: 1 }]);
            showSuccess('Ditambahkan!', `${product.title} masuk ke keranjang.`, 2500);
        }
    };

    const updateCartQty = (productId, change) => {
        const item = cart.find(i => i.product.id === productId);
        if (!item) return;

        const newQty = item.quantity + change;
        if (newQty <= 0) {
            setCart(cart.filter(i => i.product.id !== productId));
        } else {
            if (change > 0 && newQty > item.product.stock) {
                showWarning('Stok Terbatas', 'Stok produk tidak mencukupi!');
                return;
            }
            setCart(cart.map(i => 
                i.product.id === productId 
                    ? { ...i, quantity: newQty }
                    : i
            ));
        }
    };

    const removeFromCart = (productId) => {
        setCart(cart.filter(item => item.product.id !== productId));
    };

    const getCartTotal = () => {
        return cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;

        try {
            setSubmittingOrder(true);
            const orderItems = cart.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            }));
            const total = getCartTotal();

            await orderService.createOrder(user.id, orderItems, total);
            
            // Refresh global auth profile to update points and tier in UI
            try {
                await refreshProfile();
            } catch (pRefErr) {
                console.error("Gagal refresh profile:", pRefErr);
            }
            
            // Clear cart & state reset
            setCart([]);
            setShowCartModal(false);
            
            // Show beautiful success modal
            showSuccessModal({
                title: 'Pesanan Berhasil! 🎉',
                message: `Pesanan senilai ${formatRupiah(total)} berhasil dibuat. Silakan tunggu konfirmasi dari admin. Terima kasih telah berbelanja!`,
                buttonText: 'Lihat Riwayat Pesanan'
            });
            
            // Refresh order history & products
            loadOrders();
            loadProducts();
            setActiveTab("dashboard");
        } catch (err) {
            console.error("Checkout gagal:", err);
            const statusCode = err.response?.status;
            let errorMsg = err.message;
            
            if (statusCode === 403 || statusCode === 401) {
                errorMsg = 'Sesi login Anda mungkin telah habis. Silakan logout dan login kembali.';
            }
            
            showError('Checkout Gagal', errorMsg, 6000);
        } finally {
            setSubmittingOrder(false);
        }
    };

    // Calculate loyalty tier info
    const points = profile?.points || 0;
    const tier = profile?.tier || 'Bronze';
    let progress = 0;
    let pointsNeeded = 0;
    let nextTier = '';

    if (tier === 'Bronze') {
        nextTier = 'Silver';
        pointsNeeded = 100 - points;
        progress = Math.min(100, (points / 100) * 100);
    } else if (tier === 'Silver') {
        nextTier = 'Gold';
        pointsNeeded = 500 - points;
        progress = Math.min(100, ((points - 100) / 400) * 100);
    } else {
        nextTier = 'Gold (Max Tier)';
        pointsNeeded = 0;
        progress = 100;
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <FaCheckCircle className="text-green-500" />;
            case 'Pending': return <FaHourglassHalf className="text-yellow-500" />;
            default: return <FaTimesCircle className="text-red-500" />;
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Completed": return "bg-green-100 text-green-700 border border-green-200";
            case "Pending": return "bg-yellow-100 text-yellow-700 border border-yellow-200";
            case "Cancelled": return "bg-red-100 text-red-700 border border-red-200";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    // Filter products
    const filteredProducts = products.filter(product =>
        (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.category || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans relative">
            {/* Top Navbar */}
            <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-8">
                        <span className="font-poppins font-black text-2xl tracking-tight">
                            Sedap<b className="text-green-500">.</b>
                        </span>
                        <div className="hidden md:flex gap-4">
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === "dashboard"
                                        ? "text-[#00B074] bg-green-50"
                                        : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                Dashboard & History
                            </button>
                            <button
                                onClick={() => setActiveTab("products")}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === "products"
                                        ? "text-[#00B074] bg-green-50"
                                        : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                Menu / Products
                            </button>
                            <button
                                onClick={() => setActiveTab("notes")}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                    activeTab === "notes"
                                        ? "text-[#00B074] bg-green-50"
                                        : "text-gray-500 hover:text-gray-800"
                                }`}
                            >
                                My Notes
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700 hidden sm:inline">
                            Hello, <b className="text-gray-900">{profile?.full_name || 'Member'}</b>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-bold text-sm flex items-center gap-2"
                            title="Log Out"
                        >
                            <FaSignOutAlt />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>

                {/* Mobile Tab Nav */}
                <div className="flex md:hidden border-t border-gray-50">
                    <button
                        onClick={() => setActiveTab("dashboard")}
                        className={`flex-1 py-3 text-center text-xs font-bold ${
                            activeTab === "dashboard" ? "text-[#00B074] border-b-2 border-[#00B074]" : "text-gray-500"
                        }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab("products")}
                        className={`flex-1 py-3 text-center text-xs font-bold ${
                            activeTab === "products" ? "text-[#00B074] border-b-2 border-[#00B074]" : "text-gray-500"
                        }`}
                    >
                        Menu
                    </button>
                    <button
                        onClick={() => setActiveTab("notes")}
                        className={`flex-1 py-3 text-center text-xs font-bold ${
                            activeTab === "notes" ? "text-[#00B074] border-b-2 border-[#00B074]" : "text-gray-500"
                        }`}
                    >
                        Notes
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
                {activeTab === "dashboard" && (
                    <div className="space-y-6">
                        {/* Hero Loyalty Card & Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Loyalty Progress Card */}
                            <div className="bg-gradient-to-br from-green-800 to-green-950 text-white rounded-3xl p-6 shadow-md relative overflow-hidden md:col-span-2">
                                <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                                    <FaCrown size={220} />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <span className="text-xs uppercase tracking-widest font-black text-green-300">Loyalty Status</span>
                                        <h3 className="text-3xl font-black flex items-center gap-2 mt-1">
                                            {tier} Tier <FaCrown className="text-yellow-400" />
                                        </h3>
                                    </div>
                                    <div className="bg-green-700/40 border border-green-600/30 px-4 py-2 rounded-2xl text-right">
                                        <span className="text-[10px] uppercase font-bold text-green-300 block">Accumulated Points</span>
                                        <span className="text-2xl font-black">{points} <span className="text-xs font-normal">pts</span></span>
                                    </div>
                                </div>

                                {nextTier && tier !== 'Gold' && (
                                    <div className="space-y-2 relative z-10">
                                        <div className="flex justify-between text-xs font-semibold">
                                            <span>Progress to {nextTier}</span>
                                            <span>{pointsNeeded} pts left</span>
                                        </div>
                                        <div className="w-full bg-green-900/50 rounded-full h-3 overflow-hidden">
                                            <div 
                                                className="bg-gradient-to-r from-yellow-400 to-amber-500 h-full rounded-full transition-all duration-500" 
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <p className="text-[11px] text-green-200 italic">
                                            Dapatkan 1 poin untuk setiap transaksi kelipatan Rp 10.000
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Stats Cards */}
                            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider">Transaction Summary</h4>
                                        <FaExchangeAlt className="text-[#00B074]" />
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <span className="text-xs text-gray-500 block">Total Spending</span>
                                            <span className="text-3xl font-black text-gray-800">
                                                {formatRupiah(orders.filter(o => o.status === 'Completed').reduce((acc, curr) => acc + Number(curr.total_amount), 0))}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-xs text-gray-500 block">Total Transactions</span>
                                            <span className="text-xl font-bold text-gray-700">{orders.length} orders</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction History Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-50">
                                <h3 className="text-lg font-bold text-gray-800">My Orders</h3>
                            </div>

                            {loadingOrders ? (
                                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                                    <ImSpinner2 className="text-3xl animate-spin text-[#00B074] mb-2" />
                                    <span>Memuat riwayat transaksi...</span>
                                </div>
                            ) : orders.length === 0 ? (
                                <div className="p-12 text-center text-gray-500">
                                    Belum ada transaksi dilakukan.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50/50">
                                            <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                                <th className="px-6 py-4 font-bold">Order ID</th>
                                                <th className="px-6 py-4 font-bold">Date</th>
                                                <th className="px-6 py-4 font-bold">Total Amount</th>
                                                <th className="px-6 py-4 font-bold">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {orders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-bold text-gray-800">ORD-{order.id.substring(0, 8).toUpperCase()}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {order.created_at ? order.created_at.split('T')[0] : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 font-bold text-gray-800">{formatRupiah(order.total_amount)}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${getStatusStyle(order.status)}`}>
                                                            {getStatusIcon(order.status)}
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tab 2: Products Menu */}
                {activeTab === "products" && (
                    <div className="space-y-6">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <FaUtensils className="text-[#00B074]" /> Daftar Menu / Products
                                </h3>
                                <p className="text-gray-400 text-xs mt-1">Daftar produk restoran yang tersedia secara real-time</p>
                            </div>
                            <div className="relative">
                                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Cari nama menu atau kategori..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#00B074] outline-none w-72 transition-all"
                                />
                            </div>
                        </div>

                        {loadingProducts ? (
                            <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                                <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                                <span>Memuat menu restoran...</span>
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <div className="p-12 bg-white rounded-3xl border border-gray-100 text-center text-gray-500">
                                Tidak ada produk/menu yang ditemukan.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => {
                                    const displayImage = product.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
                                    return (
                                        <div key={product.id} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-all group">
                                            <div>
                                                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                                                    <img 
                                                        src={displayImage} 
                                                        alt={product.title} 
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                                                        onError={(e) => {
                                                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
                                                        }}
                                                    />
                                                    <span className="absolute top-3 left-3 bg-[#00B074] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                        {product.category}
                                                    </span>
                                                </div>

                                                <div className="p-5 space-y-2">
                                                    <span className="text-[10px] font-mono text-gray-400 font-bold block">{product.code}</span>
                                                    <h4 className="font-bold text-gray-800 text-base line-clamp-1">{product.title}</h4>
                                                    <p className="text-gray-500 text-xs line-clamp-2 h-8 leading-relaxed">
                                                        {product.description || "Tidak ada deskripsi produk."}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="p-5 pt-0 mt-4 space-y-4">
                                                <div className="flex justify-between items-center border-t border-gray-50 pt-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-[10px] text-gray-400 uppercase font-black tracking-wider">Harga</span>
                                                        <span className="font-black text-gray-800 text-sm">{formatRupiah(product.price)}</span>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${
                                                        product.stock > 10 ? 'bg-green-50 text-green-700' : product.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                                                    }`}>
                                                        {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'} ({product.stock})
                                                    </span>
                                                </div>

                                                {/* Buy Button */}
                                                <button
                                                    onClick={() => addToCart(product)}
                                                    disabled={product.stock <= 0}
                                                    className="w-full bg-[#00B074] hover:bg-[#009663] text-white py-2.5 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                                >
                                                    <FaShoppingCart /> Buy Menu
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 3: Notes */}
                {activeTab === "notes" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form Note */}
                        <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-fit">
                            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaBookOpen className="text-[#00B074]" /> Write New Note
                            </h3>
                            <form onSubmit={handleCreateNote} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Title *</label>
                                    <input 
                                        type="text" 
                                        value={noteForm.title}
                                        onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                                        placeholder="Judul catatan..." 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none text-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Content *</label>
                                    <textarea 
                                        value={noteForm.content}
                                        onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                                        placeholder="Isi catatan..." 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none text-sm h-28 resize-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Status</label>
                                    <select 
                                        value={noteForm.status}
                                        onChange={(e) => setNoteForm({ ...noteForm, status: e.target.value })}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none text-sm"
                                    >
                                        <option>Active</option>
                                        <option>Draft</option>
                                    </select>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-[#00B074] hover:bg-[#009663] text-white py-3 rounded-xl font-bold transition-all shadow-md mt-4 flex items-center justify-center gap-2"
                                >
                                    <FaPlus /> Save Note
                                </button>
                            </form>
                        </div>

                        {/* List Notes */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="text-lg font-bold text-gray-800">My Notes Archive</h3>
                            
                            {loadingNotes ? (
                                <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                                    <ImSpinner2 className="text-3xl animate-spin text-[#00B074]" />
                                </div>
                            ) : notes.length === 0 ? (
                                <div className="p-12 bg-white rounded-3xl border border-gray-100 text-center text-gray-500">
                                    Belum ada catatan tersimpan.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {notes.map((note) => (
                                        <div key={note.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-4">
                                            <div>
                                                <div className="flex justify-between items-start gap-2">
                                                    <h4 className="font-bold text-gray-800 line-clamp-1">{note.title}</h4>
                                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                                        note.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                        {note.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-4 whitespace-pre-wrap">{note.content}</p>
                                            </div>

                                            <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {note.created_at ? note.created_at.split('T')[0] : ''}
                                                </span>
                                                <button 
                                                    onClick={() => handleDeleteNote(note.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded-xl hover:bg-red-50 transition-all"
                                                    title="Hapus"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Floating Shopping Cart Button (Visible on products tab) */}
            {activeTab === "products" && cart.length > 0 && (
                <button
                    onClick={() => setShowCartModal(true)}
                    className="fixed bottom-8 right-8 bg-[#00B074] hover:bg-[#009663] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all z-40 cursor-pointer"
                >
                    <div className="relative">
                        <FaShoppingCart className="text-2xl" />
                        <span className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center border-2 border-[#00B074]">
                            {cart.reduce((acc, curr) => acc + curr.quantity, 0)}
                        </span>
                    </div>
                </button>
            )}

            {/* Shopping Cart Drawer / Modal */}
            {showCartModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end">
                    {/* Backdrop closer */}
                    <div className="absolute inset-0 cursor-pointer" onClick={() => setShowCartModal(false)} />
                    
                    {/* Cart Drawer */}
                    <div className="bg-white w-full max-w-md h-full relative z-10 shadow-2xl flex flex-col p-6 overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <FaShoppingCart className="text-[#00B074]" /> Shopping Cart
                            </h3>
                            <button 
                                onClick={() => setShowCartModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
                            >
                                <FaTimes className="text-lg" />
                            </button>
                        </div>

                        {/* Cart Items List */}
                        <div className="flex-1 space-y-4">
                            {cart.map((item) => (
                                <div key={item.product.id} className="flex gap-4 p-3 bg-gray-50 rounded-2xl relative border border-gray-100">
                                    <img 
                                        src={item.product.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=250&auto=format&fit=crop"} 
                                        alt={item.product.title} 
                                        className="w-20 h-20 object-cover rounded-xl border border-gray-200"
                                    />
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.product.title}</h4>
                                            <span className="text-xs text-gray-400">{formatRupiah(item.product.price)}</span>
                                        </div>

                                        {/* Qty controller */}
                                        <div className="flex items-center gap-3">
                                            <button 
                                                onClick={() => updateCartQty(item.product.id, -1)}
                                                className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                                            >
                                                <FaMinus className="text-[10px]" />
                                            </button>
                                            <span className="text-sm font-bold text-gray-700">{item.quantity}</span>
                                            <button 
                                                onClick={() => updateCartQty(item.product.id, 1)}
                                                className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-600"
                                            >
                                                <FaPlus className="text-[10px]" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button 
                                        onClick={() => removeFromCart(item.product.id)}
                                        className="text-gray-400 hover:text-red-500 absolute top-3 right-3 p-1.5 rounded-lg hover:bg-red-50"
                                    >
                                        <FaTrash className="text-xs" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Checkout Footer */}
                        <div className="border-t border-gray-100 pt-6 mt-6 space-y-4">
                            <div className="flex justify-between items-center text-gray-700 font-bold">
                                <span>Total Pembayaran</span>
                                <span className="text-xl font-black text-[#00B074]">{formatRupiah(getCartTotal())}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={submittingOrder}
                                className="w-full bg-[#00B074] hover:bg-[#009663] text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-green-100 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {submittingOrder ? (
                                    <>
                                        <ImSpinner2 className="animate-spin" /> Proses checkout...
                                    </>
                                ) : (
                                    <>
                                        Checkout Now
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
