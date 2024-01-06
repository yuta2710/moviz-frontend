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
    <div>
      <p className="text-white text-center">{visitor?.username}</p>
      <Image src={visitor?.photo} width={500} height={500} alt="" className="rounded-full"></Image>
    </div>
}