"use client";

import { useAuth } from "@/components/context/AuthContext";
import { User } from "@/types";
import { APPLICATION_PATH, checkIsCurrentUserFollowOtherUser, getMe, getUserById, onFollow, unFollow } from "@/utils/clients.utils";
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
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const [isFollowed, setIsFollowed] = useState<boolean>(localStorage.getItem("isFollowed") === "true");

  // Handle authentication
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
    }
    if (APPLICATION_PATH.includes(path)) {
      setLoading(false);
      router.push(path);
    }
    else {
      setLoading(false);
      // router.push("/login");
    }
  }, [isAuthenticated]);

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
  }, [shouldFetchVisitor, params.id]);

  useEffect(() => {
    localStorage.setItem("isFollowed", String(isFollowed));
  }, [isFollowed]);


  const handleOnFollow = async () => {
    if (visitor !== null) {
      await onFollow(visitor?._id)
      setShouldFetchVisitor(true);
      setIsFollowed(true);
    }
  }

  const handleUnFollow = async () => {
    if (visitor !== null) {
      await unFollow(visitor?._id)
      setShouldFetchVisitor(true);
      setIsFollowed(false);
    }
  }

  customer !== null && visitor !== null && console.log(checkIsCurrentUserFollowOtherUser(customer, visitor));

  return visitor !== null &&
    <div className="flex flex-row justify-center items-start md:w-full md:mt-16">
      <div className="">
        <Image src={visitor?.photo} width={350} height={0} style={{ height: "350px" }} alt="" className="rounded-full"></Image>
      </div>
      <div className="flex flex-col justify-center items-start md:ml-8">
        {/** Username and follow button */}
        <div className="flex flex-row justify-center items-center">
          <div className="text-white">{visitor.username}</div>
          {customer !== null && isFollowed ? <button
            onClick={handleUnFollow}
            type="button"
            className="relative md:ml-8 bg-green-600 rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-10 py-2 hover:scale-105 duration-500"
          >
            Unfollow
          </button> : <button
            onClick={handleOnFollow}
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
          <div className="text-gray-400 text-sm md:ml-4"><span className="text-white font-bold">{visitor.followers.length}</span> Followers</div>
          <div className="text-gray-400 text-sm md:ml-4"><span className="text-white font-bold">{visitor.followings.length}</span> Followings</div>
        </div>

        {/** Followers/Followings and Posts display */}
        <div className="flex flex-col justify-center items-center md:mt-4 text-xl">
          <div className="text-white font-medium">{visitor.lastName + " " + visitor.firstName}</div>
        </div>
        <div className="text-white font-regular text-sm md:mt-2">{visitor.email}</div>
        <div className="text-white font-regular text-sm md:mt-2 flex flex-row justify-center items-center">
          <div className="text-gray-400">
            Follow by
          </div>
          {customer !== null &&
            <div className="text-white md:ml-0 flex flex-row">
              {customer.followings.slice(0, 3).map((friendFollow: User, index: number) => (
                <div key={friendFollow._id} className="flex flex-row">
                  <Link href={`/visitor/${friendFollow._id}`}>
                    <p className="text-white md:ml-2">{friendFollow.username}</p>
                  </Link>
                  {index < 2 && customer.followings.length > 1 && <div>, </div>}
                </div>
              ))}
              {customer.followings.length > 3 && <>
                <div className="md:ml-1">and</div>
                <div className="md:ml-1 hover:text-blue-600 cursor-pointer duration-500"> +{customer.followings.length - 3} more</div>
              </>
              }
            </div>
          }

        </div>

      </div>
    </div>
}

// karma2710 follow dungle, dungle follow account A ==> karma2710 can see dungle follow that account

// Algorithm to check is followed of 2 accounts.
// step 1: checkIsCurrentUserFollowOtherUser(currentUser: User, otherUser: User)
        // checkIsOtherUserFollowCurrentUser(currentUser: User, otherUser: User)
        // checkIsCurrentUserFollowingFollowOtherUser(currentUser: User, otherUser: User)
        
// step 2: Check if current
