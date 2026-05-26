import AxiosInstance from "./AxiosInstance";

const ProductService = {
    loadProducts: async (page: number, search: string) => {
        try {
            const response = await AxiosInstance.get(`/admin/products`, {
                params: { page, search }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.get(`/admin/products/${productId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    storeProduct: async (data: FormData) => {
        try {
            const response = await AxiosInstance.post(`/admin/products`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (productId: string | number, data: FormData) => {
        try {
            const response = await AxiosInstance.post(
                `/admin/products/${productId}`,
                data
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    toggleAvailable: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.patch(
                `/admin/products/${productId}/available`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    destroyProduct: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.delete(
                `/admin/products/${productId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default ProductService;