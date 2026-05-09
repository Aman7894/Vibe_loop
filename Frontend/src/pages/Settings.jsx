import { UserProfile } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      {/* Close button */}
      <button 
        onClick={() => navigate(-1)}
        className="absolute top-5 right-5 z-[60] p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white transition-all duration-200 border border-white/10 shadow-lg hover:scale-105"
        title={t('Settings')}
      >
        <X size={22} />
      </button>

      <div className="w-full max-w-[880px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl no-scrollbar">
        <UserProfile 
          path="/settings" 
          routing="path"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "rounded-2xl shadow-none border-0",
              navbar: "rounded-l-2xl",
            }
          }}
        />
      </div>
    </div>
  );
}
