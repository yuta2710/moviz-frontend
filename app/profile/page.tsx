"use client";

import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentReviewsFromLetterboxdServer, getMe } from "@/utils/clients.utils";
import { User } from "@/types";
import letterboxd from "letterboxd-api";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import MovieList from "@/components/movies-list.component";

export default function Page() {
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(1);
  const [isEditingFirstname, setIsEditingFirstname] = useState(false);
  const [isEditingLastname, setIsEditingLastname] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated() && user !== null) {
      const fetchData = async () => {
        try {
          const json = await getMe();
          setCustomer(json.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
      router.push("/login")
    }
  }, [isAuthenticated]);

  const handleAvatarClick = () => {
    // Trigger click on the hidden file input
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  };
  const isFileValidType = (file: File) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    return allowedTypes.includes(file.type);
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    console.log(file);
    console.log("token token " + localStorage.getItem("accessToken"));
    if (file && isFileValidType(file)) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.patch(`http://localhost:8080/api/v1/users/${customer?._id}/photo`, formData, {
          headers: {
            authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            'Content-Type': 'multipart/form-data',
          },

        });
        const json = response.data;
        console.log(json);
        console.log(formData);
        window.location.reload();

      } catch (error) {
        console.error('Error updating profile picture:', error);
      }
    } else {
      alert("Invalid file type!");
    }

  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Retrieve updated values from the form fields
    const updatedFirstName = (document.getElementById('fname') as HTMLInputElement)?.value;
    const updatedLastName = (document.getElementById('lname') as HTMLInputElement)?.value;
    const updatedEmail = (document.getElementById('email') as HTMLInputElement)?.value;
    // Repeat similar steps for lastname and email

    const data = {
      firstName: updatedFirstName || customer?.firstName,
      lastName: updatedLastName || customer?.lastName,
      email: updatedEmail || customer?.email,
    };

    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/users/${customer?._id}/update-profile`, JSON.stringify(data), {
        headers: {
          authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          'Content-Type': 'application/json',
        },
      });

      const json = response.data;
      console.log(json);
      console.log(data);

      // Assuming a successful update, you might want to update the local state here
      window.location.reload();
      setIsEditingFirstname(false); // Assuming this should be set to false after a successful update
    } catch (error) {
      console.error('Error updating profile information:', error);
    }
  };


  let html: ReactElement<any, any> = <></>;
  if (loading) {
    html = <div className="text-white text-center font-bold text-4xl absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] m-0">Loading <CircularProgress color="secondary" /></div>;
  }

  if (customer !== null) {
    html = (

      <div className="flex flex-col justify-center  relative md:top-[10rem] w-3/5 mx-auto text-white">
        <div className="flex flex-row">
          {/* <div className="blob relative"></div> */}
          <div className="blob-linear-green-blue relative"></div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <div className="">
            <Image
              className="text-white text-center rounded-full md:mr-36 hover:cursor-pointer"
              width={250}
              height={250}
              alt="Customer Photo"
              src={customer.photo}
              onClick={handleAvatarClick}
            />
            <input className="hidden" type="file" id="fileInput" name="fileInput" onChange={handleFileChange}></input>
          </div>
          <div className="grid col-span-2 grid-rows-4 gap-5 w2/3">
            <div className="col-span-4 justify-center items-center text-3xl font-medium my-auto">
              <h1 className="text-white text-center md:text-left ">
                {customer.username}
              </h1>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col mr-5">
                <h3 className="mb-3">First Name</h3>
                {!isEditingFirstname &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {customer.firstName}
                    <p className={`${isEditingEmail || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingFirstname(true))}>Edit</p>
                  </div>)}
                {isEditingFirstname &&
                  (<form className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="text-sm border-none bg-transparent w-auto" id="fname" placeholder={`${customer.firstName}`}></input>
                    <div className="flex gap-3">
                      <button className="text-sm text-gray-500" type="submit" >Save</button>
                      <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingFirstname(false)}>Cancel</button>
                    </div>
                  </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col">
                <h3 className="mb-3">Last Name</h3>
                {!isEditingLastname &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {customer.lastName}
                    <p className={`${isEditingEmail || isEditingFirstname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingLastname(true))}>Edit</p>
                  </div>)}
                {isEditingLastname &&
                  (<form className="flex flex-row py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="border-none bg-transparent w-auto text-sm" id="lname" placeholder={`${customer.lastName}`}></input>
                    <div className="flex gap-3">
                      <button className="text-sm text-gray-500" type="submit">Save</button>
                      <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingLastname(false)}>Cancel</button>
                    </div>
                  </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col mr-5">
                <h3 className="mb-3">Email</h3>
                {!isEditingEmail &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {customer.email}
                    <p className={`${isEditingFirstname || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingEmail(true))}>Edit</p>
                  </div>)}
                {isEditingEmail &&
                  (<form className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="border-none bg-transparent w-auto text-sm" id="email" placeholder={`${customer.email}`}></input>
                    <div className="flex gap-3">
                      <button className="text-sm text-gray-500" type="submit">Save</button>
                      <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                    </div>
                  </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col">
                <h3 className="mb-3 text-gray-500 underline">Review Tags</h3>
                <div className="grid grid-cols-5 gap-2">
                  {customer.reviews.map((review, index) => review.tag && (
                    <button className=" bg-cyan-700 rounded-lg">
                      {review.tag}
                    </button>
                  ))}
                  {/* <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-10 items-start">
          <h1 className={`${selected == 1 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(1)}>Reviews</h1>
          <h1 className={`${selected == 2 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(2)}>Watchlist</h1>
          <h1 className={`${selected == 3 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(3)}>Like</h1>
        </div>
        {selected == 1 && (
          <div>

          </div>
        )}
        {selected == 2 && (
          <div>
            <MovieList ids={customer.watchLists} />
          </div>
        )}
        {selected == 3 && (
          <div>

          </div>
        )}
      </div>

    );
  }

  return html;
}


