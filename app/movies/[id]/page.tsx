"use client";
import React, { useState, useEffect, ReactElement, useRef } from "react";
import { usePathname } from "next/navigation";
import { Cast, CrewProps, FilmReviewProps, Movie, User } from "@/types";
import {
  HOST_PRODUCT,
  getCasts,
  getMe,
  getMovie,
  getReviewsByMovieId,
  saveReviewsByMovieId,
} from "../../../utils/clients.utils";
import Image from "next/image";
import Casts from "@/components/casts.component";
import Related from "@/components/related.component";
import { useRouter } from "next/navigation";
import fetch from "node-fetch";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputLabel,
  Modal,
  Snackbar,
  TextField,
  TextareaAutosize,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useAuth } from "../../../components/context/AuthContext";
import CloseIcon from "@mui/icons-material/Close";
import gsap from "gsap";
import { formatHistoryDate } from "@/utils/convert.utils";
import axios from "axios";
import Link from "next/link";

export default function Page({ params }: { params: { id: string } }) {
  const [choice, setChoice] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [casts, setCasts] = useState<Cast[] | null>(null);
  const [crews, setCrews] = useState<CrewProps[] | null>(null);
  const [reviews, setReviews] = useState<FilmReviewProps[]>([]);
  const [openDirectorInfo, setOpenDirectorInfo] = useState<boolean>(false);
  const [openPostReviewForm, setPostReviewForm] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = React.useState("");
  const [customer, setCustomer] = useState<User | null>(null);
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [warningMessage, setWarningMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [directorInfo, setDirectorInfo] = useState<Cast | null>();
  const [expandedBiography, setExpandedBiography] = useState(false);

  const toggleBiographyExpansion = () => {
    setExpandedBiography(!expandedBiography);
  };

  const id = params.id;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const formErrors = errors as any;

  const handleOpenDirectorInfo = async () => {
    try {
      const response = await axios.get(`https://api.themoviedb.org/3/person/${director?.id}`, {
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY',
        },
      });
      const data = response.data;
      setDirectorInfo(data as Cast);
      console.log(directorInfo)
    } catch (error) {
      console.error('Error fetching cast details');
      // You might want to throw the error here if needed
    }
    setOpenDirectorInfo(true);
  }
  const handleCloseDirectorInfo = () => {
    setOpenDirectorInfo(false);
    setExpandedBiography(false);
  }
  const handleOpenPostReviewForm = () => setPostReviewForm(true);
  const handleClosePostReviewForm = () => setPostReviewForm(false);

  const [openToastWarning, setOpenToastWarning] = useState<boolean>();
  const [openToastSuccesss, setOpenToastSuccess] = useState<boolean>();

  const handleOpenToastWarning = () => {
    setOpenToastWarning(true);
  };

  const handleOpenToastSuccess = () => {
    setOpenToastSuccess(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenToastWarning(false);
    setOpenToastSuccess(false);
  };

  const hanndleOnChangeRatingSelector = (event: any) => {
    console.log("Hello = ", event.target.value);
  };

  const handleAddToWatchlist = async () => {

    setIsInWatchlist(true);

    try {
      const response = await axios.patch(
        `${HOST_PRODUCT}/api/v1/users/${id}/watchlists`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpenToastSuccess(true);
      setSuccessMessage(response.data.message);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 404) {
          setOpenToastWarning(true);
          setWarningMessage(data.message);
        } else {
          setOpenToastWarning(true);
          setWarningMessage(error.response.data);
        }
      } else {
        setOpenToastWarning(true);
        setWarningMessage("Unknown error!");
      }
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      const response = await axios.delete(
        `${HOST_PRODUCT}/api/v1/users/${id}/un-watchlists`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      setOpenToastSuccess(true);
      setSuccessMessage(response.data.message);
      setIsInWatchlist(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;

        if (status === 404) {
          setOpenToastWarning(true);
          setWarningMessage(data.message);
        } else {
          setOpenToastWarning(true);
          setWarningMessage(error.response.data);
        }
      } else {
        setOpenToastWarning(true);
        setWarningMessage("Unknown error!");
      }
    }
  };

  const director = crews?.find(({ job }) => job === "Director");
  const RATING_CONSTANTS = [
    1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5,
    2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.1,
    4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9, 5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6,
    5.7, 5.8, 5.9, 6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9, 7, 7.1, 7.2,
    7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9, 8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7,
    8.8, 8.9, 9, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 10,
  ];

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
    outline: "none",
    overflow: "auto",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
  };

  const ISO_DATE = new Date().toISOString().toString();

  const onSubmit = (data: FieldValues) => {
    setError("content", { type: "", message: "" });
    setError("tag", { type: "", message: "" });
    setError("rating", { type: "", message: "" });

    console.log("Alo alo hehe = ", data.content);
    const reviewData: FilmReviewProps = {
      content: data.content,
      author: customer !== null ? customer.username : "",
      author_details: {
        reviewerId: customer,
        name:
          customer !== null ? customer.firstName + " " + customer.lastName : "",
        username: customer !== null ? customer.username : "",
        avatar_path: customer !== null ? customer.photo : "",
        rating: Number(data.rating),
      },
      movie: id,
      tag: data.tag,
      createdAt: ISO_DATE,
      updatedAt: ISO_DATE,
    };
    console.log("reviewData = ", reviewData);
    setOpenToastSuccess(true);
    setSuccessMessage("Review posted successfully!");
    saveReviewsByMovieId(id, reviewData)
      .then(() => {
        handleClosePostReviewForm();
        // Reload the page
        window.location.reload();
      })
      .catch((error) => {
        // Handle error if needed
        console.error("Error saving review:", error);
      });
  }


  useEffect(() => {
    if (isAuthenticated() && user !== null) {
      const fetchData = async () => {
        try {
          const json = await getMe();
          setCustomer(json.data);
          if (customer?.watchLists.includes(id)) {
            setIsInWatchlist(true);
          }
          console.log("Customer: ", customer)
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
      router.push("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = (await getMovie(id)) as Movie;
      setMovie(movieData);
      console.log(movieData);
    };
    const fetchCasts = async () => {
      try {
        const castData = await getCasts(id);
        const castArr: Cast[] = castData.cast;
        const crewArr: CrewProps[] = castData.crew;
        setCasts(castArr);
        setCrews(crewArr);
      } catch (error) {
        console.error("Error fetching casts:", error);
      }
    };
    const fetchReviewsByMovieId = async () => {
      const reviewsData = (await getReviewsByMovieId(
        Number(id)
      )) as FilmReviewProps[];
      console.log("Reviews data = ", reviewsData);
      setReviews(reviewsData);
    };
    const checkIsInWatchlists = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/v1/users/${id}/check-watchlists`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        console.log("Check is in watchlists: ", response.data.isInWatchLists)
        setIsInWatchlist(response.data.isInWatchLists);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    }
    fetchMovie();
    checkIsInWatchlists();
    fetchCasts();
    fetchReviewsByMovieId();
  }, [id]);


  useEffect(() => {
    if (reviews.length > 0) {
      const reviewsSection = Array.from(
        document.querySelectorAll(".review-section")
      );
      console.log(reviewsSection);
      gsap.set(reviewsSection, {
        opacity: 0,
        y: -50,
      });
      gsap.to(reviewsSection, {
        y: 0,
        stagger: 0.2,
        duration: 0.75,
        opacity: 1,
      });
    }
  }, [reviews.length > 0, choice]);

  useEffect(() => {
    if (choice === 1) {
      const castKeys = Array.from(document.querySelectorAll(".cast-key"));
      gsap.set(castKeys, {
        opacity: 0,
        y: -50,
      });
      gsap.to(castKeys, {
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        opacity: 1,
      });
    }
    if (choice === 2) {
      const labelsConvertToArr = Array.from(
        document.querySelectorAll(".genre-label")
      );
      gsap.set(labelsConvertToArr, {
        opacity: 0,
        y: -50,
      });
      gsap.to(labelsConvertToArr, {
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        opacity: 1,
      });
    }

    if (choice === 3 || choice === 4) {
      const detailKeys = Array.from(document.querySelectorAll(".details-key"));

      gsap.set(detailKeys, {
        opacity: 0,
        x: -50,
      });
      gsap.to(detailKeys, {
        x: 0,
        stagger: 0.2,
        duration: 0.8,
        opacity: 1,
      });
    }
  }, [choice]);

  useEffect(() => {
    const container = document.querySelector(".three_bg");
    console.log("This is container = ", container);

    const loader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const camera: any = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGL1Renderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);

    const geometry: any = new THREE.BoxGeometry(5, 4, 1);
    const material = new THREE.MeshBasicMaterial({
      map: loader.load(
        "https://www.ecommercestrategies.co.uk/wp-content/uploads/brand-green-blue-grainy-gradient.png"
      ),
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

        geometry.attributes.position.setZ(i, anim1 + anim2 + anim3);
        geometry.computeVertexNormals();
        geometry.attributes.position.needsUpdate = true;
      }
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    camera.position.z = 1;
    animate();

    return cleanup;
  });

  if (!movie) {
    return <div className="text-white">Loading...</div>;
  }
  const date = new Date(movie.release_date);
  const action = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="error"
        onClick={handleClose}
      >
        <CloseIcon fontSize="large" className="hover-scale-105 duration-500" />
      </IconButton>
    </React.Fragment>
  );

  console.log(reviews);

  return (
    <div className=" flex flex-col flex-wrap md:mt-8 justify-center container md:mx-auto">
      {/* <div className='three_bg opacity-10 absolute top-0 transparent'></div> */}
      <div className=' grid grid-cols-1 md:grid-cols-4 gap-3'>
        <div className=" flex flex-col col-span-1">
          <div className="flex justify-center col-span-3 py-2"><Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image></div>
          <button
            onClick={handleOpenPostReviewForm}
            type="button"
            className="relative linear-purple-pink rounded-lg  focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-3 me-2 mb-2 hover:scale-110 duration-500 md:mt-8">Post the review</button>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          <div className="col-span-1"></div>
          {isInWatchlist && (
            <button
              onClick={handleRemoveFromWatchlist}
              type="button"
              className="relative bg-gradient-to-r from-red-400 to-pink-500 rounded-lg  focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-3 me-2 mb-2 hover:scale-110 duration-500">Remove from watchlist</button>
          )}
          {!isInWatchlist && (
            <button
              onClick={handleAddToWatchlist}
              type="button"
              className="relative linear-blue rounded-lg  focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-3 me-2 mb-2 hover:scale-110 duration-500">Add to Watchlist</button>
          )}
        </div>
        <div className="col-span-3 text-white content-center grid grid-cols-4 md:ml-24">
          <div className="grid grid-cols-1 md:grid-cols-4 my-5 col-span-4">
            <h1 className="col-span-1 text-3xl font-bold">
              {movie.title}
            </h1>
            <div className="md:flex justify-center col-span-1">
              <p className=" font-semibold text-white px-10 md:mt-2">
                {date.getFullYear()}
              </p>
            </div>

            <p className=" col-span-1 font-regular text-sm text-white md:px-10 md:mt-2 md:w-[1000px]">
              Directed by{" "}
              <span
                className="text-ai4biz-green-quite-light text-xl font-bold cursor-pointer hover:scale-120 duration-500"
                onClick={handleOpenDirectorInfo}
              >
                {director?.name}
              </span>
            </p>

            <p className="col-span-1 md:col-span-3 text-sm text-gray-300 md:max-w-6xl text-justify leading-6 md:mt-2">
              {movie.overview}
            </p>
            <div className="col-span-1"></div>
          </div>

          <div className="md:w-[1200px] col-span-4">
            <div className="flex flex-row  font-bold text-gray-400 my-5 grid-container md:space-x-5">
              <h2
                className="text-[0.8rem] font-medium hover:opacity-50 duration-500 cursor-pointer"
                onClick={() => setChoice(1)}
              >
                Cast
              </h2>
              <h2
                className="text-[0.8rem] font-medium hover:opacity-50 duration-500 cursor-pointer"
                onClick={() => setChoice(2)}
              >
                Genres
              </h2>
              <h2
                className="text-[0.8rem] font-medium hover:opacity-50 duration-500 cursor-pointer"
                onClick={() => setChoice(3)}
              >
                Details
              </h2>
              <h2
                className="text-[0.8rem] font-medium hover:opacity-50 duration-500 cursor-pointer"
                onClick={() => setChoice(4)}
              >
                Release
              </h2>
            </div>
            <div className="flex flex-col space-x-3 ">
              {/*Need fixing for mobile UI */}
              {choice == 1 && (
                <div className="grid grid-cols-3 md:mr-auto md:grid-cols-8 gap-2 relative">
                  {/* <Casts id={id} /> */}
                  {casts?.slice(0, 6).map((cast, index) => {
                    if (cast.profile_path !== null) {
                      return (
                        <div className="block md:w-28 h-max cast-key col-span-1 justify-center">
                          <Image
                            className="object-contains"
                            src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`}
                            alt="cast-img"
                            width={80}
                            height={80}
                          ></Image>
                          <div className="relative md:mt-4 md:w-[400px]">
                            <h2 className="text-[0.7rem] font-medium text-white md:w-full">
                              {cast.name}
                            </h2>
                          </div>
                        </div>
                      );
                    }
                  })}
                  <div className="col-span-1 grid place-items-center">
                    <button
                      onClick={() => router.push(`/movies/${id}/casts`)}
                      type="button"
                      className="linear-purple rounded-full focus:outline-none text-white text-[1.8rem] font-medium text-sm px-8 py-4 me-2 mb-2 hover:scale-110 duration-500 hover:py-7 hover:px-8"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              {choice == 2 && (
                <>
                  <div>
                    <div className="grid grid-cols-6 gap-2">
                      {movie.genres.map((genre) => (
                        <button
                          className="genre-label ocean-linear-bg rounded-lg py-[0.25rem] text-[0.75rem]"
                          style={{}}
                        >
                          {genre.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {choice == 3 && (
                <>
                  <div>
                    <h3
                      className="text-sm font-semibold tracking-wide md:mt-2 details-key"
                      style={{ color: "#64CCC5" }}
                    >
                      Original Title:{" "}
                      <span className="md:ml-2 font-medium text-white details-value">
                        {movie.original_title}
                      </span>{" "}
                    </h3>
                    <h3
                      className="text-sm font-semibold tracking-wide md:mt-2 details-key"
                      style={{ color: "#64CCC5" }}
                    >
                      Original Language:{" "}
                      <span className="md:ml-2 font-medium text-white details-value">
                        {movie.original_language}
                      </span>
                    </h3>
                  </div>
                </>
              )}
              {choice == 4 && (
                <>
                  <div>
                    <h3
                      className="text-sm font-semibold tracking-wide md:mt-2 details-key"
                      style={{ color: "#64CCC5" }}
                    >
                      Release Date:{" "}
                      <span className="md:ml-2 font-medium text-white details-value">
                        {movie.release_date}
                      </span>{" "}
                    </h3>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="block col-span-4">
            <div className="flex flex-row justify-start items-start md:mt-16 col-span-2">
              <h1 className="text-2xl font-bold relative">Highest Rating Reviews</h1>
              <button
                onClick={() => router.push(`/movies/${id}/reviews`)}
                type="button"
                className="relative glass-effect rounded-lg md:w-[220px] focus:outline-none md:ml-8 text-white text-[1.8rem] font-medium text-sm px-1 py-2 me-2 mb-2 hover:scale-110 duration-500"
              >
                More
              </button>
            </div>
            {reviews.length > 0 &&
              reviews
                .slice(0, 4)
                .sort((a: FilmReviewProps, b: FilmReviewProps) =>
                  b.author_details.rating - a.author_details.rating
                )
                .map((review: FilmReviewProps) => review.author_details.reviewerId?._id !== undefined && (
                  <div className='flex flex-col md:w-[500px] h-max review-section'>
                    <div className="flex flex-row justify-center items-center">
                      <div className="md:mt-4">
                        {/* <p className="text-white">/visitor/{review.author_details.reviewerId._id}</p> */}
                        <Link href={`/visitor/${review.author_details.reviewerId._id}`}>
                          <Image src={review.author_details.avatar_path} width={50} height={50} style={{ height: "50px" }} className="rounded-full object-cover" alt="" objectFit="cover"
                            objectPosition="center center"></Image>
                        </Link>

                      </div>
                      {/* {review.author_details.reviewerId !== undefined && <p className="text-white">{review.author_details.reviewerId.email}</p>} */}
                      <div className="md:w-full">
                        <h2 className='text-sm font-aold text-white md:mt-6 md:ml-4'>
                          Review by <Link href={`/visitor/${review.author_details.reviewerId._id}`}>
                            <span className='text-ai4biz-green-quite-light font-semibold'>{review.author}</span>
                          </Link>
                          <span className='text-white md:ml-8 font-bold'>Rating:</span>
                          <span className='md:ml-2'>{review.author_details.rating.toFixed(1)}/10</span>
                        </h2>
                      </div>
                    </div>
                    <span className='text-white opacity-50 text-[0.7rem] md:ml-16'>{formatHistoryDate(review.createdAt)}</span>
                    <h2 className='text-sm font-regular text-gray-300 ellipsis md:mt-2 line-clamp-4'>{review.content}</h2>
                  </div>
                ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col my-10 relative md:top-[2rem]">
        <h1 className="text-2xl font-bold text-white text-center">
          Recommended similar films
        </h1>
        <Related id={id}></Related>
      </div>
      <Modal
        open={openDirectorInfo}
        onClose={handleCloseDirectorInfo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        style={{ borderRadius: 'xl' }}

      >
        <Box
          sx={style}
          style={
            {
              // backgroundImage:
              //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
            }
          }
          className="linear-reusable util-box-shadow-purple-mode"
        >
          <div className="z-10 relative items-center justify-center">
            <div className='grid grid-cols-2 gap-5'>
              <Image
                src={`https://image.tmdb.org/t/p/w500/${directorInfo?.profile_path}`}
                width={300}
                height={300}
                className="rounded-sm md:mx-auto md:my-auto"
                alt={`${directorInfo?.name}`}
              ></Image>
              <div className='flex flex-col'>
                <h1 className="text-white font-bold text-[1.6rem]">
                  {directorInfo?.name}
                </h1>
                <p className="text-white md:mt-2 font-thin">
                  D.O.B: {directorInfo?.birthday || "N/A"}
                </p>
                <p className="text-white md:mt-2 font-thin">Place of Birth: {directorInfo?.place_of_birth || "N/A"}</p>
                <p className="text-white text-sm italic md:mt-5">
                  {directorInfo?.biography && directorInfo?.biography.length > 1000
                    ? expandedBiography
                      ? directorInfo?.biography
                      : `${directorInfo?.biography.slice(0, 1000)}...`
                    : directorInfo?.biography}
                  {directorInfo?.biography && directorInfo?.biography.length > 1000 && (
                    <button
                      className='text-blue-500 hover:underline focus:outline-none'
                      onClick={toggleBiographyExpansion}
                    >
                      {expandedBiography ? ' Read Less' : ' Read More'}
                    </button>
                  )}
                </p>
              </div>
            </div>




          </div>
        </Box>
      </Modal>

      <Modal
        open={openPostReviewForm}
        onClose={handleClosePostReviewForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute" as "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 884,
            height: 600,
            bgcolor: "background.paper",
            border: "none",
            borderRadius: "0.5rem",
            boxShadow: 24,
            p: 4,
            outline: "none",
            overflow: "auto",
          }}
          width={600}
          style={
            {
              // backgroundImage:
              //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
            }
          }
          className="review-form-bg kophaigu"
        >
          <div className="z-10 relative md:mx-auto flex flex-row justify-around items-center">
            <Image
              src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
              className="relative object-contain md:mt-12"
              width={300}
              height={500}
              alt={movie.title}
            ></Image>

            <form
              className="md:ml-16"
              action={"#"}
              onSubmit={handleSubmit(onSubmit)}
            >
              <FormControl className="relative">
                <p className="text-white font-regular text-sm opacity-70">
                  Create review, then create a new bonding
                </p>
                <h1 className="text-white md:text-2xl font-bold italic md:mt-2">
                  "{movie.title}"
                </h1>
                <div className="flex justify-center items-center relative md:mt-8">
                  <h3 className="text-sm text-white">Rating: </h3>
                  <select
                    {...register("rating", {
                      required: "Please select a rating",
                    })}
                    className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[80px] md:py-1 bg-[#262A33] dark:placeholder-gray-400 dark:text-white"
                    onChange={hanndleOnChangeRatingSelector}
                  >
                    {RATING_CONSTANTS.map((ratingValue) => (
                      <option
                        value={ratingValue}
                        className="text-center"
                        style={{ color: "#9095A0" }}
                      >
                        {ratingValue}
                      </option>
                    ))}
                  </select>
                  <span className="text-white text-sm md:ml-2">/ 10</span>
                </div>
                <div className="mt-5">
                  <label htmlFor="review" className="text-white text-[0.8rem]">
                    Your review content
                  </label>
                  <textarea
                    {...register("content", {
                      required: "Review cannot be empty",
                    })}
                    style={{
                      borderRadius: "8px",
                      border: "none",
                      background: "rgba(222, 225, 230, 0.20)",
                      color: "white",
                      opacity: "100%",
                    }}
                    className="md:mt-2 block md:text-sm md:w-[350px] p-2 border rounded border-gray-300 focus:outline-none px-8 py-8"
                    placeholder="What do you think about this film ?"
                  ></textarea>
                </div>
                <div className="mt-5">
                  <label htmlFor="tag" className="text-white text-[0.8rem]">
                    Your tags
                  </label>
                  <input
                    {...register("tag")}
                    style={{
                      borderRadius: "8px",
                      border: "none",
                      background: "rgba(222, 225, 230, 0.20)",
                      color: "white",
                      opacity: "100%",
                    }}
                    className="md:mt-2 block md:text-[0.8rem] md:w-[350px] p-2 border rounded border-gray-300 focus:outline-none px-4 py-2.5"
                    placeholder="Ex. neflix or homecinema"
                  ></input>
                </div>
                <button
                  // onClick={() => console.log("Clicked")}
                  type="submit"
                  className="relative button-linear-gradient-red  rounded-lg md:top-[0rem] md:w-full focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-2 me-2 mb-2 hover:scale-105 duration-500 md:mt-8"
                >
                  Post
                </button>
              </FormControl>
            </form>
          </div>
        </Box>
      </Modal>

      <Snackbar
        style={{}}
        open={openToastWarning}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
        message={warningMessage}
        action={action}
        ContentProps={{
          sx: {
            paddingX: "4rem",
            paddingY: "2rem",
            borderRadiusL: "8px",
            background:
              "linear-gradient(270deg, #072434 3.17%, #000 50.35%, #072434 97.53%)",
            color: "#FF6D60",
            fontFamily: "Poppins",
            fontWeight: "bold",
            fontSize: "1.2rem",
          },
        }}
      />

      <Snackbar
        style={{

        }}
        open={openToastSuccesss}
        anchorOrigin={{ vertical: "top", "horizontal": "center" }}
        autoHideDuration={6000}
        onClose={handleClose}
        message={successMessage}
        action={action}
        ContentProps={{
          sx: {
            paddingX: "4rem",
            paddingY: "2rem",
            borderRadiusL: "8px",
            background: "linear-gradient(270deg, #072434 3.17%, #000 50.35%, #072434 97.53%)",
            color: "#09b311",
            fontFamily: "Poppins",
            fontWeight: "bold",
            fontSize: "1.2rem",
          }
        }}
      />



    </div>
  );
}