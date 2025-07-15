import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { otpSchema, type OtpFormData } from "../../schemas/authSchema";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../ui/Button";
import { generateId } from "../../utils/helpers";
import toast from "react-hot-toast";

interface OtpInputProps {
  phone: string;
  countryCode: string;
  onVerified: () => void;
  onResend: () => void;
}

export const OtpInput: React.FC<OtpInputProps> = ({
  phone,
  countryCode,
  onVerified,
  onResend,
}) => {
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { isLoading, setLoading, setUser } = useAuthStore();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
  });

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    const otpString = newOtpValues.join("");
    setValue("otp", otpString);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: OtpFormData) => {
    try {
      setLoading(true);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const storedOtp = localStorage.getItem("currentOTP");
      const otpExpiry = localStorage.getItem("otpExpiry");

      if (!storedOtp || !otpExpiry || Date.now() > parseInt(otpExpiry)) {
        toast.error("OTP has expired. Please request a new one.");
        return;
      }

      if (data.otp !== storedOtp) {
        toast.error("Invalid OTP. Please try again.");
        return;
      }

      // Create user
      const user = {
        id: generateId(),
        phone,
        countryCode,
        isAuthenticated: true,
      };

      setUser(user);
      localStorage.removeItem("currentOTP");
      localStorage.removeItem("otpExpiry");

      toast.success("Login successful!");
      onVerified();
    } catch (error) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setTimeLeft(300);
    onResend();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Enter OTP
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          We've sent a 6-digit code to {countryCode}
          {phone}
        </p>
      </div>

      <div className="flex justify-center space-x-3">
        {otpValues.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            maxLength={1}
            value={value}
            onChange={(e) => handleOtpChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-12 h-12 text-center text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        ))}
      </div>

      {errors.otp && (
        <p className="text-sm text-red-600 dark:text-red-400 text-center">
          {errors.otp.message}
        </p>
      )}

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Time remaining:{" "}
          <span className="font-semibold">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <Button
        type="submit"
        loading={isLoading}
        fullWidth
        disabled={otpValues.join("").length !== 6}
      >
        Verify OTP
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResend}
          disabled={timeLeft > 0}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Resend OTP
        </button>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Check Console for the OTP ******
          </p>
        </div>
      </div>
    </form>
  );
};
