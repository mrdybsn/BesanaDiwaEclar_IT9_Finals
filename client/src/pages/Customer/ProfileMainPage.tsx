import { useEffect, useState } from "react";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";

const MOCK_PROFILE = {
    first_name:     "Maria",
    last_name:      "Santos",
    contact_number: "09171234567",
    address:        "Brgy. Baybay, Roxas City, Capiz",
    gps_lat:        11.5854,
    gps_lng:        122.7511,
};

const ProfileMainPage = () => {
    const [profile, setProfile]     = useState(MOCK_PROFILE);
    const [locating, setLocating]   = useState(false);
    const [saved, setSaved]         = useState(false);
    const [error, setError]         = useState<string | null>(null);

    useEffect(() => {
        document.title = "My Profile";
    }, []);

    const handleChange = (field: keyof typeof MOCK_PROFILE, value: string) => {
        setProfile((prev) => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handlePinLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation not supported by your browser.");
            return;
        }
        setLocating(true);
        setError(null);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setProfile((prev) => ({
                    ...prev,
                    gps_lat: pos.coords.latitude,
                    gps_lng: pos.coords.longitude,
                }));
                setLocating(false);
            },
            () => {
                setError("Could not get location. Please allow access and try again.");
                setLocating(false);
            }
        );
    };

    const handleSave = () => {
        // Wire to API later
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Customer
                </p>
                <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Manage your account details and delivery address.
                </p>
            </div>

            <div className="max-w-lg space-y-4">
                {/* Personal info */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <span className="text-2xl">👤</span>
                        <div>
                            <p className="text-base font-bold text-gray-800">Personal Info</p>
                            <p className="text-xs text-gray-400 mt-0.5">Your name and contact number</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <FloatingLabelInput
                                label="First Name"
                                type="text"
                                name="first_name"
                                value={profile.first_name}
                                onChange={(e) => handleChange("first_name", e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <FloatingLabelInput
                                label="Last Name"
                                type="text"
                                name="last_name"
                                value={profile.last_name}
                                onChange={(e) => handleChange("last_name", e.target.value)}
                                required
                            />
                        </div>
                        <div className="col-span-2">
                            <FloatingLabelInput
                                label="Contact Number"
                                type="tel"
                                name="contact_number"
                                value={profile.contact_number}
                                onChange={(e) => handleChange("contact_number", e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Delivery address */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <span className="text-2xl">📍</span>
                        <div>
                            <p className="text-base font-bold text-gray-800">Delivery Address</p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                Your default address pre-fills the order form
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <FloatingLabelInput
                            label="Full Address"
                            type="text"
                            name="address"
                            value={profile.address}
                            onChange={(e) => handleChange("address", e.target.value)}
                            required
                        />

                        {/* GPS pin */}
                        <button
                            type="button"
                            onClick={handlePinLocation}
                            disabled={locating}
                            className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-4 py-3 rounded-xl transition-colors disabled:opacity-60"
                        >
                            📡 {locating ? "Getting your location…" : "Pin My Location (GPS)"}
                        </button>

                        {profile.gps_lat !== 0 && profile.gps_lng !== 0 && (
                            <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
                                <span className="text-base">✅</span>
                                <p className="text-xs text-green-700 font-medium">
                                    GPS pinned: {profile.gps_lat.toFixed(5)}, {profile.gps_lng.toFixed(5)}
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                                <span className="text-base">⚠️</span>
                                <p className="text-xs text-red-600">{error}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Save feedback */}
                {saved && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                        <span>✅</span>
                        <p className="text-sm font-semibold text-green-700">
                            Profile saved successfully!
                        </p>
                    </div>
                )}

                {/* Save button */}
                <button
                    onClick={handleSave}
                    className="w-full py-3.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm font-bold transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </>
    );
};

export default ProfileMainPage;