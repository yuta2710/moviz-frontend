"use client";

import { ReactElement, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { APPLICATION_PATH, getGenres, getMe, getMovies } from "@/utils/clients.utils";
import { FilmReviewProps, Genre, Movie, User } from "@/types";
import { CircularProgress, Pagination } from "@mui/material";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "../../build/three.module";
import { delay, map, set } from "lodash";
import { useInView } from "react-intersection-observer";
import { useAuth } from "@/components/context/AuthContext";

export default function Page(): ReactElement {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);

  const [year, setYear] = useState();
  const [reviews, setReviews] = useState<FilmReviewProps[]>([]);
  const [genre, setGenre] = useState("");
  const [rating, setRating] = useState("popularity.desc");
  const [popular, setPopular] = useState("popularity.desc");
  const [period, setPeriod] = useState("");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");
  const [genres, setGenres] = useState<Genre[]>([])
  const router = useRouter();
  const [ref, inView] = useInView();
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const path = usePathname();

  const [title, setTitle] = useState("");

  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const currentDayOfWeek = currentDate.getDay();
  const firstDayOfWeekIndex: number = 1;
  const difference: number = currentDayOfWeek - firstDayOfWeekIndex;
  const firstDayOfWeek: Date = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - difference - (currentDayOfWeek === 0 ? 7 : 0));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(currentDate.getFullYear() + 1, 0, 0);


  console.log("You chose this genre: " + genre);

  const handleOnChangeYear = (event: any) => {
    const year = event.target.value;
    setYear(year);
    setStartDate(year + "-01-01");
    setEndDate(year + "-12-31");
    setPopular("popularity.desc");
    // router.push(/movies/decades/year/${year});
    // router.push(`/movies/decades/year/${year}/${page}`);
  };

  useEffect(() => {
    const movieQueriesDOM = Array.from(document.querySelectorAll(".movie-obj"));
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
  }, [movies.length > 0]);

  const handleOnChangeRating = (event: any) => {
    const rating = event.target.value;
    setRating(rating);

    // if (rating === "Highest") {
    //   router.push(`/movies/by/rating/highest/`);
    // }
    // if (rating === "Lowest") {
    //   router.push(`/movies/by/rating/lowest/`);
    // }
    // router.push(/movies/decade/${rating});
  };

  const handleOnChangePopular = (event: any) => {
    const popular = event.target.value;
    setPopular(popular);
    setRating("popularity.desc");
    setYear(undefined);
    if (popular === "this-year") {
      setStartDate(formatDate(firstDayOfYear));
      setEndDate(formatDate(lastDayOfYear));
    }
    else if (popular === "this-month") {
      setStartDate(formatDate(firstDayOfMonth));
      setEndDate(formatDate(lastDayOfMonth));
    }
    else if (popular === "this-week") {
      setStartDate(formatDate(firstDayOfWeek));
      setEndDate(formatDate(lastDayOfWeek));
    }
  };

  function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleOnChangeGenre = (event: any) => {
    const genre = event.target.value;
    setGenre(genre);
    // router.push(`/movies/genre/${genre}`);
  };

  // Handle authentication
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
    }
    if (APPLICATION_PATH.includes(path)) {
      setLoading(false);
      router.push(path);
    }
    else {
      setLoading(false);
      // router.push("/login");
    }
  }, [isAuthenticated]);


  // Fetch all movies
  useEffect(() => {
    // if (!page || currentPage === 1) {
    //   router.push(/movies?page=${currentPage})
    // }
    const fetchData = async (rating: string, genre: string) => {
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=1&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=${rating}&with_genres=${genre}`);
      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMovies(data.results as Movie[]);
      });
      // data.then(json => {
      //   const data = json.data;
      //   console.log(data.results);
      //   setMovies((prevMovies: Movie[]) => {
      //     const uniqueMovies = data.results.filter((newMovie: Movie) =>
      //       !prevMovies.some(prevMovie => prevMovie.id === newMovie.id)
      //     );
      //     return [...prevMovies, ...uniqueMovies];
      //   });
      // })
      // const options = {
      //   method: "GET",
      //   headers: {
      //     accept: "application/json",
      //     Authorization:
      //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
      //   },
      // };
      const genres = await getGenres();
      setGenres(genres);
      console.log("Movies list: ", movies);
      let newTitle = "";
      if (year) {
        newTitle += ` of ${year}`
      }
      if (genre) {
        const selectedGenre = genres.find((g) => g.id === parseInt(genre, 10));
        if (selectedGenre) {
          newTitle += ` in ${selectedGenre.name}`;
        }
      }
      if (rating !== "popularity.desc") {
        newTitle += ` by ${rating === "vote_average.desc" ? "Highest" : "Lowest"} Rating`; // Add rating to the title
      }
      if (popular !== "popularity.desc") {
        newTitle += ` This ${popular === "this-year" ? "Year" : popular === "this-month" ? "Month" : "Week"}`; // Add popularity period to the title
      }

      setTitle(newTitle);
    }
    fetchData(rating, genre);
  }, [router, year, rating, genre, popular]);


  useEffect(() => {
    // if (!page || currentPage === 1) {
    //   router.push(/movies?page=${currentPage})
    // }
    const fetchData = async (pageNumber: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber}&primary_release_date.gte=${startDate}&primary_release_date.lte=${endDate}&sort_by=${rating}&with_genres=${genre}`);
      const data = response.json();
      // data.then(json => {
      //   const data = json.data;
      //   console.log("data result:" , data.results);
      //   setMovies(data.results as Movie[]);

      // });
      data.then(json => {
        const data = json.data;
        console.log("data result:", data.results);
        setMovies((prevMovies: Movie[]) => {
          const uniqueMovies = data.results.filter((newMovie: Movie) =>
            !prevMovies.some(prevMovie => prevMovie.id === newMovie.id)
          );
          return [...prevMovies, ...uniqueMovies];
        });
      })
      // const options = {
      //   method: "GET",
      //   headers: {
      //     accept: "application/json",
      //     Authorization:
      //       "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
      //   },
      // };


    }
    fetchData(currentPage);

  }, [currentPage]);


  // Infinite Scroll
  useEffect(() => {
    if (inView) {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
      const loadMore = async () => {
        await delay(1000);
        const current = currentPage;
        const next = current + 1;
        setCurrentPage(next);
        console.log("last in view")
      }
      loadMore();
    }
  }, [inView]);

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
      value: "vote_average.desc",
      label: "Highest"
    },
    {
      value: "vote_average.asc",
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
  return (
    <div className="relative">
      <div className="">
        {movies.length > 0 && (
          <div className="flex flex-col justify-center relative md:mt-8">
            <h1 className="text-white text-2xl font-extrabold tracking-wide relative text-center">Most Popular Films <span className="text-red-500 font-semibold">{title}</span></h1>
            <div className="flex flex-row justify-center items-center relative md:mt-12">
              <h1 className="text-white text-[1.2rem] font-semibold relative text-left">View By</h1>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white" value={year} onChange={handleOnChangeYear}>
                {yearOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>

              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white " value={rating} onChange={handleOnChangeRating}>
                <option value={rating} disabled selected className="text-center">Rating</option>
                {ratingOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white " value={popular} onChange={handleOnChangePopular}>
                {popularOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white " value={genre} onChange={handleOnChangeGenre}>
                <option value="" disabled selected className="text-center">Genre</option>
                {genres.map((genre) => (
                  <option value={genre.id} className="text-center">{genre.name}</option>
                ))}
              </select>
            </div>

            {/* <div className="flex flex-row justify-center items-center relative">
              <h1 className="text-white text-[1.2rem] font-semibold relative text-left">Popular Film On This Week</h1>
            </div> */}
            <div className="flex flex-row">
              {/* <div className="blob relative"></div> */}
              <div className="blob-linear-yellow-blue relative"></div>
            </div>
            <ul className={`grid grid-cols-2 md:grid-cols-4 md:mx-auto relative gap-4 justify-center items-center md:mt-8`}>
              {[...movies]
                .slice(0, 6)
                .map((movie) => movie.poster_path !== null && (
                  <li className="">
                    <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-obj">
                      <div className="">
                        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} objectFit="cover" alt="" className="md:mx-auto rounded-sm"></Image>
                      </div>
                    </Link>
                    <h3 className="text-white text-[1rem] text-center font-semibold">{movie.title}</h3>
                  </li>
                ))}
            </ul>
            <h1 className="text-white text-2xl font-semibold relative text-center md:mt-24">Other Similar Films</h1>
            <ul className="grid grid-cols-2 md:grid-cols-6 md:mx-auto relative gap-4 justify-center items-center md:mt-8">
              {[...movies]
                .slice(6,)
                .map((movie) => movie.poster_path !== null && (
                  <li className="">
                    <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-obj">
                      <div className="">
                        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={500} objectFit="cover" alt="" className="md:mx-auto rounded-sm"></Image></div>
                    </Link>
                    <h3 className="text-white text-sm text-center font-semibold md:mt-1">{movie.title}</h3>
                  </li>
                ))}
            </ul>
            <div className="text-white text-2xl font-semibold relative text-center md:py-16" ref={ref}><CircularProgress color="secondary" /></div>
          </div>

        )}
      </div>
    </div>
  );

}