"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Cast, CrewProps, Movie } from '@/types';
import { getCasts, getMovie } from '../../../utils/clients.utils';
import Image from 'next/image';
import Casts from '@/components/casts.component';
import Related from '@/components/related.component';
import { useRouter } from 'next/navigation';
import fetch from 'node-fetch';
import { Box, Modal, Typography } from '@mui/material';

export default function Page({ params }: { params: { id: string } }) {
  const [choice, setChoice] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [casts, setCasts] = useState<Cast[] | null>(null);
  const [crews, setCrews] = useState<CrewProps[] | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const id = params.id;
  const router = useRouter();
  const handleOpenDirectorInfo = () => setOpen(true);
  const handleCloseDirectorInfo = () => setOpen(false);
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
    fetchMovie();
    fetchCasts();
  }, [id]);
  if (!movie) {
    return <div>Loading...</div>;
  }
  const date = new Date(movie.release_date);
  const director = crews?.find(({ job }) => job === 'Director');

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    height: 600,
    bgcolor: 'background.paper',
    border: 'none',
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
    outline: 'none',
  };



  return (
    <div className="relative flex flex-col flex-wrap md:top-[15rem] justify-center">
      <div className='grid grid-cols-2 gap-3 w-4/5'>
        <div className="pl-52">
          {movie.poster_path !== null && <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image>}
        </div>
        <div className="text-white pr-52 content-center">
          <div className="flex my-5 md:w-[1200px]">
            <h1 className="text-2xl font-bold pr-10">{movie.title}</h1>
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
                <div className='flex flex-row justify-center items-center relative md:left-[11.5rem]'>
                  <div className='flex gap-3'>
                    {/* <Casts id={id} /> */}
                    {casts?.slice(0, 6).map((cast, index) => {
                      if (cast.profile_path !== null) {
                        return <div className='flex flex-col w-28 h-max'>
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
            <h1 className="text-2xl font-bold my-10">Popular Reviews</h1>
          </div>

        </div>
      </div>
      <div className='flex flex-col my-10 relative md:top-[8rem]'>
        <h1 className="text-2xl font-bold text-gray-400 text-center">Recommended similar films</h1>
        <Related id={id}></Related>
      </div>
      <Modal
        open={open}
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

