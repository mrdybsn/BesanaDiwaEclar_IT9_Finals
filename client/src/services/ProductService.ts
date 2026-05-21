import AxiosInstance from "./AxiosInstance";

const ProductService = {
    loadProducts: async (page: number, search: string) => {
        try {
            const response = await AxiosInstance.get(
                search
                    ? `/product/loadProducts?page=${page}&search=${search}`
                    : `/product/loadProducts?page=${page}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    getProduct: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.get(`/product/getProduct/${productId}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    storeProduct: async (data: FormData) => {
        try {
            const response = await AxiosInstance.post(`/product/storeProduct`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateProduct: async (productId: string | number, data: FormData) => {
        try {
            const response = await AxiosInstance.post(
                `/product/updateProduct/${productId}`,
                data
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    toggleAvailable: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.put(
                `/product/toggleAvailable/${productId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    destroyProduct: async (productId: string | number) => {
        try {
            const response = await AxiosInstance.put(
                `/product/destroyProduct/${productId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default ProductService;