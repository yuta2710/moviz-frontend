"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getMovies } from "@/utils/clients.utils";
import { Movie } from "@/types";
import { Pagination } from "@mui/material";
import Link from "next/link";


export default function Page(): ReactElement {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));

  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const router = useRouter();


  // const fetchData = async (pageNumber: number) => {
  //   try {
  //     const response = await getMovies(pageNumber);
  //     setMovies(response.results as Movie[]);
  //   } catch (error) {
  //     setError(error as Error);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  // useEffect(() => {

  //   fetchData(currentPage);
  // }, [currentPage]);

  // const indexLastMovie = currentPage * numberOfMoviesPerPage;
  // const indexOfFirstMovie = indexLastMovie - numberOfMoviesPerPage;
  // const currentMovie = movies.slice(indexOfFirstMovie, indexLastMovie);
  // const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // console.log(movies.length)

  useEffect(() => {
    if (!page || currentPage === 1) {
      router.push(`/movies?page=${currentPage}`)
    }
    const fetchData = async (pageNumber: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber}`);

      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMovies(data.results as Movie[]);
      });
    }

    fetchData(currentPage);
  }, [currentPage, router]);
  // const indexOfLastArticle = currentPage * numberOfArticlesPerPage;
  // const indexOfFirstArticle = indexOfLastArticle - numberOfArticlesPerPage;
  const indexLastMovie = currentPage * numberOfMoviesPerPage;
  const indexOfFirstMovie = indexLastMovie - numberOfMoviesPerPage;
  const currentMovie = movies.slice(indexOfFirstMovie, indexLastMovie);
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/movies?page=${pageNumber}`)
  };

  console.log(movies);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-white">Error: {error.message}</p>}
      {movies.length > 0 && (
        <div className="relative flex flex-col">
          <div className="flex flex-row justify-center items-center absolute md:top-[18rem] md:left-[31rem]">
            <h1 className="text-white text-[1.2rem] font-semibold relative text-left">Popular Film On This Week</h1>
          </div>
          <ul className="inline-grid grid-cols-3 absolute gap-4 justify-center md:left-[30rem] md:top-[22rem]">
            {[...movies]
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 6)
              .map((movie) => (
                <li className="relative">
                  <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow">
                    <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
                    {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.popularity}</h5> */}
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
            className="relative md:top-[10rem]"
            style={{ color: "#000", background: "#fff" }} />
        </div>
      )}
    </div>
  );

}
