import React, { useState } from "react";
import { PhoneInput } from "./PhoneInput";
import { OtpInput } from "./OtpInput";
import { MessageCircle } from "lucide-react";

export const AuthPage: React.FC = () => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneData, setPhoneData] = useState({ phone: "", countryCode: "" });
  const [otp, setOtp] = useState<string | null>(null); // <-- Add this

  const handleOtpSent = (
    phone: string,
    countryCode: string,
    otpValue: string
  ) => {
    setPhoneData({ phone, countryCode });
    setOtp(otpValue); // <-- Store OTP
    setStep("otp");
  };

  const handleVerified = () => {
    window.location.reload();
  };

  const handleResend = () => {
    setStep("phone");
    setOtp(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8 relative">
      {/* OTP Pop-up (show only on OTP page) */}
      {step === "otp" && otp && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded shadow-lg text-sm font-mono">
          OTP: <span className="font-bold">{otp}</span>
        </div>
      )}

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <MessageCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Gemini Chat
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to start chatting with AI
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 py-6 px-4 sm:py-8 sm:px-6 shadow-lg rounded-lg">
          {step === "phone" ? (
            <PhoneInput onOtpSent={handleOtpSent} />
          ) : (
            <OtpInput
              phone={phoneData.phone}
              countryCode={phoneData.countryCode}
              onVerified={handleVerified}
              onResend={handleResend}
            />
          )}
        </div>
      </div>
    </div>
  );
};
