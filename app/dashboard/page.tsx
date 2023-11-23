"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe } from "@/utils/clients.utils";
import { User } from "@/types";

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
      <div className="flex justify-center items-center flex-col relative md:top-[20rem]">
        <Image
          className="text-white text-center rounded-full"
          width={250}
          height={250}
          alt="Customer Photo"
          src={customer.photo}
        />
        <h1 className="text-white text-center">{customer.email}</h1>
        <h1 className="text-white text-center">${customer.firstName}</h1>
        <h1 className="text-white text-center">{customer.lastName}</h1>
      </div>
    );
  }

  return html;
}
