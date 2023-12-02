"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getCurrentReviewsFromLetterboxdServer, getMe } from "@/utils/clients.utils";
import { User } from "@/types";
import letterboxd from "letterboxd-api";
import { ReviewCustomization } from "../reviews/page";
import axios from "axios";

export default function Page() {
  const [customer, setCustomer] = useState<User | null>(null);
  const [reviews, setReviews] = useState<ReviewCustomization[] | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  // const reviews = await letterboxd("akickedsandwich") as ReviewCustomization[];

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const json = await axios.get(`http://localhost:8080/api/v1/users/${user?._id}/reviews`,
          {
            headers: {
              authorization: `Bearer ${localStorage.getItem("accessToken")} `,
            },
          });
        setReviews(json.data.data);

      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [isAuthenticated])

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

        <div className="flex flex-col justify-center items-center md:mt-80">
          <ul>
            {reviews !== null ? <> {reviews.map((review) => (
              <div key={review.type} className="flex justify-between items-center md:mt-4">
                <li className="text-white">
                  <Image src={review.film.image.large} width={120} height={120} alt="" priority></Image>
                </li>
                <div className="flex flex-col justify-center md:w-full md:ml-24">
                  <li className="text-white text-left">{review.film.title}</li>
                  <li className="text-white text-left">{review.film.year}</li>
                  <li className="text-white text-left">{review.review}</li>
                </div>
              </div>
            ))}</> : <p className="text-white">Reviews Loading.....</p>}
          </ul>
        </div>
      </div>
    );
  }

  return html;
}
