export default function TailwindCSS(){
    return (
        <>
            <FlexboxGrid/>
            <div>
                <h1 className ="border m-4 rounded px-2 py-2">Belajar Tailwind CSS 4 </h1>
                <button className ="bg-blue-950 text-amber-400 px-4
                                    py-2 mx-4 rounded shadow-lg">
                    Click Me
                </button>
            </div>
            <Spacing/>
            <Typography/>
            <BorderRadius/>
            <BackgroundColors/>
            <ShadowEffects/>
        </>
        
    )
}

function Spacing(){
    return (
        <div className="bg-blue-950 shadow-lg p-6 m-4 rounded-lg">
            <h2 className="text-lg font-semibold text-amber-400">Card Title</h2>
            <p className="mt-2 text-white">Ini adalah contoh penggunaan padding dan margin di Tailwind.</p>
        </div>
    )
}

function Typography(){
    return (
        <div className="m-4">
            <h1 className="text-5xl font-bold text-blue-950">Tailwind Typography</h1>
            <p className="text-gray-600 text-lg mt-2">Belajar Tailwind sangat menyenangkan dan cepat!</p>
        </div>
    )
}

function BorderRadius(){
    return (
        <div className="m-4">
            <button className="border-2 bg-blue-950 border-blue-950 text-amber-400 px-4 py-2 rounded-l-2xl my-4 mx-1"> Klik Saya </button>
            <button className="border-2 bg-blue-950 border-blue-950 text-amber-400 px-4 py-2 rounded-r-2xl my-4"> Klik Saya </button>
        </div>
        
    )
}

function BackgroundColors(){
    return(
        <div className="m-4 bg-blue-950 text-white p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Tailwind Colors</h3>
            <p className="mt-2">Belajar Tailwind itu seru dan fleksibel!</p>
        </div>
    )
}

function FlexboxGrid(){
    return (
        <nav className="m-4 flex justify-between bg-blue-950 p-4 text-white rounded">
            <h1 className="text-lg font-bold">DINO APPS</h1>
            <ul className="flex space-x-4">
                <li><a href="#">Home</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Contact</a></li>
            </ul>
        </nav>
    )
}

function ShadowEffects(){
    return (
        <div className="bg-white shadow-lg p-6 rounded-lg hover:shadow-cyan-300 transition m-4">
            <h3 className="text-xl font-semibold">Hover me!</h3>
            <p className="text-gray-600 mt-2">Lihat efek bayangan saat hover.</p>
        </div>
    )
}