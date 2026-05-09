import { SignIn, useUser } from "@clerk/clerk-react";
import { Heart, MessageCircle, Sparkles, Smile } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";
import Logo from "../components/ui/Logo";


export default function Login() {
  const { t } = useTranslation();
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background ambient light */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
        
        {/* Left Column: Branding & Collage */}
        <div className="hidden lg:flex flex-col justify-center">
          <Logo size="xl" className="mb-6" />
          
          <h2 className="text-4xl xl:text-5xl font-bold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
            {t('Discover the things you love.')}
          </h2>
          <p className="mt-5 text-xl text-slate-600 dark:text-slate-400 max-w-lg leading-relaxed">
            {t("Connect with friends, share your universe, and explore what's happening around the world right now.")}
          </p>

          {/* Floating Image Collage (Mimicking the Meta Login Screen) */}
          <div className="relative w-full h-[450px] mt-12">
            
            {/* Main Center Image */}
            <div className="absolute top-10 left-16 w-64 h-80 rounded-3xl overflow-hidden shadow-2xl z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-500 border-[6px] border-white dark:border-neutral-800">
              <img 
                src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=600&auto=format&fit=crop" 
                alt="Skateboarding" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Top Left Smaller Card */}
            <div className="absolute top-0 left-0 w-40 h-40 rounded-3xl overflow-hidden shadow-xl z-0 transform -rotate-12 border-[4px] border-white dark:border-neutral-800 opacity-90">
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400&auto=format&fit=crop" 
                alt="Abstract Art" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Right Avatar Card */}
            <div className="absolute bottom-4 left-60 w-32 h-32 rounded-full overflow-hidden shadow-2xl z-20 border-[4px] border-blue-500">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" 
                alt="Smiling Profile" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Floating Emojis / Icons */}
            <div className="absolute top-20 right-28 bg-white dark:bg-neutral-800 p-3 rounded-full shadow-xl z-20 text-rose-500 animate-bounce" style={{ animationDuration: '3s' }}>
              <Heart className="w-8 h-8 fill-rose-500" />
            </div>
            
            <div className="absolute top-[-10px] left-32 bg-yellow-400 p-2 rounded-full shadow-lg z-20 text-white animate-pulse" style={{ animationDuration: '4s' }}>
              <Smile className="w-10 h-10 text-yellow-900" />
            </div>

            <div className="absolute bottom-16 left-6 bg-blue-500 p-3 rounded-2xl shadow-lg z-20 text-white rounded-bl-sm">
              <MessageCircle className="w-7 h-7 fill-white" />
            </div>

          </div>
        </div>

        {/* Right Column: Clerk Form */}
        <div className="flex flex-col justify-center items-center lg:items-end w-full">
          {/* Mobile Branding (Visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center text-center mb-10 w-full">
            <Logo size="lg" className="mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t('Discover the things you love.')}
            </h2>
          </div>

          {/* The Form Container */}
          <div className="w-full max-w-[420px]">
            {/* We apply a subtle wrapper to make it feel more integrated if we want, but Clerk's SignIn already has a card look. */}
            <div className="shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-1 bg-white dark:bg-[#111112]">
              <SignIn 
                routing="path"
                path="/login" 
                signUpUrl="/signup"
                fallbackRedirectUrl="/home"
                appearance={{
                  elements: {
                    rootBox: "w-full mx-auto",
                    card: "shadow-none border-0 box-shadow-none",
                    headerTitle: "text-2xl font-bold text-slate-900 dark:text-white hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md text-md py-3",
                    formFieldInput: "bg-gray-50 dark:bg-neutral-800 border-gray-200 dark:border-neutral-700 rounded-lg py-3 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500",
                    footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
                    dividerLine: "bg-gray-200 dark:bg-neutral-800",
                    dividerText: "text-gray-500 dark:text-neutral-400"
                  }
                }}
              />
            </div>
            
            {/* Meta-style bottom link */}
            <div className="mt-8 text-center">
               <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                 <span className="font-bold">{t('Create a Page')}</span> {t('for a celebrity, brand or business.')}
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
