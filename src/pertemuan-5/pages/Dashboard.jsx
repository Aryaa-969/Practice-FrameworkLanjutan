import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
// Import tambahan untuk chart
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
    // Data Dummy untuk grafik
    const lineData = [
        { name: 'Sunday', orders: 200 },
        { name: 'Monday', orders: 456 },
        { name: 'Tuesday', orders: 300 },
        { name: 'Wednesday', orders: 500 },
        { name: 'Thursday', orders: 250 },
        { name: 'Friday', orders: 400 },
        { name: 'Saturday', orders: 350 },
    ];

    const pieData = [
        { name: 'Total Order', value: 81, color: '#FF5B5B' },
        { name: 'Customer Growth', value: 22, color: '#00B074' },
        { name: 'Total Revenue', value: 62, color: '#2D9CDB' },
    ];

    return (
        <div id="dashboard-container">
            <PageHeader />
            <div id="dashboard-grid" className="p-5 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="orders-icon" className="bg-hijau rounded-full p-4">
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="text-3xl font-bold">75</span>
                        <span id="orders-text" className="text-gray-400">Total Orders</span>
                    </div>
                </div>

                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="delivered-icon" className="bg-hijau rounded-full p-4">
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="text-3xl font-bold">175</span>
                        <span id="delivered-text" className="text-gray-400">Total Delivered</span>
                    </div>
                </div>

                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="canceled-icon" className="bg-hijau rounded-full p-4">
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="text-3xl font-bold">40</span>
                        <span id="canceled-text" className="text-gray-400">Total Canceled</span>
                    </div>
                </div>

                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="revenue-icon" className="bg-hijau rounded-full p-4">
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="text-3xl font-bold">Rp.128</span>
                        <span id="revenue-text" className="text-gray-400">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* --- PENAMBAHAN KOMPONEN BARU DI BAWAH --- */}
            <div className="p-5 grid md:grid-cols-3 gap-4">

                {/* Pie Chart Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4">Pie Chart</h3>
                    <div className="flex justify-around">
                        {pieData.map((entry, index) => (
                            <div key={index} className="text-center">
                                <PieChart width={80} height={80}>
                                    <Pie
                                        data={[entry, { value: 100 - entry.value }]}
                                        innerRadius={25}
                                        outerRadius={35}
                                        dataKey="value"
                                        startAngle={90}
                                        endAngle={450}
                                    >
                                        <Cell fill={entry.color} />
                                        <Cell fill="#f3f4f6" />
                                    </Pie>
                                </PieChart>
                                <p className="text-sm font-bold">{entry.value}%</p>
                                <p className="text-[10px] text-gray-400 uppercase">{entry.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chart Order Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg">Chart Order</h3>
                        <button className="bg-blue-50 text-blue-500 px-4 py-1 rounded text-sm border border-blue-200">Save Report</button>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <XAxis dataKey="name" hide />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#2D9CDB"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#2D9CDB' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                        <span>Sunday</span>
                        <span>Monday</span>
                        <span>Tuesday</span>
                        <span>Wednesday</span>
                        <span>Thursday</span>
                        <span>Friday</span>
                        <span>Saturday</span>
                    </div>
                </div>
            </div>
        </div>
    );
}