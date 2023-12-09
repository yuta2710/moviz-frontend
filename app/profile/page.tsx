"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentReviewsFromLetterboxdServer, getMe } from "@/utils/clients.utils";
import { User } from "@/types";
import letterboxd from "letterboxd-api";
import axios from "axios";

export default function Page() {
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
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

  let html: ReactElement<any, any> = <div className="text-white">Loading...</div>;
  if (loading) {
    html = <div className="text-white"> Loading...</div>;
  }

  if (customer !== null) {
    html = (
      <div className="flex flex-col justify-center items-center relative md:top-[5rem]">
        <h1 className="text-white relative md:top-[10rem] text-4xl font-semibold md:ml-4">Profile</h1>
        <div className="flex justify-center items-center flex-row relative md:top-[15rem] bg-gray-700 p-24 rounded-xl">
          <Image
            className="text-white text-center rounded-full md:mr-36"
            width={250}
            height={250}
            alt="Customer Photo"
            src={customer.photo}
          />
          <div className="flex flex-col justify-center items-start md:mt-8">
            <h1 className="text-white text-center md:mt-2">{customer.username}</h1>
            <h1 className="text-white text-center md:mt-2">{customer.email}</h1>
            <h1 className="text-white text-center md:mt-2">{customer.firstName} {customer.lastName}</h1>
          </div>
        </div>
      </div>
    );
  }

  return html;
}