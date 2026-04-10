export default function InputField( { label, type, placeholder } ){
    return (
        <div>
            <label className="black text-amber-500 font-medium mb-1">{label}</label>
            <input type={type}
            placeholder={placeholder}
            className="w-full p-2 border border-gray-300 rounded-2xl" />
        </div>
    )
}