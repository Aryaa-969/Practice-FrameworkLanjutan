// 1. IMPORT SEMUA KOMPONEN YANG DIBUTUHKAN
import PageHeader from '../components/PageHeader';
import Container from '../components/Container';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import Badge from '../components/Badge';
import Card from '../components/Card';
import ProductCard from '../components/ProductCard';
import Table from '../components/Table';
import Footer from '../components/Footer';

export default function Components() {

    const headers = [
        "No",
        "Nama Produk",
        "Kategori",
        "Harga",
        "Aksi"
    ];

    const products = [
        {
            id: 1,
            name: "Laptop Asus",
            category: "Elektronik",
            price: "Rp 8.000.000"
        },
        {
            id: 2,
            name: "Sepatu Sport",
            category: "Fashion",
            price: "Rp 450.000"
        },
        {
            id: 3,
            name: "Jam Tangan",
            category: "Aksesoris",
            price: "Rp 799.000"
        }
    ];

    return (
        <Container>
            {/* Header Halaman */}
            <PageHeader
                title="Components Showcase"
                breadcrumb={["Dashboard", "Components"]}
            />

            {/* Alur Konten Utama */}
            <div className="space-y-8 my-6">

                {/* --- BARIS 1: ELEMEN KECIL (GRID 3 KOLOM) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Kelompok Buttons */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Buttons</h3>
                        <div className="flex flex-wrap gap-3">
                            <Button type="success">Simpan</Button>
                            <Button type="danger">Hapus</Button>
                        </div>
                    </div>

                    {/* Kelompok Avatars */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Avatars</h3>
                        <div className="flex items-center gap-3">
                            <Avatar name="Budi" />
                            <Avatar name="Siti" />
                        </div>
                    </div>

                    {/* Kelompok Badges */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Badges</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge type="success">Aktif</Badge>
                            <Badge type="warning">Proses</Badge>
                            <Badge type="danger">Selesai</Badge>
                        </div>
                    </div>
                </div>

                {/* --- BARIS 2: CARDS DISPLAY (GRID RESPONSIVE) --- */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">

                    {/* Standar Card */}
                    <div className="xl:col-span-1">
                        <Card>
                            <h2 className="text-xl font-bold text-gray-800">Judul Card</h2>
                            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                                Ini adalah isi dari card standar untuk membungkus berbagai tipe konten informasi.
                            </p>
                        </Card>
                    </div>

                    {/* Product Cards Grid */}
                    <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ProductCard
                            image="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"
                            title="Sepatu Sport"
                            category="Fashion"
                            price="Rp 450.000"
                            description="Sepatu sport modern dengan desain nyaman dan ringan untuk aktivitas sehari-hari."
                        />

                        <ProductCard
                            image="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400"
                            title="Smartphone"
                            category="Elektronik"
                            price="Rp 4.500.000"
                            description="Smartphone dengan performa cepat, kamera jernih, dan baterai tahan lama."
                        />
                    </div>
                </div>

                {/* --- BARIS 3: DATA MASTER TABLE --- */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
                    <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                        <h3 className="text-lg font-bold text-gray-800">Data Master Produk</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full font-medium">
                            {products.length} Item
                        </span>
                    </div>

                    <Table headers={headers}>
                        {products.map((product, index) => (
                            <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="border-b border-gray-100 px-4 py-3.5 text-gray-500 text-sm">
                                    {index + 1}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3.5 font-medium text-gray-800">
                                    {product.name}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3.5 text-gray-600 text-sm">
                                    <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3.5 text-gray-900 font-semibold text-sm">
                                    {product.price}
                                </td>
                                <td className="border-b border-gray-100 px-4 py-3.5">
                                    <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium shadow-xs transition-all active:scale-95 cursor-pointer">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </Table>
                </div>
            </div>

            {/* Footer Halaman */}
            <Footer />
        </Container>
    );
}