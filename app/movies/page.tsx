"use client";

import { ReactElement, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getGenres, getMovies } from "@/utils/clients.utils";
import { Genre, Movie } from "@/types";
import { Pagination } from "@mui/material";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "../../build/three.module";
import { delay, map } from "lodash";
import { useInView } from "react-intersection-observer";

export default function Page(): ReactElement {

  return (
    <div className="">

    </div>
  );

}
