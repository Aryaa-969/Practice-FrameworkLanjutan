import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import { ImSpinner2 } from "react-icons/im";
import { FaArrowLeft } from "react-icons/fa";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await productService.fetchProductById(id);
                setProduct(data);
            } catch (err) {
                console.error("Gagal memuat detail produk:", err);
                setError(err.message || "Produk tidak ditemukan");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadProduct();
        }
    }, [id]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                <span>Memuat detail produk...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-lg mx-auto text-center mt-12 bg-red-50 border border-red-200 rounded-2xl">
                <p className="text-red-600 font-semibold mb-4">{error}</p>
                <Link to="/products" className="text-white bg-[#00B074] hover:bg-[#009663] px-6 py-2 rounded-xl inline-flex items-center gap-2 font-semibold">
                    <FaArrowLeft /> Kembali ke Daftar Produk
                </Link>
            </div>
        );
    }

    if (!product) return null;

    const displayImage = product.image_url || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";

    return (
        <div className="p-8 max-w-2xl mx-auto mt-6 bg-white rounded-3xl shadow-sm border border-gray-100">
            <Link to="/products" className="text-gray-500 hover:text-gray-700 inline-flex items-center gap-2 mb-6 font-semibold transition-colors">
                <FaArrowLeft /> Kembali
            </Link>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <img
                        src={displayImage}
                        alt={product.title}
                        className="rounded-2xl w-full aspect-square object-cover shadow-sm border border-gray-100"
                        onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop";
                        }}
                    />
                </div>
                
                <div className="flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-mono font-bold text-gray-400 block mb-1">
                            {product.code || 'NO-CODE'}
                        </span>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">{product.title}</h2>
                        
                        <div className="space-y-2 mb-6">
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">Kategori:</span> {product.category || '-'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">Brand:</span> {product.brand || '-'}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800">Stok:</span> {product.stock} unit
                            </p>
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-gray-50">
                        <span className="text-xs text-gray-400 block mb-1">Harga</span>
                        <span className="text-2xl font-black text-gray-900">
                            {formatRupiah(product.price)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}