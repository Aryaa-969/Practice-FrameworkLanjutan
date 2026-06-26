import axios from 'axios';

const API_URL = "https://mpvdhgqrlccmkxqtkgyh.supabase.co/rest/v1/products";
const API_KEY = "sb_publishable_5mfsaaV1N9OJidZW00kpNA_bonlSSdx";

const getHeaders = () => {
    const token = localStorage.getItem("supabase_token");
    return {
        apikey: API_KEY,
        Authorization: `Bearer ${token || API_KEY}`,
        "Content-Type": "application/json",
    };
};

export const productService = {
    mapProduct(dbProduct) {
        if (!dbProduct) return null;
        
        let descriptionText = dbProduct.description || "";
        let category = "Electronics";
        let brand = "-";

        try {
            const parsed = JSON.parse(dbProduct.description);
            if (parsed && typeof parsed === 'object') {
                descriptionText = parsed.description || "";
                category = parsed.category || "Electronics";
                brand = parsed.brand || "-";
            }
        } catch (e) {
            // Not a JSON string, keep standard values
        }

        return {
            id: dbProduct.id,
            title: dbProduct.name,
            code: dbProduct.code || `PRD-${String(dbProduct.id).padStart(3, '0')}`,
            category: category,
            brand: brand,
            price: dbProduct.price,
            stock: dbProduct.stock,
            image_url: dbProduct.image_url,
            description: descriptionText
        };
    },

    async fetchProducts() {
        const response = await axios.get(`${API_URL}?select=*&order=id.asc`, { headers: getHeaders() });
        return response.data.map(p => this.mapProduct(p));
    },

    async fetchProductById(id) {
        const response = await axios.get(`${API_URL}?id=eq.${id}&select=*`, { headers: getHeaders() });
        if (response.data && response.data.length > 0) {
            return this.mapProduct(response.data[0]);
        }
        throw new Error("Product not found");
    },

    async createProduct(productData) {
        const descData = {
            description: productData.description || "",
            category: productData.category || "Electronics",
            brand: productData.brand || ""
        };

        const response = await axios.post(
            API_URL,
            {
                name: productData.title,
                description: JSON.stringify(descData),
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock, 10),
                image_url: productData.image_url || null
            },
            {
                headers: {
                    ...getHeaders(),
                    Prefer: "return=representation"
                }
            }
        );
        return this.mapProduct(response.data[0]);
    },

    async updateProduct(id, productData) {
        const descData = {
            description: productData.description || "",
            category: productData.category || "Electronics",
            brand: productData.brand || ""
        };

        const response = await axios.patch(
            `${API_URL}?id=eq.${id}`,
            {
                name: productData.title,
                description: JSON.stringify(descData),
                price: parseFloat(productData.price),
                stock: parseInt(productData.stock, 10),
                image_url: productData.image_url || null
            },
            {
                headers: {
                    ...getHeaders(),
                    Prefer: "return=representation"
                }
            }
        );
        return this.mapProduct(response.data[0]);
    },

    async deleteProduct(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers: getHeaders() });
        return true;
    }
};
