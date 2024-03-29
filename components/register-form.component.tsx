import { UserRegisterRequestProps } from "@/types";
import { registerNewUser, saveUser } from "@/utils/clients.utils";
import Image from "next/image";
import React, { Fragment, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import _, { reject } from "lodash";
import axios, { AxiosResponse } from "axios";
import { useAuth } from "./context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import Link from "next/link";

interface DuoToken {
  accessToken: string;
  refreshToken: string;
}
export const RegisterForm = () => {
  const { login, logout, isAuthenticated, user, setCustomerFromToken } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm();

  const formErrors = errors as any;

  const onSubmit = async (data: FieldValues) => {
    setError("username", { type: "", message: "" });
    setError("firstName", { type: "", message: "" });
    setError("lastName", { type: "", message: "" });
    setError("email", { type: "", message: "" });
    setError("password", { type: "", message: "" });
    setError("gender", { type: "", message: "" });


    const userData: UserRegisterRequestProps = {
      username: data.username,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: "user",
      gender: _.lowerCase(data.gender),
    };

    console.log("User = ", userData)
    saveUser(userData);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/profile")
    }
  }, [isAuthenticated])

  useEffect(() => {
    gsap.set(document.querySelector(".house-model-key"), {
      scale: 0.8,
    })

    gsap.to(document.querySelector(".house-model-key"), {
      scale: 1,
      duration: 1,
      yoyo: true,
      repeat: -1
    })
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-no-repeat bg-cover max-w-max overflow-hidden md:ml-48">
        {/* <Image src={"https://sepm-bucket.s3.eu-west-1.amazonaws.com/movie-lab.png"} width={500} height={900} alt="movie-lab"></Image>
        <Image src={"https://sepm-bucket.s3.eu-west-1.amazonaws.com/marker.png"} width={500} height={500} alt=""></Image> */}
        <Image src={"/assets/House.png"} className="house-model-key" width={500} height={500} alt=""></Image>
      </div>

      <div className="md:w-1/2 max-w-lg mx-auto my-24 px-4 py-5 shadow-none">
        <div className="text-left p-0 font-sans">
          <h1 className=" text-white text-3xl font-bold text-left">Create an account</h1>
        </div>
        <form action="#" onSubmit={handleSubmit(onSubmit)} className="p-0">

          {formErrors.register && (
            <div className="text-red-500 text-sm mt-2">{formErrors.register.message}</div>

          )}
          <div className="mt-5">
            <label form="username" className="text-white text-sm sc-bqyKva ePvcBv">Username</label>
            <input {...register("username", { required: "Please enter a username" })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="Username" />
          </div>

          {formErrors.username && (
            <div className="text-red-500 text-sm mt-2">{formErrors.username.message}</div>

          )}
          <div className="mt-5">
            <label form="firstName" className="text-white text-sm sc-bqyKva ePvcBv">First Name</label>
            <input {...register("firstName", { required: "Please enter a first name" })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="First name" />
          </div>

          {formErrors.firstName && (
            <div className="text-red-500 text-sm mt-2">{formErrors.firstName.message}</div>

          )}
          <div className="mt-5">
            <label form="lastName" className="text-white text-sm sc-bqyKva ePvcBv">Last Name</label>
            <input {...register("lastName", { required: "Please enter a last name" })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="Last name" />
          </div>

          {formErrors.lastName && (
            <div className="text-red-500 text-sm mt-2">{formErrors.lastName.message}</div>

          )}
          <div className="mt-5">
            <label form="email" className="text-white text-sm sc-bqyKva ePvcBv">Email</label>
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
            <div className="text-red-500 text-sm mt-2">{formErrors.email.message}</div>

          )}
          <div className="mt-5">
            <label form="password" className="text-white text-sm sc-bqyKva ePvcBv">Password</label>
            <input type="password" {...register("password", { required: "Please enter a password" })} className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent" placeholder="Password" />
          </div>

          {formErrors.password && (
            <div className="text-red-500 text-sm mt-2">{formErrors.password.message}</div>

          )}
          <div className="mt-5">
            <label form="countries" className="block mb-2 font-medium text-gray-900 text-sm dark:text-white">Gender</label>
            <select {...register("gender", { required: "Please enter a last name" })} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black outline-none">
              <option value="m" selected>Male</option>
              <option value="f">Female</option>
              <option value="o">Others</option>
            </select>
          </div>

          <div className="mt-10">
            <input type="submit" value="Sign up with email" className="py-3 bg-dark-green text-white w-full rounded-lg cursor-pointer hover:opacity-80" />
          </div>
        </form>
        <Link className="hover:opacity-60" href="/login" data-test="Link"><span className="block  p-5 text-center text-cyan-400 font-regular text-sm">Already have an account?</span></Link>
      </div>


    </div>
  );
}