"use client"
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Movie } from '@/types';
import { getMovie } from '@/utils/clients.utils';
import Image from 'next/image';
import Casts from '@/components/casts';

export default function Page() {
  const [choice, setChoice] = useState(1);
  const [movie, setMovie] = useState<Movie | null>(null);
  const path = usePathname();
  const id = path.replace('/movies/', '');
  useEffect(() => {
    const fetchMovie = async () => {
      const movieData = await getMovie(id) as Movie;
      setMovie(movieData);
    };
    fetchMovie();
  }, [id]);
  if (!movie) {
    return <div>Loading...</div>;
  }
  const date = new Date(movie.release_date);


  return (
    <div className="relative flex-wrap md:top-[15rem]">
      <div className="">
        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image>
      </div>
      <div className="text-white">
        <div className="flex">
          <h1 className="text-lg font-bold pr-10">{movie.title}</h1>
          <p className="text-sm font-semibold px-10">{date.getFullYear()}</p>
          <p className="text-sm font-semibold px-10">Directed by ...</p>
        </div>
        <p className="text-sm">{movie.overview}</p>
        <div className="">
          <div className="flex space-x-5">
            <h2 onClick={() => setChoice(1)}>Cast</h2> 
            <h2 onClick={() => setChoice(2)}>Genres</h2>
            <h2 onClick={() => setChoice(3)}>Details</h2>
            <h2 onClick={() => setChoice(4)}>Release</h2>
          </div>
          <div className="flex space-x-3">
            {choice == 1 && (
              <>
                <div className=''>
                  <Casts id ={id}/>
                </div>

              </>)}
              {choice == 2 && (
              <>
                <div>
                  {movie.genres.map((genre) => (<p>{genre.name}</p>))}
                </div>

              </>)}
              {choice == 3 && (
              <>
                <div>
                  <h3>Original Title: {movie.original_title} </h3>
                  <h3>Original Language: {movie.original_language}</h3>
                </div>

              </>)}
              {choice == 4 && (
              <>
                <div>
                  <p>Release date: {movie.release_date}</p>
                </div>

              </>)}
          </div>
          <div>
            <h1 className="text-lg font-bold">Popular Reviews</h1>
          </div>          
        </div>
      </div>
    </div>
  )
}

