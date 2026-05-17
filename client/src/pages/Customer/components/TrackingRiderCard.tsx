import { Phone, MapPin } from "lucide-react";
import type { RiderInfo } from "../OrderTrackingMainPage";

interface Props {
    rider: RiderInfo;
}

const TrackingRiderCard = ({ rider }: Props) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                Your Rider
            </p>

            {/* Rider info row */}
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl shrink-0">
                    🚴
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800">{rider.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{rider.contact_number}</p>
                </div>
                <a
                    href={`tel:${rider.contact_number}`}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                </a>
            </div>

            {/* Map placeholder — wire react-leaflet here */}
            <div className="rounded-xl bg-sky-50 border border-sky-100 h-40 flex flex-col items-center justify-center gap-2 text-sky-500">
                <MapPin className="w-7 h-7" />
                <p className="text-xs font-semibold">Live Map</p>
                <p className="text-xs text-sky-400">
                    {rider.gps_lat.toFixed(4)}, {rider.gps_lng.toFixed(4)}
                </p>
                <p className="text-xs text-sky-300">
                    Mount {"<MapContainer>"} from react-leaflet here
                </p>
            </div>
        </div>
    );
};

export default TrackingRiderCard;