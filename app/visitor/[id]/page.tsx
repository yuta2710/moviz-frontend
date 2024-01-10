"use client";

import { useAuth } from "@/components/context/AuthContext";
import MovieList from "@/components/movie-list.component";
import { FilmReviewProps, User } from "@/types";
import { APPLICATION_PATH, checkIsCurrentUserFollowOtherUser, getMe, getMovie, getUserById, onFollow, unFollow } from "@/utils/clients.utils";
import { Box, Modal } from "@mui/material";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { startTransition, useEffect, useState, useTransition } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const router = useRouter();
  const path = usePathname();
  // step 1: getUser from back end 
  const [visitor, setVisitor] = useState<User | null>(null);
  const [shouldFetchVisitor, setShouldFetchVisitor] = useState(true);
  const [loading, setLoading] = useState(true);
// const [customer, setCustomer] = useState<User | null>(null);
  const { user, logout, isAuthenticated, currentUser } = useAuth();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const [openFollowersInfo, setOpenFollowersInfo] = useState<boolean>(false);
  const [openFollowingsInfo, setOpenFollowingsInfo] = useState<boolean>(false);
  const [checkFollowed, setCheckFollowed] = useState<boolean>(currentUser !== null && visitor !== null && checkIsCurrentUserFollowOtherUser(currentUser, visitor) as boolean);
  const handleOpenFollowersInfo = () => setOpenFollowersInfo(true);
  const handleCloseFollowersInfo = () => setOpenFollowersInfo(false);

  const handleOpenFollowingsInfo = () => setOpenFollowingsInfo(true);
  const handleCloseFollowingsInfo = () => setOpenFollowingsInfo(false);

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
    p: 4,
    outline: "none",
    overflow: "auto",
  };

  // Handle authentication
  // useEffect(() => {
  //   if (isAuthenticated() && user !== null) {
  //     const fetchData = async () => {
  //       try {
  //         const json = await getMe();
  //         setCustomer(json.data);
  //       } catch (error) {
  //         console.log(error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();
  //   }
  //   if (APPLICATION_PATH.includes(path)) {
  //     setLoading(false);
  //     router.push(path);
  //   }
  //   else {
  //     setLoading(false);
  //     // router.push("/login");
  //   }
  // }, [isAuthenticated]);

  useEffect(() => {
    const fetchVisitorById = async () => {
      try {
        const visitor = await getUserById(params.id);
        setVisitor(visitor.data);
      } catch (error) {
        console.log(error);
      }
    };

    if (shouldFetchVisitor) {
      fetchVisitorById();
      setShouldFetchVisitor(false);
    }
  }, [shouldFetchVisitor, params.id, currentUser]);

  // useEffect(() => {
  //   localStorage.setItem("isFollowed", String(isFollowed));
  // }, [isFollowed]);

  useEffect(() => {
    const checkFollowed = async () =>{
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/check/${visitor?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setIsFollowed(response.data.isFollowed);
        console.log("Follow chua ne: ", isFollowed)
      } catch (error) {
        console.error("Error checking following:", error);
      }
    }
    if (visitor !== null){
    checkFollowed();
    }
    
    console.log("visitor's id: ", visitor?._id);
  }, [visitor]);


  const handleOnFollow = async (user: User) => {
    if (visitor !== null) {
      await onFollow(user?._id)
      setShouldFetchVisitor(true);
      setIsFollowed(true);
      // setCheckFollowed(true);
      if(user._id !== visitor._id){
        window.location.reload();
      }
    }
  }
  // useEffect(() => {
    
  // })
  
  const handleUnFollow = async (user: User) => {
    if (visitor !== null) {
      await unFollow(user?._id)
      setShouldFetchVisitor(true);
      setIsFollowed(false);
      if(user._id !== visitor._id){
        window.location.reload();
      }
    }
  }

  currentUser !== null && visitor !== null && console.log(checkIsCurrentUserFollowOtherUser(currentUser, visitor));

  // console.log(checkFollowed);

  console.log("Day la current user = ", currentUser);
  console.log("Day la visitor = ", visitor);
 
  return visitor !== null &&
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-row justify-center items-start md:w-full md:mt-16">
        <div className="">
          <Image src={visitor?.photo} width={350} height={0} style={{ height: "350px" }} alt="" className="rounded-full"></Image>
        </div>
        <div className="flex flex-col justify-center items-start md:ml-8">
          {/** Username and follow button */}
          <div className="flex flex-row justify-center items-center">
            <div className="text-white">{visitor.username}</div>
            {isFollowed  ? <button
              onClick={() => handleUnFollow(visitor)}
              type="button"
              className="relative md:ml-8 bg-green-600 rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-10 py-2 hover:scale-105 duration-500"
            >
              Unfollow
            </button> : <button
              onClick={() => handleOnFollow(visitor)}
              type="button"
              className="relative md:ml-8 bg-dark-green rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-10 py-2 hover:scale-105 duration-500"
            >
              Follow
            </button>
            }
          </div>

          {/** Followers/Followings and Posts display */}
          <div className="flex flex-row justify-center items-center relative md:mt-2">
            <div className="text-gray-400 text-sm"><span className="text-white font-bold">12</span> Reviews Posts</div>
            <div className="text-gray-400 text-sm md:ml-4 hover:text-blue-light duration-500 cursor-pointer" onClick={handleOpenFollowersInfo}><span className="text-white font-bold">{visitor.followers.length}</span> Followers</div>
            <div className="text-gray-400 text-sm md:ml-4 hover:text-blue-light duration-500 cursor-pointer" onClick={handleOpenFollowingsInfo}><span className="text-white font-bold">{visitor.followings.length}</span> Followings</div>
          </div>

          {/** Followers/Followings and Posts display */}
          <div className="flex flex-col justify-center items-center md:mt-4 text-xl">
            <div className="text-white font-medium">{visitor.lastName + " " + visitor.firstName}</div>
          </div>
          <div className="text-white font-regular text-sm md:mt-2">{visitor.email}</div>
          <div className="text-white font-regular text-sm md:mt-2 flex flex-row justify-center items-center">
            <div className="text-gray-400">
              Followed by
            </div>
            {currentUser !== null &&
              <div className="text-white md:ml-0 flex flex-row">
                {visitor.followings.map((friendFollow: User, index: number) =>  (
                  <div key={friendFollow._id} className="flex flex-row">
                    <Link href={`/visitor/${friendFollow._id}`}>
                      <p className="text-white md:ml-2">{friendFollow.username}</p>
                    </Link>
                    {index < 2 && visitor.followings.length > 1 && <div>, </div>}
                  </div>
                ))}
                {visitor.followings.length > 3 && <>
                  <div className="md:ml-1">and</div>
                  <div className="md:ml-1 hover:text-blue-600 cursor-pointer duration-500"> +{visitor.followings.length - 3} more</div>
                </>
                }
              </div>
            }
          </div>

        </div>

        <Modal
          open={openFollowersInfo}
          onClose={handleCloseFollowersInfo}
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
          <div className="text-white text-center text-sm font-medium">You followed this user</div>
              {visitor.followers.map((followings: User) => followings._id !== currentUser?._id && (
                <div className="">
                  <li className="flex flex-row justify-start apple-linear-glass md:p-4 md:mt-4 rounded-lg">
                  <div className="">
                    <Image src={followings.photo} width={50} height={50} style={{height: "50px"}} alt="" className="rounded-full"></Image>
                  </div>
                  <div className="flex flex-col justify-center md:ml-8 flex-grow">
                    <p className="text-white text-[0.8rem] relative">{followings.username}</p>
                    <p className="text-gray-500 relative text-[0.8rem]">{followings.lastName + " " + followings.firstName}</p>
                  </div>
                  {currentUser !== null && checkIsCurrentUserFollowOtherUser(currentUser, followings) ? 
                  <button
                    onClick={() => handleUnFollow(followings)}
                    type="button"
                    className="relative md:ml-8 bg-green-600 rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-6 py-1 hover:scale-105 duration-500"
                  >
                    Unfollow
                  </button> : <button
                    onClick={() => handleOnFollow(followings)}
                    type="button"
                    className="relative md:ml-8 bg-dark-green rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-6 py-1 hover:scale-105 duration-500"
                  >
                    Follow
                  </button>
                  }
                </li>
                </div>
              ))}
            </ul>
          </Box>
        </Modal>

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
              {visitor.followings.map((follower: User) => (
                <li className="flex flex-row justify-start apple-linear-glass md:p-4 md:mt-4 rounded-lg">
                  <div className="">
                    <Image src={follower.photo} width={50} height={50} style={{height: "50px"}} alt="" className="rounded-full"></Image>
                  </div>
                  <div className="flex flex-col justify-center md:ml-8 flex-grow">
                    <p className="text-white text-[0.8rem] relative">{follower.username}</p>
                    <p className="text-gray-500 relative text-[0.8rem]">{follower.lastName + " " + follower.firstName}</p>
                  </div>
                  {currentUser !== null && checkIsCurrentUserFollowOtherUser(currentUser, follower) ? 
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
                  }
                </li>
              ))}
            
            </ul>
          </Box>
        </Modal>

      </div>
      <div className="flex flex-col justify-center items-start">
        <h1 className="text-left font-bold text-xl text-white">Watchlists</h1>
        {visitor.watchLists.length > 0 && 
          <MovieList ids={visitor.watchLists} />
        }
      </div>

      <div className="flex flex-col justify-center items-start">
        <h1 className="text-left font-bold text-xl text-white">Recent Reviews</h1>
        {visitor.reviews.length > 0 && 
          visitor.reviews.map((review: FilmReviewProps) => review.movieObject !== null && (
            <div className='flex flex-row gap-5 mt-5 items-center'>
              <Image src={`https://image.tmdb.org/t/p/w500/${review.movieObject?.poster_path}`} style={{ height: "100px" }} alt='movie-poster' width={60} height={100} />
              <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row justify-between gap-4 items-center'>
                  <h1 className='text-[1rem] font-semibold italic'>{review.movieObject?.title}</h1>
                  <h2 className='text-gray-500 text-sm'>{new Date(review.movieObject?.release_date as string).getFullYear()}</h2>
                  {/* <h2 className='text-sm'>{review.author_details.rating}/10</h2> */}
                </div>
                <p className='text-white text-[0.8rem] line-clamp-4 md:max-w-[500px] md:mt-2 text-justify'>{review.content}</p>
              </div>
            </div>
        ))}
      </div>
    </div>
}

// karma2710 follow dungle, dungle follow account A ==> karma2710 can see dungle follow that account

// Algorithm to check is followed of 2 accounts.
// step 1: checkIsCurrentUserFollowOtherUser(currentUser: User, otherUser: User)
        // checkIsOtherUserFollowCurrentUser(currentUser: User, otherUser: User)
        // checkIsCurrentUserFollowingFollowOtherUser(currentUser: User, otherUser: User)
        
// step 2: Check if current