"use client";

import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { HOST_PRODUCT, checkIsCurrentUserFollowOtherUser, getCurrentReviewsFromLetterboxdServer, getMe, getMovie } from "@/utils/clients.utils";
import { FilmReviewProps, User } from "@/types";
import letterboxd from "letterboxd-api";
import axios from "axios";
import { Box, CircularProgress, IconButton, Modal, Pagination, Snackbar } from "@mui/material";
import MovieList from "@/components/movies-list.component";
import ReviewList from "@/components/review-list.component";
import CloseIcon from "@mui/icons-material/Close";

export default function Page() {
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, isAuthenticated, currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(1);
  const [isEditingFirstname, setIsEditingFirstname] = useState(false);
  const [isEditingLastname, setIsEditingLastname] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 3;
  const [openToastWarning, setOpenToastWarning] = useState<boolean>();
  const [warningMessage, setWarningMessage] = useState("");
  const [openFollowingsInfo, setOpenFollowingsInfo] = useState<boolean>(false);
  const handleOpenFollowingsInfo = () => setOpenFollowingsInfo(true);
  const handleCloseFollowingsInfo = () => setOpenFollowingsInfo(false);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };
  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenToastWarning(false);
  };
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="error"
        onClick={handleClose}
      >
        <CloseIcon fontSize="large" className="hover-scale-105 duration-500" />
      </IconButton>
    </React.Fragment>
  );

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 470,
    height: 500,
    bgcolor: "#000",
    border: "none",
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 1,
    outline: "none",
    overflow: "auto",
  };

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
      console.log("Watchlist: ", customer?.watchLists);
      console.log("customer id: ", customer?._id)
      console.log("customer name: ", customer?.lastName);
      console.log("customer reviews: ", customer?.reviews);
    } else {
      setLoading(false);
      router.push("/login")
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // window.location.reload();
    // router.replace(route);

  }, []);


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
    const maxSize = 100000;

    if (file && isFileValidType(file) && file.size <= maxSize) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const response = await axios.patch(`${HOST_PRODUCT}/api/v1/users/${customer?._id}/photo`, formData, {
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
      setOpenToastWarning(true);
      setWarningMessage("Invalid file type or file is too large!");
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
      const response = await axios.patch(`${HOST_PRODUCT}/api/v1/users/${customer?._id}/update-profile`, JSON.stringify(data), {
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

  const uniqueTags = new Set();

  if (currentUser !== null && customer != null) {
    html = (

      <div className="flex flex-col justify-center  relative md:top-[10rem] w-3/5 mx-auto text-white">
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
              alt="Customer Photo"
              src={customer.photo}
              onClick={handleAvatarClick}
            />
            <input className="hidden" type="file" id="fileInput" name="fileInput" onChange={handleFileChange}></input>
          </div>
          <div className="grid col-span-2 gap-5 w2/3 ">
            <div className="flex flex-row text-3xl font-medium my-auto grid grid-cols-3">
              <div className="col-span-3 md:col-span-1">
                <h1 className="text-white text-center md:text-left s">
                  {currentUser.username}
                </h1>
              </div>

              <div className="flex flex-row justify-center items-center md:mt-1 md:ml-8 col-span-3 md:col-span-1">
                <p className="text-white text-[1.05rem] hover:text-blue-light cursor-pointer">{customer.followers.length} <span className="text-[0.8rem]">Followers</span></p></div>
              <div className="flex flex-row justify-center items-center md:mt-1 md:ml-8 col-span-3 md:col-span-1">
                <p className="text-white text-[1.05rem] md:ml-8 hover:text-blue-light cursor-pointer" onClick={handleOpenFollowingsInfo}>{customer.followings.length} <span className="text-[0.8rem]">Followings</span></p>
              </div>
            </div>
            <div className="col-span-3 md:col-span-2 justify-center items-center">
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
            <div className="col-span-3 md:col-span-2 justify-center items-center">
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
            <div className="col-span-3 md:col-span-2 justify-center items-center">
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
                  {currentUser.reviews.map((review, index) => {
                    // Check if the tag is not in the set of unique tags
                    if (!uniqueTags.has(review.tag)) {
                      // Add the tag to the set of unique tags
                      uniqueTags.add(review.tag);
                      // Render the button
                      return (
                        <button key={index} className="bg-cyan-700 rounded-lg text-sm">
                          {review.tag}
                        </button>
                      );
                    } else {
                      // Skip rendering for duplicates
                      return null;
                    }
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-10 items-start">
          <h1 className={`${selected == 1 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(1)}>Reviews</h1>
          <h1 className={`${selected == 2 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(2)}>Watchlist</h1>
        </div>
        {selected == 1 && (
          <div>

            <ReviewList reviews={customer.reviews} currentPage={currentPage} itemsPerPage={reviewsPerPage} />
            <div>
              <Pagination
                count={Math.ceil(customer.reviews.length / reviewsPerPage)}
                // variant="outlined"
                color="secondary"
                size="large"
                page={currentPage}
                onChange={(event, page) => handlePageChange(page)}

              />
            </div>



          </div>
        )}
        {selected == 2 && (
          <div>
            <MovieList ids={customer.watchLists} />
          </div>
        )}

        <Snackbar
          style={{}}
          open={openToastWarning}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          autoHideDuration={6000}
          onClose={handleClose}
          message={warningMessage}
          action={action}
          ContentProps={{
            sx: {
              paddingX: "4rem",
              paddingY: "2rem",
              borderRadiusL: "8px",
              background:
                "linear-gradient(270deg, #072434 3.17%, #000 50.35%, #072434 97.53%)",
              color: "#FF6D60",
              fontFamily: "Poppins",
              fontWeight: "bold",
              fontSize: "1.2rem",
            },
          }}
        />

        <Modal
          open={openFollowingsInfo}
          onClose={handleCloseFollowingsInfo}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={style}
            style={
              {
                // backgroundImage:
                //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
              }
            }
            className="util-box-shadow-purple-mode black-linear"
          >
            <ul className="z-10 relative md:mx-auto md:w-full">
              <h1 className="text-white text-xl font-semibold text-center md:mt-8">Your Followings</h1>
              {customer.followings.map((follower: User) => (
                <li className="flex flex-row justify-start apple-linear-glass md:p-4 md:mt-4 rounded-lg">
                  <div className="">
                    <Image src={follower.photo} width={50} height={50} style={{ height: "50px" }} alt="" className="rounded-full"></Image>
                  </div>
                  <div className="flex flex-col justify-center md:ml-8 flex-grow">
                    <p className="text-white text-[0.8rem] relative">{follower.username}</p>
                    <p className="text-gray-500 relative text-[0.8rem]">{follower.lastName + " " + follower.firstName}</p>
                  </div>
                  {/* {currentUser !== null && checkIsCurrentUserFollowOtherUser(currentUser, follower) ?
                    <button
                      onClick={() => handleUnFollow(follower)}
                      type="button"
                      className="relative md:ml-8 bg-green-600 rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-6 py-1 hover:scale-105 duration-500"
                    >
                      Unfollow
                    </button> : <button
                      onClick={() => handleOnFollow(follower)}
                      type="button"
                      className="relative md:ml-8 bg-dark-green rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-6 py-1 hover:scale-105 duration-500"
                    >
                      Follow
                    </button>
                  } */}
                </li>
              ))}

            </ul>
          </Box>
        </Modal>
      </div>

    );
  }

  return html;
}