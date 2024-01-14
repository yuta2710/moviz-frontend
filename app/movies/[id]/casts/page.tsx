"use client";

import Casts from "@/components/casts.component";
import { Cast } from "@/types";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Fragment, ReactElement, useState } from "react";

export default function Page(): ReactElement {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  // const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const router = useRouter();
  const path = usePathname();

  console.log(path)
  const id = path.split("/")[2];

  console.log("ID = ", id);
  return <>
    <div className="relative md:mt-16">
      <Casts id={id} />
    </div>
  </>
}
