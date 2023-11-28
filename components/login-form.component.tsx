"use client";

import { UserLoginProps } from "@/types";
import { FieldValues, useForm } from "react-hook-form";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { reject } from "lodash";
import { useRouter } from "next/navigation";

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const { login, logout, isAuthenticated, user, setCustomerFromToken } = useAuth(); // Destructure the login function from the context
  const router = useRouter();
  const onSubmit = async (data: FieldValues) => {
    const loginData: UserLoginProps = {
      email: data.email,
      password: data.password
    };

    // console.log(loginData);

    login(loginData).then(res => {
      console.log(res);
    }).catch(err => (reject(err)))
  }

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/profile");
    }
  }, [isAuthenticated])

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <div className="md:w-1/2 max-w-lg mx-auto my-24 px-4 py-5 shadow-none">
        <div className="text-left p-0 font-sans">
          <h1 className=" text-white text-3xl font-semibold text-center font-poppins">Login to become member</h1>
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

          <div className="mt-5">
            <label form="password" className="text-white sc-bqyKva ePvcBv">Password</label>
            <input type="password" {...register("password", { required: "Please enter a password" })} className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent" placeholder="Password" />
          </div>

          <div className="mt-10">
            <input type="submit" value="Login" className="py-3 bg-green-500 text-white w-full rounded hover:bg-green-600" />
          </div>
        </form>
      </div>


    </div>
  )
}