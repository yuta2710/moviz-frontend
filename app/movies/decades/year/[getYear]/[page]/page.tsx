"use client";

import { Movie } from "@/types";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { getYear: string, page: string } }) {
  // const searchParams = useSearchParams();
  // const page = Number(searchParams.get("page"));
  const [movieFilteringByYear, setMovieFilteringByYear] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(Number(params.page) || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async (pageNumber: number) => {
      console.log("URL is ", `http://localhost:8080/api/v1/movies?page=${pageNumber}&include_video=false&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2019-01-01&primary_release_date.lte=2019-12-31`)
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${params.getYear}-01-01&primary_release_date.lte=${params.getYear}-12-31`);

      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMovieFilteringByYear(data.results as Movie[]);
      });
    }

    fetchData(currentPage);
  }, [currentPage, router]);

  console.log("Movie filter by year " + params.getYear + " ", movieFilteringByYear);

  useEffect(() => {
    const movieQueriesDOM = Array.from(document.querySelectorAll(".movie-filter-by-year-obj"));
    gsap.set(movieQueriesDOM, {
      opacity: 0,
      y: -50
    })
    gsap.to(movieQueriesDOM, {
      y: 0,
      stagger: 0.2,
      duration: 1,
      opacity: 1
    })
  }, [movieFilteringByYear.length > 0]);

  return <div className="text-white flex flex-col justify-center items-center">
    <div className="relative md:top-[18rem]">
      <h1 className="text-white text-2xl">List of the popular movie from <span className=" text-ai4biz-green-quite-light font-bold">{params.getYear}</span></h1>
    </div>
    <ul className="inline-grid grid-cols-3 absolute gap-4 justify-center md:left-[30rem] md:top-[22rem]">
      {[...movieFilteringByYear]
        .map((movie) => (
          <li className="relative hover:scale-110 duration-500">
            <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-filter-by-year-obj">
              <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
              {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.popularity}</h5> */}
            </Link>
          </li>
        ))}
    </ul>

  </div>
}