"use client";

import { UserLoginProps } from "@/types";
import { FieldValues, useForm } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { reject } from "lodash";
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface LoginError {
  email: {
    message: ""
  },
  password: {
    message: ""
  }
}
export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm();
  const { login, logout, isAuthenticated, user, setCustomerFromToken } = useAuth(); // Destructure the login function from the context
  const [loginError, setLoginError] = useState("");
  const [showLoginError, setShowLoginError] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: FieldValues) => {

    setError("email", { type: "", message: "" });
    setError("password", { type: "", message: "" });

    const loginData: UserLoginProps = {
      email: data.email,
      password: data.password,
    };

    try {
      // Attempt to login
      const res = await login(loginData);
      console.log(res);

      // Redirect on successful login
      if (isAuthenticated()) {
        router.push("/home");
      }
    } catch (err) {
      // Display error message
      console.error(err);

      // Set error messages based on your error response
      setError("email", { type: "manual", message: "" });
      setError("password", { type: "manual", message: "" });
      // setError("login", {
      //   type: "manual",
      //   message: "Incorrect email or password",
      // });
      setLoginError("Incorrect email or password");
      setShowLoginError(true);

      // Set a timer to hide the message after 5 seconds
      setTimeout(() => setShowLoginError(false), 3000);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/home");
    }
  }, [isAuthenticated])

  const formErrors = errors as any;

  return (
    <div className="flex justify-center items-center min-h-screen relative">
      <div className="md:w-1/2 max-w-lg mx-auto my-24 px-4 py-5 shadow-none">
        <div className="text-left p-0">
          <h1 className=" text-white text-3xl font-semibold text-center">Login to become members</h1>
        </div>
        <form action="#" onSubmit={handleSubmit(onSubmit)} className="p-0">
          <div className="mt-5">
            <label form="email" className="text-white sc-bqyKva ePvcBv">Email</label>
            <input {...register("email",
              {
                required: "Please enter your email",
                pattern: {
                  value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                  message: "Please enter a valid email"
                }
              })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="Email" />
          </div>
          {formErrors.email && (
            <div className="text-status-error text-sm mt-2">{formErrors.email.message}</div>
          )}

          <div className="mt-5">
            <label form="password" className="text-white sc-bqyKva ePvcBv">Password</label>
            <input type="password" {...register("password", { required: "Please enter a password" })} className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent" placeholder="Password" />
          </div>
          {formErrors.password && (
            <div className="text-status-error text-sm mt-2">{formErrors.password.message}</div>
          )}


          {showLoginError && (
            <div className="text-status-error text-sm mt-2 fade-out md:px-[2px] rounded-full md:py-[8px] bg-status-error md:pl-4 flex flex-row justify-start">
              <Image src={"/assets/icons/error.png"} width={20} height={15} alt=""></Image><div className="md:ml-2">{loginError}</div>
            </div>
          )}

          <div className="mt-10">
            <input
              type="submit"
              value="Login"
              className="py-3 bg-green-500 text-white w-full rounded hover:bg-green-600"
            />
          </div>

          <div className="mt-10">
            <Link
              href={"/register"}
              className="text-white font-semibold text-sm hover:opacity-60 hover:text-blue-600 transition"
            >
              Don't have an account
            </Link>
          </div>
        </form>
      </div>


    </div>
  )
}