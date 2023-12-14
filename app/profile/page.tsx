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

  let html: ReactElement<any, any> = <div className="text-white">Loading...</div>;
  if (loading) {
    html = <div className="text-white"> Loading...</div>;
  }

  if (customer !== null) {
    html = (
      <div className="flex flex-col justify-center  relative md:top-[10rem] w-3/5 mx-auto text-white">
        <div className="grid grid-cols-3 items-center">
          <div className="">
            <Image
              className="text-white text-center rounded-full md:mr-36"
              width={250}
              height={250}
              alt="Customer Photo"
              src={customer.photo}
            />
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
                (<div className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  {customer.firstName}
                  <p className={`${isEditingEmail || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingFirstname(true))}>Edit</p>
                </div>)}
                {isEditingFirstname && 
                (<form className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  <input type="text" className="border-none bg-transparent w-auto" id="fname" placeholder={`${customer.firstName}`}></input>
                  <div className="flex gap-3">
                    <button className="text-sm text-gray-500" type="submit" onSubmit={() => {}}>Save</button>
                    <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingFirstname(false)}>Cancel</button>
                  </div>
                </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col">
                <h3 className="mb-3">Last Name</h3>
                {!isEditingLastname && 
                (<div className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  {customer.lastName}
                  <p className={`${isEditingEmail || isEditingFirstname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingLastname(true))}>Edit</p>
                </div>)}
                {isEditingLastname && 
                (<form className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  <input type="text" className="border-none bg-transparent w-auto" id="fname" placeholder={`${customer.lastName}`}></input>
                  <div className="flex gap-3">
                    <button className="text-sm text-gray-500" type="submit" onSubmit={() => {}}>Save</button>
                    <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingLastname(false)}>Cancel</button>
                  </div>
                </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col mr-5">
                <h3 className="mb-3">Email</h3>
                {!isEditingEmail && 
                (<div className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  {customer.email}
                  <p className={`${isEditingFirstname || isEditingLastname ? 'hidden' : ''} text-sm text-gray-500 hover:cursor-pointer`} onClick={() => (setIsEditingEmail(true))}>Edit</p>
                </div>)}
                {isEditingEmail && 
                (<form className="flex flex-row border-2 border-black border-b-gray-500 py-2 justify-between">
                  <input type="text" className="border-none bg-transparent w-auto" id="fname" placeholder={`${customer.email}`}></input>
                  <div className="flex gap-3">
                    <button className="text-sm text-gray-500" type="submit" onSubmit={() => {}}>Save</button>
                    <button className="text-sm text-gray-500" type="button" onClick={() => setIsEditingEmail(false)}>Cancel</button>
                  </div>
                </form>)}
              </div>
            </div>
            <div className="col-span-2 justify-center items-center">
              <div className="flex flex-col">
                <h3 className="mb-3 text-gray-500 underline">Review Tags</h3>
                <div className="grid grid-cols-5 gap-2">
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
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                  <button className=" bg-cyan-700 rounded-lg">
                    Netflix
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-10 items-start border-2 border-black border-b-gray-500 py-2 ">
          <h1 className={`${selected == 1 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(1)}>Reviews</h1>
          <h1 className={`${selected == 2 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(2)}>Watchlist</h1>
          <h1 className={`${selected == 3 ? 'text-white' : 'text-gray-500'} hover:cursor-pointer`} onClick={() => setSelected(3)}>Like</h1>
        </div>
      </div>
    );
  }

  return html;
}