import AxiosInstance from "./AxiosInstance";

const AnalyticsService = {
    loadDashboard: async () => {
        const response = await AxiosInstance.get("/admin/analytics/dashboard");
        return response.data;
    },

    loadRevenue: async (period: "weekly" | "monthly" | "yearly" = "weekly") => {
        const response = await AxiosInstance.get("/admin/analytics/revenue", { params: { period } });
        return response.data;
    },

    loadDailySummary: async () => {
        const response = await AxiosInstance.get("/admin/analytics/daily-summary");
        return response.data;
    },
};

export default AnalyticsService;
