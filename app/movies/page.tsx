"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMovies } from "@/utils/clients.utils";
import { Movie } from "@/types";
import { Pagination } from "@mui/material";
import Link from "next/link";


export default function Page(): ReactElement {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfMoviesPerPage] = useState(2);

  const fetchData = async (pageNumber: number) => {
    try {
      const response = await getMovies(pageNumber);
      setMovies(response.results as Movie[]);
    } catch (error) {
      setError(error as Error);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {

    fetchData(currentPage);
  }, [currentPage]);

  const indexLastMovie = currentPage * numberOfMoviesPerPage;
  const indexOfFirstMovie = indexLastMovie - numberOfMoviesPerPage;
  const currentMovie = movies.slice(indexOfFirstMovie, indexLastMovie);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  console.log(movies.length)

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-white">Error: {error.message}</p>}
      {!loading && !error && (
        <>
          <h1 className="">Movie list</h1>
          <ul className="grid grid-cols-4 gap-4 relative md:top-[20rem]">
            {movies.map((movie) => (
              // <li className="text-white" key={movie.id}>{movie.title}</li>

              <li>
                <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                  <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={500} height={200} alt="" className="md:mx-auto"></Image>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.title}</h5>
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.popularity}</h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                </Link>
              </li>
            ))}
          </ul>


          <Pagination
            count={Math.ceil(movies.length / numberOfMoviesPerPage)}
            page={currentPage}
            onChange={(event, page) => paginate(page)}
            size="large"
            color="primary"
            className="relative md:top-[25rem]"
            style={{ color: "#000", background: "#fff" }} />
        </>
      )}
    </div>
  );

}
