"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Cast, CrewProps, FilmReviewProps, Movie } from '@/types';
import { getCasts, getMovie, getReviewsByMovieId } from '../../../utils/clients.utils';
import Image from 'next/image';
import Casts from '@/components/casts.component';
import Related from '@/components/related.component';
import { useRouter } from 'next/navigation';
import fetch from 'node-fetch';
import { Box, FormControl, Grid, Input, InputLabel, Modal, TextField, TextareaAutosize, Typography } from '@mui/material';

export default function Page({ params }: { params: { id: string } }) {
  const [choice, setChoice] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [casts, setCasts] = useState<Cast[] | null>(null);
  const [crews, setCrews] = useState<CrewProps[] | null>(null);
  const [reviews, setReviews] = useState<FilmReviewProps[]>([]);
  const [openDirectorInfo, setOpenDirectorInfo] = useState<boolean>(false);
  const [openPostReviewForm, setPostReviewForm] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = React.useState("");

  const id = params.id;
  const router = useRouter();

  const handleOpenDirectorInfo = () => setOpenDirectorInfo(true);
  const handleCloseDirectorInfo = () => setOpenDirectorInfo(false);

  const handleOpenPostReviewForm = () => setPostReviewForm(true);
  const handleClosePostReviewForm = () => setPostReviewForm(false);

  const handleChange = (event: any) => {
    setReviewInput(event.target.value);
  };

  const hanndleOnChangeRatingSelector = (event: any) => {
    console.log("Hello = ", event.target.value);
  }

  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovie(id) as Movie;
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
        console.error('Error fetching casts:', error);
      }
    };
    const fetchReviewsByMovieId = async () => {
      const reviewsData = await getReviewsByMovieId(Number(id)) as FilmReviewProps[];
      console.log("Reviews data = ", reviewsData);
      setReviews(reviewsData);
    }
    fetchMovie();
    fetchCasts();
    fetchReviewsByMovieId();
  }, [id]);
  if (!movie) {
    return <div>Loading...</div>;
  }
  const date = new Date(movie.release_date);
  const director = crews?.find(({ job }) => job === 'Director');
  const RATING_CONSTANTS = [
    1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9,
    2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9,
    3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9,
    4, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9,
    5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9,
    6, 6.1, 6.2, 6.3, 6.4, 6.5, 6.6, 6.7, 6.8, 6.9,
    7, 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9,
    8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8, 8.9,
    9, 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9,
    10]

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
    outline: 'none',
    overflow: "auto",
  };

  return (
    <div className="relative flex flex-col flex-wrap md:top-[15rem] justify-center">
      <div className='grid grid-cols-2 gap-3 w-4/5'>
        <div className="md:pl-52 flex flex-col">
          <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image>
          <button
            onClick={handleOpenPostReviewForm}
            type="button"
            className="relative bg-dark-green rounded-lg md:top-[0rem] md:left-[8rem] md:w-[220px] focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-3 me-2 mb-2 hover:scale-110 duration-500 md:mt-8">Post the review</button>
        </div>
        <div className="text-white pr-52 content-center">
          <div className="flex my-5 md:w-[1200px]">
            <h1 className="text-2xl font-bold pr-10 md:w-[400px]">{movie.title}</h1>
            <p className="font-light text-gray-400 px-10 md:mt-2">{date.getFullYear()}</p>
            <p className="font-light text-gray-400 px-10 md:mt-2">Directed by <span className='text-white font-bold cursor-pointer hover:scale-120 duration-500' onClick={handleOpenDirectorInfo}>{director?.name}</span></p>
          </div>
          <p className="text-[0.75rem] text-gray-400 md:w-96 text-justify">{movie.overview}</p>
          <div className="">
            <div className="flex flex-row space-x-5 font-bold text-gray-400 my-5">
              <h2 className='text-[0.75rem]' onClick={() => setChoice(1)}>Cast</h2>
              <h2 className='text-[0.75rem]' onClick={() => setChoice(2)}>Genres</h2>
              <h2 className='text-[0.75rem]' onClick={() => setChoice(3)}>Details</h2>
              <h2 className='text-[0.75rem]' onClick={() => setChoice(4)}>Release</h2>
            </div>
            <div className="flex flex-col space-x-3">
              {choice == 1 && (
                <div className='flex flex-row justify-center items-center relative md:left-[10rem] md:top-[1rem]'>
                  <div className='flex gap-3'>
                    {/* <Casts id={id} /> */}
                    {casts?.slice(0, 6).map((cast, index) => {
                      if (cast.profile_path !== null) {
                        return <div className='flex flex-col md:w-28 h-max'>
                          <Image className='object-contains' src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={80} height={80}></Image>
                          <div className='relative md:mt-4 md:w-[400px]'>
                            <h2 className='text-[0.7rem] font-medium text-white md:w-full'>{cast.name}</h2>
                          </div>
                        </div>
                      }
                    })}
                  </div>
                  <button
                    onClick={() => router.push(`/movies/${id}/casts`)}
                    type="button"
                    className="bg-dark-green rounded-full md:top-[0rem] md:left-[2rem] md:w-[220px] focus:outline-none text-white text-[1.8rem] font-medium text-sm px-5 py-4 me-2 mb-2 hover:scale-110 duration-500 hover:py-8 hover:px-8">+</button>

                </div>)}
              {choice == 2 && (
                <>
                  <div>
                    {movie.genres.map((genre) => (<p className='text-sm text-gray-400'>{genre.name}</p>))}
                  </div>

                </>)}
              {choice == 3 && (
                <>
                  <div>
                    <h3 className='text-sm text-gray-400'>Original Title: {movie.original_title} </h3>
                    <h3 className='text-sm text-gray-400'>Original Language: {movie.original_language}</h3>
                  </div>

                </>)}
              {choice == 4 && (
                <>
                  <div>
                    <p className='text-sm text-gray-400'>Release date: {movie.release_date}</p>
                  </div>

                </>)}
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold my-10 relative md:top-[2rem]">Recent Reviews</h1>
            {reviews.length > 0 &&
              reviews
                .slice(0, 4)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((review: FilmReviewProps) => (
                  <div className='flex flex-col md:w-[500px] h-max'>
                    <h2 className='text-sm font-bold text-white md:mt-6'>Review by <span className='text-ai4biz-green-quite-light font-semibold'>{review.author}</span></h2>
                    <h2 className='text-sm font-light text-gray-400 ellipsis md:mt-2'>{review.content}</h2>
                  </div>
                ))}
          </div>

        </div>
      </div>
      <div className='flex flex-col my-10 relative md:top-[8rem]'>
        <h1 className="text-2xl font-bold text-gray-400 text-center">Recommended similar films</h1>
        <Related id={id}></Related>
      </div>
      <Modal
        open={openDirectorInfo}
        onClose={handleCloseDirectorInfo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={style} style={{
          // backgroundImage:
          //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
        }} className="linear-reusable">
          <div className='z-10 relative md:mx-auto'>
            <Image src={`https://image.tmdb.org/t/p/w500/${director?.profile_path}`} width={250} height={250} className='rounded-sm md:m-auto' alt={`${director?.original_name}`}></Image>
            <h1 className='text-white text-center md:mt-8 text-[1.6rem]'>{director?.name}</h1>
            <p className='text-white text-center md:mt-2'>{director?.known_for_department}</p>
            <p className='text-white text-center md:mt-2'>{director?.job}</p>
          </div>
          <div className="glowing">
            <span className="--i:1;"></span>
            <span className="--i:2;"></span>
            <span className="--i:3;"></span>
          </div>

          <div className="glowing">
            <span className="--i:1;"></span>
            <span className="--i:2;"></span>
            <span className="--i:3;"></span>

          </div>

          <div className="glowing">
            <span className="--i:1;"></span>
            <span className="--i:2;"></span>
            <span className="--i:3;"></span>

          </div>
          <div className="glowing">
            <span className="--i:1;"></span>
            <span className="--i:2;"></span>
            <span className="--i:3;"></span>
          </div>

        </Box>
      </Modal>

      <Modal
        open={openPostReviewForm}
        onClose={handleClosePostReviewForm}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >

        <Box sx={{
          position: 'absolute' as 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 884,
          height: 600,
          bgcolor: 'background.paper',
          border: 'none',
          borderRadius: "0.5rem",
          boxShadow: 24,
          p: 4,
          outline: 'none',
          overflow: "auto",
        }} width={600} style={{
          // backgroundImage:
          //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
        }} className="review-form-bg">
          <div className='z-10 relative md:mx-auto flex flex-row justify-around items-center'>
            <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} className='relative object-contain md:mt-12' width={300} height={500} alt={movie.title}></Image>

            <FormControl className='relative'>
              <p className='text-white font-regular text-sm opacity-70'>Create review, then create a new bonding</p>
              <h1 className='text-white md:text-2xl font-bold italic md:mt-2'>"{movie.title}"</h1>
              <div className='flex justify-center items-center relative md:mt-8'>
                <h3 className='text-sm text-white'>Rating: </h3>
                <select className="md:ml-6 text-gray-900 text-sm relative rounded-lg block md:w-[80px] md:py-1 bg-[#262A33] dark:placeholder-gray-400 dark:text-white" onChange={hanndleOnChangeRatingSelector}>
                  {RATING_CONSTANTS.map((ratingValue) => (
                    <option value={ratingValue} className="text-center" style={{ color: "#9095A0" }}>{ratingValue}</option>
                  ))}
                </select>
                <span className='text-white text-sm md:ml-2'>/ 10</span>
              </div>
              <div className="mt-5">
                <label htmlFor='review' className='text-white text-[0.8rem]'>Your review content</label>
                <textarea style={{
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(222, 225, 230, 0.20)",
                  color: "white",
                  opacity: "100%",
                }} className="md:mt-2 block md:text-sm md:w-[350px] p-2 border rounded border-gray-300 focus:outline-none px-8 py-8" placeholder="What do you think about this film ?"></textarea>
              </div>
              <div className="mt-5">
                <label htmlFor='tag' className='text-white text-[0.8rem]'>Your tags</label>
                <input style={{
                  borderRadius: "8px",
                  border: "none",
                  background: "rgba(222, 225, 230, 0.20)",
                  color: "white",
                  opacity: "100%",
                }} className="md:mt-2 block md:text-[0.8rem] md:w-[350px] p-2 border rounded border-gray-300 focus:outline-none px-4 py-2.5" placeholder="What do you think about this film ?"></input>
              </div>
              <button
                onClick={() => console.log("Clicked")}
                type="button"
                className="relative button-linear-gradient-red  rounded-lg md:top-[0rem] md:w-full focus:outline-none text-white text-[1.8rem] font-medium text-sm px-1 py-2 me-2 mb-2 hover:scale-105 duration-500 md:mt-8">Post</button>
            </FormControl>
          </div>

        </Box>
      </Modal>

      {/* <div className="glowing">

        <span className="--i:1;"></span>

        <span className="--i:2;"></span>

        <span className="--i:3;"></span>

      </div>

      <div className="glowing">

        <span className="--i:1;"></span>

        <span className="--i:2;"></span>

        <span className="--i:3;"></span>

      </div>

      <div className="glowing">

        <span className="--i:1;"></span>

        <span className="--i:2;"></span>

        <span className="--i:3;"></span>

      </div>

      <div className="glowing">

        <span className="--i:1;"></span>

        <span className="--i:2;"></span>

        <span className="--i:3;"></span>

      </div> */}
    </div>
  )
}