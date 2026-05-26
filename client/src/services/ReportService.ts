import AxiosInstance from "./AxiosInstance";

const ReportService = {
    downloadWeeklyReport: async (dateFrom?: string, dateTo?: string) => {
        const response = await AxiosInstance.get("/admin/reports/weekly", {
            params: { date_from: dateFrom, date_to: dateTo },
            responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "text/html" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `weekly-report-${dateFrom ?? "week"}.html`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
};

export default ReportService;
