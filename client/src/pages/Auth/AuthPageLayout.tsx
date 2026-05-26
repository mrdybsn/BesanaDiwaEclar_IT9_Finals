import type { FC, ReactNode } from "react";
import CompanyLogo from "../../assets/soldiers thirst.png";
import LoginHeroImage from "../../assets/loginheroimage.png";

interface AuthPageLayoutProps {
    children: ReactNode;
}

/** Matches the hero PNG background so the image blends into the panel */
const HERO_BG = "#5352ED";

const AuthPageLayout: FC<AuthPageLayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-row">
            <div className="flex flex-col justify-center items-center w-full lg:w-1/2 bg-white">
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
                    <div className="flex flex-col items-center mb-6">
                        <img src={CompanyLogo} alt="Soldier's Thirst" className="h-20 mb-3 object-contain" />
                        <h2 className="text-2xl font-bold text-gray-800">Sign in to your account</h2>
                        <p className="text-sm text-gray-400 mt-1">Soldier&apos;s Thirst — Admin &amp; Rider Portal</p>
                    </div>
                    {children}
                </div>
            </div>

            <div
                className="hidden lg:flex w-1/2 h-screen relative items-center justify-center overflow-hidden"
                style={{
                    backgroundColor: HERO_BG,
                    backgroundImage: `linear-gradient(145deg, #4B49E1 0%, ${HERO_BG} 45%, #6B68F0 100%)`,
                }}
            >
                <div className="relative max-w-[min(100%,42rem)] max-h-[min(92vh,42rem)]">
                    <img
                        src={LoginHeroImage}
                        alt="Soldier's Thirst delivery management"
                        className="block w-full h-full object-contain"
                    />
                    {/* Covers Gemini watermark in bottom-right of the asset */}
                    <div
                        className="absolute bottom-3 right-3 w-12 h-12 pointer-events-none"
                        style={{ backgroundColor: HERO_BG }}
                        aria-hidden
                    />
                </div>
            </div>
        </div>
    );
};

export default AuthPageLayout;
