import axios from 'axios';

const API_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co/rest/v1/profiles";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = () => {
    const token = localStorage.getItem("supabase_token");
    return {
        apikey: API_KEY,
        Authorization: `Bearer ${token || API_KEY}`,
        "Content-Type": "application/json",
    };
};

export const customerService = {
    async fetchCustomers() {
        const response = await axios.get(
            `${API_URL}?role=eq.member&select=*&order=created_at.desc`,
            { headers: getHeaders() }
        );

        return response.data.map(profile => ({
            customerId: `CUST-${profile.id.substring(0, 5).toUpperCase()}`,
            customerName: profile.full_name || 'Member Tanpa Nama',
            email: '',
            phone: profile.phone || '-',
            loyalty: profile.tier || 'Bronze',
            points: profile.points || 0,
            dbId: profile.id
        }));
    }
};
