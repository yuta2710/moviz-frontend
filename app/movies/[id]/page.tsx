"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Cast, Movie } from '@/types';
import { getCasts, getMovie } from '../../../utils/clients.utils';
import Image from 'next/image';
import Casts from '@/components/casts.component';
import Related from '@/components/related.component';
import { useRouter } from 'next/navigation';
import fetch from 'node-fetch';

export default function Page({ params }: { params: { id: string } }) {
  const [choice, setChoice] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [casts, setCasts] = useState<Cast[] | null>(null);
  const id = params.id;
  const router = useRouter();
  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovie(id) as Movie;
      setMovie(movieData);
    };

    fetchMovie();

    const fetchCasts = async () => {
      try {
        const castData = await getCasts(id);
        const castArr: Cast[] = castData.cast;
        setCasts(castArr);
      } catch (error) {
        console.error('Error fetching casts:', error);
      }
    };

    fetchCasts();
  }, [id]);
  if (!movie) {
    return <div>Loading...</div>;
  }
  const date = new Date(movie.release_date);

  console.log(casts);

  return (
    <div className="relative flex flex-row flex-wrap md:top-[15rem] justify-center">
      <div className='grid grid-cols-2 gap-3 w-4/5'>
        <div className="pl-52">
          <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image>
        </div>
        <div className="text-white pr-52 content-center">
          <div className="flex my-5">
            <h1 className="text-3xl font-bold pr-10">{movie.title}</h1>
            <p className="font-light text-gray-400 px-10">{date.getFullYear()}</p>
            <p className="font-ligt text-gray-400 px-10">Directed by ...</p>
          </div>
          <p className="text-sm text-gray-400 w-96 text-justify">{movie.overview}</p>
          <div className="">
            <div className="flex flex-row space-x-5 font-bold text-gray-400 my-5">
              <h2 onClick={() => setChoice(1)}>Cast</h2>
              <h2 onClick={() => setChoice(2)}>Genres</h2>
              <h2 onClick={() => setChoice(3)}>Details</h2>
              <h2 onClick={() => setChoice(4)}>Release</h2>
            </div>
            <div className="flex flex-col space-x-3">
              {choice == 1 && (
                <>
                  <div className='flex gap-3'>
                    {/* <Casts id={id} /> */}
                    {casts?.slice(0, 6).map((cast, index) => {
                      if (cast.profile_path !== null) {
                        return <div className='flex flex-col w-28 h-max'>
                          <Image className='object-contains' src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={80} height={80}></Image>
                          <div className='relative md:mt-4 md:w-[400px]'>
                            <h2 className='text-[0.7rem] font-medium text-white'>{cast.name}</h2>
                            <h2 className='text-[0.7rem] font-light text-gray-400'>{cast.character}</h2>
                          </div>
                        </div>
                      }
                    })}
                  </div>
                  <button
                    onClick={() => router.push(`/movies/${id}/casts`)}
                    type="button"
                    className="relative md:top-[2rem] md:w-full focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">More</button>

                </>)}
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
            <h1 className="text-3xl font-bold my-10">Popular Reviews</h1>
          </div>

        </div>
      </div>
      <div className='flex flex-col my-10'>
        <h1 className="text-2xl font-bold text-gray-400">Recommended similar films</h1>
        <Related id={id}></Related>

      </div>
    </div>
  )
}

