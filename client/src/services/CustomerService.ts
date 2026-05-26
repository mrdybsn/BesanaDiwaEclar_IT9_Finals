import AxiosInstance from "./AxiosInstance";

const CustomerService = {
    loadCustomers: async (page: number, search: string) => {
        const response = await AxiosInstance.get("/admin/customers", {
            params: { page, search },
        });
        return response;
    },

    storeCustomer: async (data: Record<string, any>) => {
        const response = await AxiosInstance.post("/admin/customers", data);
        return response;
    },

    updateCustomer: async (customerId: number, data: Record<string, any>) => {
        const response = await AxiosInstance.put(
            `/admin/customers/${customerId}`,
            data
        );
        return response;
    },

    destroyCustomer: async (customerId: number) => {
        const response = await AxiosInstance.delete(
            `/admin/customers/${customerId}`
        );
        return response;
    },
};

export default CustomerService;