import { useState, useEffect } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from "axios";
import { ImSpinner2 } from 'react-icons/im';

const SUPABASE_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = () => {
    const token = localStorage.getItem("supabase_token");
    return {
        apikey: API_KEY,
        Authorization: `Bearer ${token || API_KEY}`,
        "Content-Type": "application/json",
    };
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalCompleted: 0,
        totalCancelled: 0,
        totalRevenue: 0
    });
    const [lineData, setLineData] = useState([]);
    const [pieData, setPieData] = useState([]);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${SUPABASE_URL}/rest/v1/orders?select=*`,
                { headers: getHeaders() }
            );
            const orders = response.data;

            if (orders) {
                // Aggregations
                const totalOrders = orders.length;
                const completedOrders = orders.filter(o => o.status === 'Completed');
                const cancelledOrders = orders.filter(o => o.status === 'Cancelled');
                const pendingOrders = orders.filter(o => o.status === 'Pending');

                const totalCompleted = completedOrders.length;
                const totalCancelled = cancelledOrders.length;
                const totalRevenue = completedOrders.reduce((acc, curr) => acc + Number(curr.total_amount), 0);

                setStats({
                    totalOrders,
                    totalCompleted,
                    totalCancelled,
                    totalRevenue
                });

                // Line Chart: count of orders by day of week
                const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                const ordersByDay = { Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0 };
                
                orders.forEach(order => {
                    const date = new Date(order.created_at);
                    const dayName = days[date.getDay()];
                    ordersByDay[dayName] = (ordersByDay[dayName] || 0) + 1;
                });

                const formattedLineData = days.map(day => ({
                    name: day,
                    orders: ordersByDay[day]
                }));
                setLineData(formattedLineData);

                // Pie Chart: percent of each status
                const completedPct = totalOrders ? Math.round((totalCompleted / totalOrders) * 100) : 0;
                const pendingPct = totalOrders ? Math.round((pendingOrders.length / totalOrders) * 100) : 0;
                const cancelledPct = totalOrders ? Math.round((totalCancelled / totalOrders) * 100) : 0;

                setPieData([
                    { name: 'Completed', value: completedPct, color: '#00B074' },
                    { name: 'Pending', value: pendingPct, color: '#2D9CDB' },
                    { name: 'Cancelled', value: cancelledPct, color: '#FF5B5B' },
                ]);
            }
        } catch (err) {
            console.error("Gagal memuat statistik dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-gray-500 min-h-[400px]">
                <ImSpinner2 className="text-4xl animate-spin text-[#00B074] mb-3" />
                <span>Memuat ringkasan dashboard...</span>
            </div>
        );
    }

    return (
        <div id="dashboard-container">
            <PageHeader
                title="Dashboard"
                breadcrumb={["Home", "Admin Area", "Stats"]}
            />
            
            {/* Stats widgets */}
            <div id="dashboard-grid" className="p-5 grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div id="dashboard-orders" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="orders-icon" className="bg-[#00B074] text-white rounded-full p-4">
                        <FaShoppingCart />
                    </div>
                    <div id="orders-info" className="flex flex-col">
                        <span id="orders-count" className="text-3xl font-bold text-gray-800">{stats.totalOrders}</span>
                        <span id="orders-text" className="text-gray-400">Total Orders</span>
                    </div>
                </div>

                <div id="dashboard-delivered" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="delivered-icon" className="bg-blue-500 text-white rounded-full p-4">
                        <FaTruck />
                    </div>
                    <div id="delivered-info" className="flex flex-col">
                        <span id="delivered-count" className="text-3xl font-bold text-gray-800">{stats.totalCompleted}</span>
                        <span id="delivered-text" className="text-gray-400">Total Completed</span>
                    </div>
                </div>

                <div id="dashboard-canceled" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="canceled-icon" className="bg-red-500 text-white rounded-full p-4">
                        <FaBan />
                    </div>
                    <div id="canceled-info" className="flex flex-col">
                        <span id="canceled-count" className="text-3xl font-bold text-gray-800">{stats.totalCancelled}</span>
                        <span id="canceled-text" className="text-gray-400">Total Canceled</span>
                    </div>
                </div>

                <div id="dashboard-revenue" className="flex items-center space-x-5 bg-white rounded-lg shadow-md p-4">
                    <div id="revenue-icon" className="bg-green-500 text-white rounded-full p-4">
                        <FaDollarSign />
                    </div>
                    <div id="revenue-info" className="flex flex-col">
                        <span id="revenue-amount" className="text-xl font-bold text-gray-800 truncate max-w-[150px]">
                            {formatRupiah(stats.totalRevenue)}
                        </span>
                        <span id="revenue-text" className="text-gray-400">Total Revenue</span>
                    </div>
                </div>
            </div>

            {/* Charts section */}
            <div className="p-5 grid md:grid-cols-3 gap-4">
                {/* Pie Chart Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="font-bold text-lg mb-4 text-gray-700">Order Status Distribution</h3>
                    <div className="flex justify-around">
                        {pieData.map((entry, index) => (
                            <div key={index} className="text-center flex flex-col items-center">
                                <PieChart width={85} height={85}>
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
                                <p className="text-sm font-bold text-gray-700 mt-1">{entry.value}%</p>
                                <p className="text-[9px] text-gray-400 uppercase font-black tracking-wider">{entry.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Line Chart Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-lg text-gray-700">Weekly Order Frequency</h3>
                        <button 
                            onClick={loadDashboardData}
                            className="bg-green-50 text-[#00B074] hover:bg-green-100 px-4 py-1.5 rounded-xl text-xs font-bold border border-green-200 transition-colors"
                        >
                            Refresh
                        </button>
                    </div>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <XAxis dataKey="name" hide />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="orders"
                                    stroke="#00B074"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: '#00B074' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400 uppercase">
                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>
                    </div>
                </div>
            </div>
        </div>
    );
}