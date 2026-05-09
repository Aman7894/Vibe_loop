import { SignUp, useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Logo from "../components/ui/Logo";


export default function Signup() {
  const { isSignedIn, isLoaded } = useUser();

  if (isLoaded && isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-4">
      <Logo size="lg" className="mb-8" />
      <div className="w-full max-w-[420px] shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] rounded-2xl p-1 bg-white dark:bg-[#111112]">
        <SignUp 
          routing="path" 
          path="/signup" 
          signInUrl="/login" 
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
    </div>
  );
}
