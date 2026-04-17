import frameworkData from "./framework.json";
import { useState } from "react";

export default function FrameworkListSearchFilter() {
    // const [searchTerm, setSearchTerm] = useState("");
	// const [selectedTag, setSelectedTag] = useState("");

    /*Inisialisasi DataForm*/
		const [dataForm, setDataForm] = useState({
			searchTerm: "",
			selectedTag: "",
			/*Tambah state lain beserta default value*/
			});
		
		/*Inisialisasi Handle perubahan nilai input form*/
		const handleChange = (evt) => {
			const { name, value } = evt.target;
			setDataForm({
				...dataForm,
				[name]: value,
			});
		};
		

    const _searchTerm = dataForm.searchTerm.toLowerCase();
    const filteredFrameworks = frameworkData.filter((framework) => {
        const matchesSearch =
        framework.name
                    .toLowerCase()
                    .includes(_searchTerm) ||
        framework.description
                    .toLowerCase()
                    .includes(_searchTerm);

        const matchesTag = dataForm.selectedTag ? framework.tags.includes(selectedTag) : true;

        return matchesSearch && matchesTag;
    });
    
        const allTags = [
        ...new Set(frameworkData.flatMap((framework) => framework.tags)),
    ];

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            {/* Judul Halaman */}
            <div className="max-w-5xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Framework Directory</h1>
                <p className="text-gray-500 text-sm">Daftar teknologi modern untuk pengembangan web.</p>
            </div>
            
            {/* Grid Card */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                    type="text"
                    name="searchTerm"
                    placeholder="Search framework..."
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={handleChange}
                    />

                    <select
                    name="selectedTag"
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    onChange={handleChange}
                    >
                    <option value="">All Tags</option>
                        {allTags.map((tag, index) => (
                            <option key={index} value={tag}>
                            {tag}
                            </option>
                        ))}
                    </select>

                    {filteredFrameworks.map((item, index) => (
                
                    
                    <div 
                        key={item.id} 
                        className="flex flex-col bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
                    >
                        {/* Header: Judul & Badge Tahun */}
                        <div className="flex justify-between items-start mb-2">
                            <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase">
                                {item.details.releaseYear}
                            </span>
                        </div>

                        {/* Developer Info */}
                        <p className="text-xs text-gray-400 mb-4 font-medium uppercase tracking-wider">
                            By {item.details.developer}
                        </p>

                        {/* Deskripsi */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-grow">
                            {item.description}
                        </p>

                        {/* Footer Card: Tags & Link */}
                        <div className="pt-4 border-t border-gray-100 mt-auto">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {item.tags.map((tag, index) => (
                                    <span key={index} className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                            
                            <a 
                                href={item.details.officialWebsite} 
                                className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 group"
                            >
                                Learn More 
                                <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}