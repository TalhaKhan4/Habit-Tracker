import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logIn } from "../features/userSlice.js";
import Loader from "../components/Loader.jsx";
import { useState } from "react";

const otpSchema = z.object({
  otp: z
    .string({ required_error: "Please enter a valid 6-digit OTP" })
    .trim()
    .regex(/^\d{6}$/, "Please enter a valid 6-digit OTP"),
});

function VerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(otpSchema),
  });

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/verify-email`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      );

      const result = await response.json();
      console.log(result);

      if (!result.success) {
        const backendErrors = result.errors;
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });

        return;
      }

      dispatch(
        logIn({
          fullName: result.data.fullName,
          email: result.data.email,
          memberSince: result.data.memberSince,
        }),
      );
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[100vh] flex flex-col justify-center  items-center">
      <h1 className="text-4xl font-bold text-[rgba(0,0,0,0.85)] text-center mb-3">
        Verify Your Email
      </h1>
      <p className="text-center text-gray-500 mb-6">
        We have sent an OTP to your email. Please enter it below.
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6">
          <input
            {...register("otp")}
            type="text"
            autoComplete="one-time-code"
            className="border-1 rounded-xl border-[#3c3c3c] outline-[#1818ad] focus:border-transparent py-[13px] px-3 placeholder:text-[17px] placeholder:text-gray-400 w-[300px] block"
            placeholder="Enter your otp"
          />

          {errors.otp && (
            <p className="text-red-600 ml-[8px] mt-[4px]">
              {errors.otp.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="border-1 rounded-xl py-[13px] hover:bg-black bg-[rgba(0,0,0,0.85)] text-white font-medium text-lg w-full cursor-pointer"
        >
          {isLoading ? <Loader /> : "Verify"}
        </button>
      </form>
    </main>
  );
}

export default VerifyEmail;
