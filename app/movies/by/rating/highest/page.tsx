"use client"
import { Movie } from '@/types';
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Link from "next/link";
import Image from "next/image";
import gsap from 'gsap';

export default function Page() {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [moviesFilterByHighestRate, setMoviesFilterByHighestRate] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async (pageNumber: number) => {
      console.log("URL is ", `http://localhost:8080/api/v1/movies?page=${pageNumber}&include_video=false&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2019-01-01&primary_release_date.lte=2019-12-31`)
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${new Date().getFullYear()}-01-01&primary_release_date.lte=${new Date().getFullYear()}-12-31&sort_by=vote_average.desc`);

      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMoviesFilterByHighestRate(data.results as Movie[]);
      });
    }

    fetchData(currentPage);
  }, [currentPage, router]);

  useEffect(() => {
    const movieQueriesDOM = Array.from(document.querySelectorAll(".movie-filter-by-rating-highest-obj"));
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
  }, [moviesFilterByHighestRate.length > 0]);


  return <div className="text-white">
    <div className="flex flex-wrap justify-center -mx-2">
    {[...moviesFilterByHighestRate].map((movie) => (
      movie.poster_path !== null && (
        <div key={movie.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2">
          <Link href={`/movies/${movie.id}`} className="block p-2 rounded-lg shadow movie-filter-by-rating-highest-obj">
            <Image
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              width={200}
              height={300} // Set an appropriate height
              alt=""
              className="mx-auto object-cover rounded-sm"
            />
            {/* Additional information if needed */}
            {/* <h5 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{movie.title}</h5> */}
          </Link>
        </div>
      )
    ))}
  </div>

  </div>

}

