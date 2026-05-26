import AxiosInstance from "./AxiosInstance";

const UserService = {
    loadUsers: async (page: number, search: string, role?: string) => {
        try {
            const response = await AxiosInstance.get(`/admin/users`, {
                params: { page, search, role: role ?? "rider" }
            });
            return response;
        } catch (error) {
            throw error;
        }
    },

    loadRiders: async () => {
        try {
            const response = await AxiosInstance.get(`/admin/riders`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    storeUser: async (data: FormData) => {
        try {
            const response = await AxiosInstance.post(`/admin/users`, data);
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateUser: async (userId: string | number, data: FormData) => {
        try {
            const response = await AxiosInstance.post(
                `/admin/users/${userId}`,
                data
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    updateStatus: async (userId: string | number) => {
        try {
            const response = await AxiosInstance.patch(
                `/admin/users/${userId}/status`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },

    destroyUser: async (userId: string | number) => {
        try {
            const response = await AxiosInstance.delete(
                `/admin/users/${userId}`
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default UserService;