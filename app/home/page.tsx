"use client";

import React, { ReactElement, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { APPLICATION_PATH, getAllReviews, getGenres, getMe, getMovie, getMovies, getRecommendations, getReviews } from "@/utils/clients.utils";
import { FilmReviewProps, Genre, Movie, User } from "@/types";
import { CircularProgress, Pagination } from "@mui/material";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "../../build/three.module";
import { delay, map } from "lodash";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../../components/context/AuthContext";
import { formatHistoryDate } from "@/utils/convert.utils";

export default function Page(): ReactElement {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [movies, setMovies] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const [year, setYear] = useState(2023);
  const [rating, setRating] = useState("Highest");
  const [popular, setPopular] = useState("All");
  const [reviews, setReviews] = useState<FilmReviewProps[]>([]);
  //const [genre, setGenre] = useState("action");
  const [genres, setGenres] = useState<Genre[]>([])
  const router = useRouter();
  const [ref, inView] = useInView();
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, logout, isAuthenticated } = useAuth();
  const path = usePathname();

  const handleOnChangeYear = (event: any) => {
    const year = event.target.value;
    setYear(year);
    // router.push(/movies/decades/year/${year});
    router.push(`/movies/decades/year/${year}/${page}`);
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
    // router.push(/movies/decade/${rating});
  };

  const handleOnChangePopular = (event: any) => {
    const popular = event.target.value;
    router.push(`/movies/period/${popular}`);
  };

  const handleOnChangeGenre = (event: any) => {
    const genre = event.target.value;
    router.push(`/movies/genre/${genre}`);
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
    const fetchData = async (pageNumber: number) => {
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber}&primary_release_date.gte=${new Date().getFullYear()}-01-01&primary_release_date.lte=${new Date().getFullYear()}-12-31&sort_by=popularity.desc`);
      const data = response.json();
      // data.then(json => {
      //   const data = json.data;
      //   console.log(data.results);
      //   setMovies(data.results as Movie[]);
      // });
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        //setMovies((prevMovies: Movie[]) =>  [...prevMovies, ...data.results]);
        setMovies((prevMovies: Movie[]) => {
          // Assuming that each Movie object has a unique 'id' property
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
      const genres = await getGenres();
      setGenres(genres);
      console.log("Movies list: ", movies);
    }
    fetchData(currentPage);
  }, [currentPage, router]);

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

  // Fetch all reviews
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const reviewsJson = await getAllReviews() as FilmReviewProps[];
  
        // Set movie object for each review
        const reviewsWithMovies = await Promise.all(
          reviewsJson.map(async (review: FilmReviewProps) => {
            try {
              const movieDetails = await getMovie(review.movie) as Movie;
              //const posterPath = movieDetails.poster_path || '';
              return { ...review, movieObject: movieDetails };
            } catch (error) {
              console.error(`Error fetching poster for movie ${review.movie}:`, error);
              return { ...review };
            }
          })
        );
  
        // Update the reviews state with reviews including movie objects
        setReviews(reviewsWithMovies);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAllReviews();
  }, []);


  useEffect(() => {
    const fetchUserWatchlist = async () => {
      if (customer?.watchLists) {
        // Create an array to store all recommendations
        const allRecommendations: Movie[] = [];
  
        // Loop through each movie in the watchlist
        for (const movieId of customer.watchLists) {
          try {
            // Make API request to get recommendations for each movie
            const data = await getRecommendations(movieId);
  
            // Update state with unique recommendations
            setRecommendedMovies((prevMovies: Movie[]) => {
              const uniqueMovies = data.results.filter((newMovie: Movie) =>
                !prevMovies.some(prevMovie => prevMovie.id === newMovie.id)
              );
              return [...prevMovies, ...uniqueMovies];
            });
  
            // Add recommendations to the allRecommendations array
            allRecommendations.push(...data.results);
          } catch (error) {
            console.error(`Error fetching recommendations for movie ${movieId}:`, error);
          }
        }
  
        // Log all recommendations after the loop
        console.log("All Recommendations:", allRecommendations);
      }
    };
  
    // Call the function to fetch user watchlist and recommendations
    if (isAuthenticated() && user !== null) {
      fetchUserWatchlist();
    }
  }, [isAuthenticated, user, customer?.watchLists, getRecommendations, setRecommendedMovies]);
  




  const indexLastMovie = currentPage * numberOfMoviesPerPage;
  const indexOfFirstMovie = indexLastMovie - numberOfMoviesPerPage;
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    router.push(`/movies?page=${pageNumber}`);
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

  // Movies Animation
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

  // Animation 3D Background
  useEffect(() => {
    const container = document.querySelector(".three_bg");
    console.log("This is container = ", container)

    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const camera: any = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGL1Renderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);

    const geometry: any = new THREE.BoxGeometry(5, 4, 1);
    const material = new THREE.MeshBasicMaterial({
      map: loader.load("https://images.unsplash.com/photo-1661090790202-2f9173c66362?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"),
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const count = geometry.attributes.position.count;
    const clock = new THREE.Clock();

    const cleanup = () => {
      // Dispose of resources when the component is unmounted
      renderer.domElement.remove();
      renderer.dispose();
    };

    const animate = () => {
      const time = clock.getElapsedTime();

      for (let i = 0; i < count; i++) {
        const x = geometry.attributes.position.getX(i);
        const y = geometry.attributes.position.getY(i);

        const anim1 = 0.25 * Math.sin(x + time * 0.3);
        const anim2 = 0.35 * Math.sin(x * 1 + time * 0.3);
        const anim3 = 0.1 * Math.sin(y * 15 + time * 0.3);

        geometry.attributes.position.setZ(
          i,
          anim1 + anim2 + anim3
        );
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }

    camera.position.z = 1;
    animate()

    return cleanup;
  })

  const movieListsHTML = (colIndex: number) => <ul className={`inline-grid grid-cols-${colIndex} relative justify-center items-center top-0 mx-auto gap-4`}>
    {
      reviews
        .sort((a: FilmReviewProps, b: FilmReviewProps) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 4).map((review: FilmReviewProps) => (
          <li className="apple-linear-glass rounded-2xl util-box-shadow-purple-mode flex flex-row justify-between review-section md:px-8 md:py-8 md:mt-8" key={review.author}>
            <Image
              src={`https://image.tmdb.org/t/p/w500/${review.movieObject?.poster_path}`}
              width={200}
              height={150}
              alt=""
              className="relative object-cover md:ml-2"
            >
            </Image>
            <div className="flex flex-col justify-center h-max review-section relative md:ml-8">
              <h1 className="text-xl font-semibold text-white md:mt-6  md:w-[300px] text-gradient-cyan-blue">{review.movieObject?.title}</h1>
              <span className="text-white text-left opacity-50 text-sm md:mt-2">{formatHistoryDate(review.createdAt)}</span>
              <h2 className="text-sm font-bold text-white md:mt-6">
                Review by <span className="text-ai4biz-green-quite-light font-semibold">{review.author}</span>
                <span className="text-white md:ml-8 font-bold">Rating:</span> <span className="font-medium md:ml-2">{review.author_details.rating} / 10</span>
              </h2>
              <h2 className="text-[0.8rem] font-light text-gray-400 md:mt-2 relative md:w-[300px] ellipsis text-justify">{review.content}</h2>
            </div>
          </li>
        ))
    }
  </ul>

  return (
    <div className="relative top-0">
      <div className="background-custom-body" style={{ height: "fit-content" }}>
        {/* <div className="absolute opacity-30 bg-no-repeat z-11"></div> */}
        {loading
          ? <div className="text-white text-center font-bold text-4xl absolute translate-x-[-50%] translate-y-[-50%] top-[50%] left-[50%] m-0">Loading <CircularProgress color="secondary" /></div>
          : <div className="relative flex flex-col top-0">
            <h1 className="text-white text-center relative md:mt-52 text-2xl italic">Welcome back, <span className="font-semibold text-ai4biz-green-quite-light">{customer?.username}</span>. Here’s what we’ve been watching…
            </h1>
          </div>
        }
        {error && <p className="text-white">Error: {error.message}</p>}
        <div className="flex flex-row">
          <div className="blob relative"></div>
          {/* <div className="blob-linear-green-blue relative"></div> */}
        </div>

        { /** Reviews List */}
        {reviews.length > 0 && (
          <div className="flex flex-col justify-center items-center relative md:mt-12">
            <h1 className="text-white text-2xl font-semibold relative text-left">Popular Reviews On This Week</h1>
            {reviews.length > 0 && reviews.length < 2
              ? movieListsHTML(1)
              : movieListsHTML(2)}
          </div>
        )}

        { /** Movie List */}
        {movies.length > 0 && (
          <div className="flex flex-col justify-center relative md:mt-16">
            <h1 className="text-white text-2xl font-semibold relative text-center">Popular Movies On This Week</h1>
            <div className="flex flex-row justify-center items-center relative md:mt-12">
              <h1 className="text-white text-[1.2rem] font-semibold relative text-left">View By</h1>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white" value={year} onChange={handleOnChangeYear}>
                {yearOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>

              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white" onChange={handleOnChangeRating}>
                <option value="" disabled selected className="text-center">Rating</option>
                {ratingOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white" value={popular} onChange={handleOnChangePopular}>
                {popularOptions.map((option) => (
                  <option value={option.value} className="text-center">{option.label}</option>
                ))}
              </select>
              <select className="md:ml-6 text-gray-900 text-sm relative rounded-2xl block md:w-[120px] md:p-1.5 apple-linear-glass dark:placeholder-gray-400 dark:text-white" onChange={handleOnChangeGenre}>
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
            <ul className="grid grid-cols-3 md:mx-auto relative gap-4 justify-center items-center md:mt-8">
              {[...movies]
                .slice(0, 6)
                .map((movie) => (
                  <li className="hover:scale-105 duration-500 rotate_3d m-0 rounded-2xl">
                    <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-obj">
                      <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}

        {recommendedMovies.length > 0 && (
          <div className="flex flex-col justify-center relative md:mt-16">
            <h1 className="text-white text-2xl font-semibold relative text-center">Recommended For You</h1>
            <ul className="grid grid-cols-3 md:mx-auto relative gap-4 justify-center items-center md:mt-8">
              {[...recommendedMovies]
                  .sort((a, b) => b.popularity - a.popularity) 
                  .slice(0, 6)
                  .map((movie) => (
                    <li className=" m-0 rounded-2xl">
                      <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-obj">
                        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )

}


{/* 
          <Pagination
            count={Math.ceil(movies.length / numberOfMoviesPerPage)}
            page={currentPage}
            onChange={(event, page) => paginate(page)}
            size="large"
            color="primary"
            className="relative md:top-[10rem]"
            style={{ color: "#000", background: "#fff" }} /> */}