import { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { productService } from '../services/productService';
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';

export default function Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [error, setError] = useState("");
    
    const [formData, setFormData] = useState({
        code: "",
        brand: "",
        title: "",
        category: "Electronics",
        price: "",
        stock: "",
        image_url: ""
    });

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await productService.fetchProducts();
            setProducts(data);
        } catch (err) {
            console.error("Gagal memuat produk:", err);
            setError("Gagal memuat produk dari database");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleOpenAdd = () => {
        setEditingProduct(null);
        setFormData({
            code: `PRD-${String(products.length + 1).padStart(3, '0')}`,
            brand: "",
            title: "",
            category: "Electronics",
            price: "",
            stock: "",
            image_url: ""
        });
        setError("");
        setShowForm(true);
    };

    const handleOpenEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            code: product.code || "",
            brand: product.brand || "",
            title: product.title || "",
            category: product.category || "Electronics",
            price: String(product.price),
            stock: String(product.stock),
            image_url: product.image_url || ""
        });
        setError("");
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Apakah Anda yakin ingin menghapus produk ini?")) {
            try {
                await productService.deleteProduct(id);
                loadProducts();
            } catch (err) {
                console.error("Gagal menghapus produk:", err);
                alert("Gagal menghapus produk: " + err.message);
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.title || !formData.price || !formData.stock) {
            setError("Nama Produk, Harga, dan Stok wajib diisi!");
            return;
        }

        try {
            if (editingProduct) {
                await productService.updateProduct(editingProduct.id, formData);
            } else {
                await productService.createProduct(formData);
            }
            setShowForm(false);
            loadProducts();
        } catch (err) {
            console.error("Gagal menyimpan produk:", err);
            setError(err.message || "Gagal menyimpan produk");
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const getStockStatusLabel = (stock) => {
        if (stock === 0) return "Out of Stock";
        if (stock <= 10) return "Low Stock";
        return "In Stock";
    };

    const getStatusStyle = (stock) => {
        if (stock === 0) {
            return "bg-red-100 text-red-700 border border-red-200";
        } else if (stock <= 10) {
            return "bg-yellow-100 text-yellow-700 border border-yellow-200";
        } else {
            return "bg-green-100 text-green-700 border border-green-200";
        }
    };

    const filteredProducts = products.filter(product =>
        (product.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.code || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div id="products-page" className="pb-10">
            <PageHeader
                title="Product List"
                breadcrumb={["Dashboard", "Product List"]}
            >
                <button
                    onClick={handleOpenAdd}
                    className="bg-[#00B074] hover:bg-[#009663] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
                >
                    <FaPlus /> Add New Product
                </button>
            </PageHeader>

            <div className="px-8">
                {/* Search Bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                        <h2 className="text-xl font-bold text-gray-800">Database Produk</h2>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama produk atau kode..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#00B074] outline-none w-72 transition-all"
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-12 flex flex-col items-center justify-center text-gray-500">
                            <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                            <span>Memuat data produk dari database...</span>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="p-12 text-center text-gray-500">
                            Tidak ada produk yang ditemukan.
                        </div>
                    ) : (
                        <div className="max-h-[60vh] overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-gray-200">
                            <table className="w-full text-left border-collapse min-w-[900px]">
                                <thead className="bg-gray-50 sticky top-0 z-10 shadow-[0_1px_0_0_rgba(229,231,235,1)]">
                                    <tr className="text-gray-500 text-xs uppercase tracking-wider">
                                        <th className="px-6 py-4 font-bold w-[120px] bg-gray-50">Code</th>
                                        <th className="px-6 py-4 font-bold min-w-[220px] bg-gray-50">Product Name</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50">Category</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50">Brand</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50">Price</th>
                                        <th className="px-6 py-4 font-bold bg-gray-50">Stock Status</th>
                                        <th className="px-6 py-4 font-bold text-center w-[120px] bg-gray-50">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {filteredProducts.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs font-bold text-gray-400">{item.code || '-'}</td>
                                            <td className="px-6 py-4 max-w-[260px] truncate font-medium">
                                                <Link to={`/products/${item.id}`} className="text-[#00B074] hover:text-[#009663] transition-colors font-semibold">
                                                    {item.title}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{item.category || '-'}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700">{item.brand || '-'}</td>
                                            <td className="px-6 py-4 font-bold text-gray-800">{formatRupiah(item.price)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(item.stock)}`}>
                                                    {getStockStatusLabel(item.stock)} ({item.stock})
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <button 
                                                        onClick={() => handleOpenEdit(item)}
                                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50 transition-all"
                                                        title="Edit"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-all"
                                                        title="Hapus"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="p-6 bg-gray-50/50 border-t border-gray-100 text-sm text-gray-500">
                        Showing {filteredProducts.length} entries
                    </div>
                </div>
            </div>

            {/* Modal Form */}
            {showForm && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            {editingProduct ? "Edit Product" : "Add New Product"}
                        </h2>
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-sm">
                                {error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Product Code</label>
                                    <input 
                                        type="text" 
                                        name="code"
                                        value={formData.code}
                                        onChange={handleInputChange}
                                        placeholder="e.g. PRD-001" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Brand</label>
                                    <input 
                                        type="text" 
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Apple, Nike" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Product Name / Title *</label>
                                <input 
                                    type="text" 
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Product Name" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Category</label>
                                <select 
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none"
                                >
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
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Price (IDR) *</label>
                                    <input 
                                        type="number" 
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        placeholder="0" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-600 mb-1">Stock Quantity *</label>
                                    <input 
                                        type="number" 
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleInputChange}
                                        placeholder="0" 
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg" 
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B074] outline-none" 
                                />
                            </div>

                            <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-gray-100">
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
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}