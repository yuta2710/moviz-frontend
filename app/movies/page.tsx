"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { getGenres, getMovies } from "@/utils/clients.utils";
import { Genre, Movie } from "@/types";
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
  const [year, setYear] = useState(2023);
  const [rating, setRating] = useState("Highest");
  const [popular, setPopular] = useState("All");
  //const [genre, setGenre] = useState("action");
  const [genres, setGenres] = useState<Genre[]>([])
  const router = useRouter();

  const handleOnChangeYear = (event: any) => {
    const year = event.target.value;
    setYear(year);
    router.push(`/movies/decades/year/${year}`);

  };

  const handleOnChangeRating = (event: any) => {
    const rating = event.target.value;
    setRating(rating);

    if (rating === "Highest") {
      router.push(`/movies/by/rating/highest/`);
    }
    if (rating === "Lowest") {
      router.push(`/movies/by/rating/lowest/`);
    }
    // router.push(`/movies/decade/${rating}`);
  };

  const handleOnChangePopular = (event: any) => {
    const popular = event.target.value;
    router.push(`/movies/period/${popular}`);
  };

  const handleOnChangeGenre = (event: any) => {
    const genre = event.target.value;
    router.push(`/movies/genre/${genre}`);
  };

  useEffect(() => {
    if (!page || currentPage === 1) {
      router.push(`/movies?page=${currentPage}`)
    }
    const fetchData = async (pageNumber: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber}&primary_release_date.gte=${new Date().getFullYear()}-01-01&primary_release_date.lte=${new Date().getFullYear()}-12-31&sort_by=popularity.desc`);
      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMovies(data.results as Movie[]);
      });

      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
        },
      };
      const genres = await getGenres();
      setGenres(genres);
      console.log(genres);

    }

    fetchData(currentPage);
  }, [currentPage, router]);
  const indexLastMovie = currentPage * numberOfMoviesPerPage;
  const indexOfFirstMovie = indexLastMovie - numberOfMoviesPerPage;
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/movies?page=${pageNumber}`)
  };

  console.log(movies);
  const yearOptions = [
    {
      value: 2023,
      label: "2023"
    },
    {
      value: 2022,
      label: "2022"
    }, {
      value: 2021,
      label: "2021"
    },
    {
      value: 2020,
      label: "2020"
    },
    {
      value: 2019,
      label: "2019"
    },
    {
      value: 2018,
      label: "2018"
    },
  ];

  const ratingOptions = [
    {
      value: "Highest",
      label: "Highest"
    },
    {
      value: "Lowest",
      label: "Lowest"
    }
  ];

  const popularOptions = [
    {
      value: "All",
      label: "All"
    },
    {
      value: "this-year",
      label: "This Year"
    },
    {
      value: "this-month",
      label: "This Month"
    },
    {
      value: "this-week",
      label: "This Week"
    },
  ];



  // useEffect(() => {

  // }, [year])

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-white">Error: {error.message}</p>}
      {movies.length > 0 && (
        <div className="relative flex flex-col">
          <div className="flex flex-row justify-center items-center absolute md:top-[17.8rem] md:left-[50rem]">
            <select className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[120px] md:p-1.5 bg-dark-green dark:placeholder-gray-400 dark:text-white" value={year} onChange={handleOnChangeYear}>
              {yearOptions.map((option) => (
                <option value={option.value} className="text-center">{option.label}</option>
              ))}
            </select>

            <select className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[120px] md:p-1.5 bg-dark-green dark:placeholder-gray-400 dark:text-white" onChange={handleOnChangeRating}>
              <option value="" disabled selected className="text-center">Rating</option>
              {ratingOptions.map((option) => (
                <option value={option.value} className="text-center">{option.label}</option>
              ))}
            </select>
            <select className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[120px] md:p-1.5 bg-dark-green dark:placeholder-gray-400 dark:text-white" value={popular} onChange={handleOnChangePopular}>
              {popularOptions.map((option) => (
                <option value={option.value} className="text-center">{option.label}</option>
              ))}
            </select>
            <select className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[120px] md:p-1.5 bg-dark-green dark:placeholder-gray-400 dark:text-white" onChange={handleOnChangeGenre}>
              <option value="" disabled selected className="text-center">Genre</option>
              {genres.map((genre) => (
                <option value={genre.id} className="text-center">{genre.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-row justify-center items-center absolute md:top-[18rem] md:left-[31rem]">
            <h1 className="text-white text-[1.2rem] font-semibold relative text-left">Popular Film On This Week</h1>
          </div>
          <ul className="inline-grid grid-cols-3 absolute gap-4 justify-center md:left-[30rem] md:top-[22rem]">
            {[...movies]
              .sort((a, b) => b.popularity - a.popularity)
              .slice(0, 6)
              .map((movie) => (
                <li className="relative hover:scale-110 duration-500">
                  <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow">
                    <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
                    {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.popularity}</h5> */}
                  </Link>
                </li>
              ))}
          </ul>

          {/* 
          <Pagination
            count={Math.ceil(movies.length / numberOfMoviesPerPage)}
            page={currentPage}
            onChange={(event, page) => paginate(page)}
            size="large"
            color="primary"
            className="relative md:top-[10rem]"
            style={{ color: "#000", background: "#fff" }} /> */}
        </div>
      )}
    </div>
  );

}
