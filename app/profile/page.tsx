"use client";

import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentReviewsFromLetterboxdServer, getMe, getMovie } from "@/utils/clients.utils";
import { FilmReviewProps, User } from "@/types";
import letterboxd from "letterboxd-api";
import axios from "axios";
import { CircularProgress, Pagination } from "@mui/material";
import MovieList from "@/components/movies-list.component";
import ReviewList from "@/components/review-list.component";

export default function Page() {
  const { user, isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(1);
  const [isEditingFirstname, setIsEditingFirstname] = useState(false);
  const [isEditingLastname, setIsEditingLastname] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

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
        const response = await axios.patch(`http://localhost:8080/api/v1/users/${currentUser?._id}/photo`, formData, {
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
      firstName: updatedFirstName || currentUser?.firstName,
      lastName: updatedLastName || currentUser?.lastName,
      email: updatedEmail || currentUser?.email,
    };

    try {
      const response = await axios.patch(`http://localhost:8080/api/v1/users/${currentUser?._id}/update-profile`, JSON.stringify(data), {
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

  if (currentUser !== null) {
    html = (

      <div className="flex flex-col justify-center relative md:top-[10rem] w-3/5 mx-auto text-white">
        <div className="flex flex-row">
          {/* <div className="blob relative"></div> */}
          <div className="blob-linear-green-blue relative"></div>
        </div>
        <div className="grid grid-cols-3 items-center">
          <div className="col-span-3 md:col-span-1">
            <Image
              className="text-white text-center rounded-full md:mr-36 hover:cursor-pointer"
              width={250}
              height={250}
              alt="currentUser Photo"
              src={currentUser.photo}
              onClick={handleAvatarClick}
            />
            <input className="hidden" type="file" id="fileInput" name="fileInput" onChange={handleFileChange}></input>
          </div>
          <div className="grid md:col-span-2 grid-cols-4 gap-5 w2/3 col-span-3">
            <div className="col-span-4 justify-center items-center text-3xl font-medium my-auto">
              <h1 className="text-white text-center md:text-left">
                {currentUser.username}
              </h1>
              {/* <button  className="text-sm text-white bg-dark-green p-2 rounded-lg hover:scale-105 duration-500">Access to social media profile</button> */}
            </div>
            <div className="col-span-2 justify-center items-center col-span-4">
              <div className="flex flex-col mr-5">
                <h3 className="mb-3">First Name</h3>
                {!isEditingFirstname &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {currentUser.firstName}
                    <p className={`${isEditingEmail || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingFirstname(true))}>Edit</p>
                  </div>)}
                {isEditingFirstname &&
                  (<form className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="text-sm border-none bg-transparent w-auto" id="fname" placeholder={`${currentUser.firstName}`}></input>
                    <div className="flex gap-3">
                      <button className="text-sm text-gray-500" type="submit" >Save</button>
                      <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingFirstname(false)}>Cancel</button>
                    </div>
                  </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center col-span-4">
              <div className="flex flex-col">
                <h3 className="mb-3">Last Name</h3>
                {!isEditingLastname &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {currentUser.lastName}
                    <p className={`${isEditingEmail || isEditingFirstname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingLastname(true))}>Edit</p>
                  </div>)}
                {isEditingLastname &&
                  (<form className="flex flex-row py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="border-none bg-transparent w-auto text-sm" id="lname" placeholder={`${currentUser.lastName}`}></input>
                    <div className="flex gap-3">
                      <button className="text-sm text-gray-500" type="submit">Save</button>
                      <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingLastname(false)}>Cancel</button>
                    </div>
                  </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center col-span-4">
              <div className="flex flex-col mr-5">
                <h3 className="mb-3">Email</h3>
                {!isEditingEmail &&
                  (<div className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between text-sm">
                    {currentUser.email}
                    <p className={`${isEditingFirstname || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingEmail(true))}>Edit</p>
                  </div>)}
                {isEditingEmail &&
                  (<form className="flex flex-row apple-linear-glass px-4 rounded-xl py-2 justify-between" onSubmit={handleSubmit}>
                    <input type="text" className="border-none bg-transparent w-auto text-sm" id="email" placeholder={`${currentUser.email}`}></input>
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
                  {currentUser.reviews.map((review, index) => review.tag && (
                    <button className=" bg-cyan-700 rounded-lg">
                      {review.tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-10 items-start col-span-3">
          <h1 className={`${selected == 1 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(1)}>Reviews</h1>
          <h1 className={`${selected == 2 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(2)}>Watchlist</h1>
          <h1 className={`${selected == 3 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(3)}>Like</h1>
        </div>
        {selected == 1 && (
          <div>

            <ReviewList reviews={currentUser.reviews} currentPage={currentPage} itemsPerPage={reviewsPerPage} />
            {currentUser.reviews.length > 0
              && <>
                <div className="items-center justify-center">
                  {/* <Pagination
                    count={Math.ceil(currentUser.reviews.length / reviewsPerPage)}
                    // variant="outlined"
                    color="secondary"
                    size="large"
                    page={currentPage}
                    onChange={(event, page) => handlePageChange(page)}

                  /> */}
                </div>
              </>
            }



          </div>
        )}
        {selected == 2 && (
          <div>
            <MovieList ids={currentUser.watchLists} />
          </div>
        )}
        {selected == 3 && (
          <div>

          </div>
        )}
      </div>

    );
  }

  console.log("Current user in here", currentUser);

  return html;
}


