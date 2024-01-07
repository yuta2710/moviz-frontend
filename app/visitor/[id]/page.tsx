"use client";

import { User } from "@/types";
import { getUserById } from "@/utils/clients.utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  // step 1: getUser from back end 
  const [visitor, setVisitor] = useState<User | null>(null);

  console.log("Visitor = ", visitor)
  useEffect(() => {
    const fetchVisitorById = async () => {
      try {
        const visitor = await getUserById(params.id);
        setVisitor(visitor.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVisitorById();
  }, []);

  return visitor !== null &&
    <div className="flex flex-row justify-center items-start md:w-full md:mt-16">
      <div className="">
        <Image src={visitor?.photo} width={350} height={0} style={{ height: "350px" }} alt="" className="rounded-full"></Image>
      </div>
      <div className="flex flex-col justify-center items-start md:ml-8">
        {/** Username and follow button */}
        <div className="flex flex-row justify-center items-center">
          <div className="text-white">{visitor.username}</div>
          <button
            // onClick={() => console.log("Clicked")}
            type="button"
            className="relative md:ml-8 bg-dark-green rounded-lg focus:outline-none text-white text-[1.8rem] font-medium text-sm md:px-10 py-2 hover:scale-105 duration-500"
          >
            Follow
          </button>
        </div>

        {/** Followers/Followings and Posts display */}
        <div className="flex flex-row justify-center items-center relative md:mt-2">
          <div className="text-gray-400 text-sm"><span className="text-white font-bold">12</span> Reviews Posts</div>
          <div className="text-gray-400 text-sm md:ml-4"><span className="text-white font-bold">22</span> Followers</div>
          <div className="text-gray-400 text-sm md:ml-4"><span className="text-white font-bold">44</span> Followings</div>
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
          <div className="text-white md:ml-2">anhbao420, anhdung420, datnguyen222 + 9 more</div>
        </div>

      </div>
    </div>
}

