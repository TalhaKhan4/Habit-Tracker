import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader.jsx";
import { Link } from "react-router-dom";

const signUpSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

function SignUp() {
  const navigate = useNavigate();

  const [isPassVisible, setIsPassVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  });

  async function onSubmit(data) {
    try {
      setIsLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log(result);

      if (!result.success) {
        const backendErrors = result.errors;
        // Map backend errors to react-hook-form
        Object.entries(backendErrors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });

        return;
      }

      navigate("/verify-email");
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 200);
    }
  }

  return (
    <main className="flex min-h-[100vh]">
      <div className="w-[50%] flex flex-col justify-center py-5">
        <h1 className="text-center text-4xl  font-bold mb-3 text-[rgba(0,0,0,0.85)]">
          Create Your Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Welcome to Habit Tracker — Let's create an account
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-[300px] mx-auto">
          {/* Full Name */}
          <div className="flex flex-col mb-3">
            <label htmlFor="fullName" className="ml-1">
              Full Name
            </label>

            <input
              type="text"
              {...register("fullName")}
              className="border-1 rounded-xl border-[#3c3c3c] outline-[#1818ad] focus:border-transparent py-[13px] px-3 placeholder:text-[17px] placeholder:text-gray-400"
              placeholder="Enter your full name"
            />

            {errors.fullName && (
              <p className="text-red-600 ml-[8px] mt-[4px]">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col mb-3">
            <label htmlFor="email" className="ml-1">
              Email
            </label>

            <input
              type="text"
              {...register("email")}
              className={`border-1 rounded-xl border-[#3c3c3c] outline-[#1818ad] focus:border-transparent py-[13px] px-3 placeholder:text-[17px] placeholder:text-gray-400`}
              placeholder="Enter your email"
            />

            {errors.email && (
              <p className="text-red-600 ml-[8px] mt-[4px]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col mb-6">
            <label htmlFor="password" className="ml-1">
              Password
            </label>

            <div className="relative">
              <input
                type={isPassVisible ? "text" : "password"}
                {...register("password")}
                className="border-1 rounded-xl border-[#3c3c3c] outline-[#1818ad] focus:border-transparent py-[13px] px-3 placeholder:text-[17px] placeholder:text-gray-400 w-full"
                placeholder="Create a password"
              />
              <div
                onClick={() => {
                  setIsPassVisible(!isPassVisible);
                }}
                className="absolute top-[50%] translate-y-[-50%] right-[15px] text-xl cursor-pointer hover:bg-gray-200 p-1 rounded-md"
              >
                {isPassVisible ? <FiEyeOff /> : <FiEye />}
              </div>
            </div>

            {errors.password && (
              <p className="text-red-600 ml-[8px] mt-[4px]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="border-1 rounded-xl py-[13px] hover:bg-black bg-[rgba(0,0,0,0.85)] text-white font-medium text-lg w-full cursor-pointer"
          >
            {isLoading ? <Loader /> : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-lg">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Log In
          </Link>
        </div>
      </div>

      <div className="w-[50%] bg-[#0c0f0a] flex justify-center items-center">
        <p className="text-white text-6xl font-bold text-center px-8 font-lora leading-[70px]">
          We first make our habits, and then our habits make us
        </p>
      </div>
    </main>
  );
}

export default SignUp;
