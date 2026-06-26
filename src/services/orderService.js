import axios from 'axios';

const BASE_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co/rest/v1";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = () => {
    const token = localStorage.getItem("supabase_token");
    return {
        apikey: API_KEY,
        Authorization: `Bearer ${token || API_KEY}`,
        "Content-Type": "application/json",
    };
};

export const orderService = {
    /**
     * Fetch all orders (admin view).
     * Joins with profiles table using member_id.
     * Actual columns: id, member_id, total_amount, status, created_at
     */
    async fetchAllOrders() {
        const response = await axios.get(
            `${BASE_URL}/orders?select=*,profiles:member_id(full_name,tier)&order=created_at.desc`,
            { headers: getHeaders() }
        );

        return response.data.map(order => ({
            id: order.id,
            orderNumber: order.id.substring(0, 8).toUpperCase(),
            customerName: order.profiles?.full_name || 'Member',
            customerTier: order.profiles?.tier || 'Bronze',
            status: order.status,
            totalPrice: order.total_amount,
            orderDate: order.created_at ? order.created_at.split('T')[0] : '-',
            memberId: order.member_id
        }));
    },

    /**
     * Fetch orders for a specific member.
     * Uses member_id (not customer_id).
     */
    async fetchMyOrders(userId) {
        const response = await axios.get(
            `${BASE_URL}/orders?member_id=eq.${userId}&select=*&order=created_at.desc`,
            { headers: getHeaders() }
        );
        return response.data;
    },

    /**
     * Fetch order items for a specific order.
     * Actual columns: id, order_id, product_id, quantity
     */
    async fetchOrderItems(orderId) {
        const response = await axios.get(
            `${BASE_URL}/order_items?order_id=eq.${orderId}&select=*,products:product_id(name)`,
            { headers: getHeaders() }
        );
        return response.data;
    },

    /**
     * Create a new order with items.
     * Orders table: member_id, total_amount, status
     * Order_items table: order_id, product_id, quantity
     */
    async createOrder(memberId, items, totalAmount) {
        const headers = {
            ...getHeaders(),
            Prefer: "return=representation"
        };

        // 1. Insert order — try with member_id, fallback without (DB default auth.uid())
        let orderResponse;
        try {
            orderResponse = await axios.post(
                `${BASE_URL}/orders`,
                {
                    member_id: memberId,
                    total_amount: totalAmount,
                    status: 'Pending'
                },
                { headers }
            );
        } catch (firstErr) {
            // If 403/401 (RLS), retry without member_id — let DB use DEFAULT auth.uid()
            if (firstErr.response?.status === 403 || firstErr.response?.status === 401) {
                orderResponse = await axios.post(
                    `${BASE_URL}/orders`,
                    {
                        total_amount: totalAmount,
                        status: 'Pending'
                    },
                    { headers }
                );
            } else {
                throw firstErr;
            }
        }

        const order = orderResponse.data[0];

        // 2. Insert order items (no price column in order_items)
        const orderItemsToInsert = items.map(item => ({
            order_id: order.id,
            product_id: item.productId,
            quantity: item.quantity
        }));

        try {
            await axios.post(
                `${BASE_URL}/order_items`,
                orderItemsToInsert,
                { headers }
            );
        } catch (itemsError) {
            // Rollback order if items insertion fails
            try {
                await axios.delete(
                    `${BASE_URL}/orders?id=eq.${order.id}`,
                    { headers: getHeaders() }
                );
            } catch (rollbackErr) {
                console.error("Rollback failed:", rollbackErr);
            }
            throw itemsError;
        }

        // 3. Update member points and tier (1 point for every multiple of Rp 10,000)
        try {
            const finalMemberId = order.member_id || memberId;
            if (finalMemberId) {
                const profileResponse = await axios.get(
                    `${BASE_URL}/profiles?id=eq.${finalMemberId}&select=*`,
                    { headers: getHeaders() }
                );
                
                if (profileResponse.data && profileResponse.data.length > 0) {
                    const currentProfile = profileResponse.data[0];
                    const currentPoints = currentProfile.points || 0;
                    const pointsToAdd = Math.floor(totalAmount / 10000);
                    
                    if (pointsToAdd > 0) {
                        const newPoints = currentPoints + pointsToAdd;
                        let newTier = 'Bronze';
                        if (newPoints >= 500) {
                            newTier = 'Gold';
                        } else if (newPoints >= 100) {
                            newTier = 'Silver';
                        }
                        
                        await axios.patch(
                            `${BASE_URL}/profiles?id=eq.${finalMemberId}`,
                            {
                                points: newPoints,
                                tier: newTier
                            },
                            { headers: getHeaders() }
                        );
                    }
                }
            }
        } catch (profileErr) {
            console.error("Gagal memperbarui poin/tier:", profileErr.response?.data || profileErr.message);
        }

        return order;
    },

    /**
     * Update order status (admin action).
     */
    async updateOrderStatus(orderId, status) {
        const response = await axios.patch(
            `${BASE_URL}/orders?id=eq.${orderId}`,
            { status },
            {
                headers: {
                    ...getHeaders(),
                    Prefer: "return=representation"
                }
            }
        );
        return response.data[0];
    }
};
