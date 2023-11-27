import { UserRegisterRequestProps } from "@/types";
import { saveUser } from "@/utils/clients.utils";
import Image from "next/image";
import React, { Fragment, useEffect } from "react";
import { FieldValues, useForm } from "react-hook-form";
import _ from "lodash";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { useRouter } from "next/navigation";

interface DuoToken {
  accessToken: string;
  refreshToken: string;
}
export const RegisterForm = () => {
  const { login, logout, isAuthenticated, user, setCustomerFromToken } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data: FieldValues) => {
    const userData: UserRegisterRequestProps = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      role: data.role ? data.role : "user",
      gender: _.lowerCase(data.gender),
    };

    // console.log("User = ", userData)

    try {
      const response = await fetch(`http://localhost:8080/api/v1/auth/register`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
        method: "POST"
      });

      if (response.ok) {
        const responseData: DuoToken = await response.json();
        localStorage.setItem("accessToken", responseData.accessToken);

        router.refresh();
      } else {
        console.error("Registration failed:", response.status);
      }
    } catch (error) {
      console.error("Registration failed: ", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [isAuthenticated])

  return (
    <div className="flex justify-center items-center min-h-screen bg-spirit-lab">
      <div className="bg-no-repeat bg-cover max-w-max overflow-hidden md:ml-48">
        <Image src={"https://sepm-bucket.s3.eu-west-1.amazonaws.com/movie-lab.png"} width={500} height={900} alt="movie-lab"></Image>
        <Image src={"https://sepm-bucket.s3.eu-west-1.amazonaws.com/marker.png"} width={500} height={500} alt=""></Image>
      </div>

      <div className="md:w-1/2 max-w-lg mx-auto my-24 px-4 py-5 shadow-none">
        <div className="text-left p-0 font-sans">
          <h1 className=" text-white text-3xl font-semibold text-center font-poppins">Create an account</h1>
        </div>
        <form action="#" onSubmit={handleSubmit(onSubmit)} className="p-0">
          <div className="mt-5">
            <label form="firstName" className="text-white sc-bqyKva ePvcBv">First Name</label>
            <input {...register("firstName", { required: "Please enter a first name" })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="First name" />
          </div>
          <div className="mt-5">
            <label form="lastName" className="text-white sc-bqyKva ePvcBv">Last Name</label>
            <input {...register("lastName", { required: "Please enter a last name" })} type="text" className="md:mt-4 block w-full p-2 border rounded border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-transparent " placeholder="Last name" />
          </div>
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

          <div className="mt-5">
            <label form="countries" className="block mb-2 font-medium text-gray-900 dark:text-white">Gender</label>
            <select {...register("gender", { required: "Please enter a last name" })} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black outline-none">
              <option value="m" selected>Male</option>
              <option value="f">Female</option>
              <option value="o">Others</option>
            </select>
          </div>


          <div className="mt-10">
            <input type="submit" value="Sign up with email" className="py-3 bg-green-500 text-white w-full rounded hover:bg-green-600" />
          </div>
        </form>
        <a className="" href="#" data-test="Link"><span className="block  p-5 text-center text-white  text-sm ">Already have an account?</span></a>
      </div>


    </div>
  );
}