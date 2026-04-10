export default function TailwindCSS() {
    return (
        <div className="bg-gray-100 min-h-screen">
            <FlexboxGrid />

            <div className="max-w-5xl mx-auto px-4 py-6">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="border inline-block rounded px-6 py-3 text-xl font-semibold">
                        Belajar Tailwind CSS 4
                    </h1>
                    <div>
                        <button className="bg-blue-950 text-amber-400 px-6 py-2 mt-4 rounded shadow-lg">
                            Click Me
                        </button>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6">

                    <Spacing />
                    <Typography />
                    <BackgroundColors />
                    <ShadowEffects />

                </div>

                {/* Bottom Section */}
                <div className="mt-6 flex justify-center">
                    <BorderRadius />
                </div>

            </div>
        </div>
    );
}

function Spacing() {
    return (
        <div className="bg-blue-950 shadow-lg p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-amber-400">Card Title</h2>
            <p className="mt-2 text-white">
                Ini adalah contoh penggunaan padding dan margin di Tailwind.
            </p>
        </div>
    );
}

function Typography() {
    return (
        <div className="bg-transparent shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-blue-950 m-6">
                Tailwind Typography
            </h1>
            <p className="text-gray-600 text-lg mt-2 m-6">
                Belajar Tailwind sangat menyenangkan dan cepat!
            </p>
        </div>
    );
}

function BorderRadius() {
    return (
        <div className="flex">
            <button className="border-2 bg-blue-950 border-blue-950 text-amber-400 px-4 py-2 rounded-l-2xl mx-1">
                Klik Saya
            </button>
            <button className="border-2 bg-blue-950 border-blue-950 text-amber-400 px-4 py-2 rounded-r-2xl mx-1">
                Klik Saya
            </button>
        </div>
    );
}

function BackgroundColors() {
    return (
        <div className="bg-blue-950 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Tailwind Colors</h3>
            <p className="mt-2">
                Belajar Tailwind itu seru dan fleksibel!
            </p>
        </div>
    );
}

function FlexboxGrid() {
    return (
        <nav className="flex justify-between items-center bg-blue-950 px-6 py-4 text-white shadow-md">
            <h1 className="text-lg font-bold">DINO APPS</h1>
            <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-amber-400">Home</a></li>
                <li><a href="#" className="hover:text-amber-400">About</a></li>
                <li><a href="#" className="hover:text-amber-400">Contact</a></li>
            </ul>
        </nav>
    );
}

function ShadowEffects() {
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-cyan-300 transition">
            <h3 className="text-xl font-semibold">Hover me!</h3>
            <p className="text-gray-600 mt-2">
                Lihat efek bayangan saat hover.
            </p>
        </div>
    );
}