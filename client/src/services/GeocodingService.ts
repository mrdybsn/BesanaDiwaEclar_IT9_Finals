import AxiosInstance from "./AxiosInstance";

export interface GeocodeResult {
    lat: number;
    lng: number;
    display_name: string;
}

const GeocodingService = {
    geocodeAddress: async (address: string): Promise<GeocodeResult> => {
        const response = await AxiosInstance.post<GeocodeResult>("/admin/geocode", { address });
        return response.data;
    },
};

export default GeocodingService;
