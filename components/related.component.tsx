"use client"
import { Movie } from '@/types';
import { getRelatedMovies } from '@/utils/clients.utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';


const Related = ({ id }: { id: string }) => {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchRelatedMovies = async () => {
      try {
        const data = await getRelatedMovies(id);
        const movieArray: Movie[] = data.results.slice(0, 6);
        setMovies(movieArray);
      } catch (error) {
        console.error('Error fetching related movies:', error);
      }
    };

    fetchRelatedMovies();
  }, [id]);

  if (!movies) {
    return <div>Loading...</div>;
  }

  console.log(movies);
  return (
    <div className='grid grid-cols-3 gap-5 md:mx-auto md:mt-8'>
      {movies.map((movie) => (
        <Link href={`/movies/${movie.id}`} className='w-52 content-center hover:scale-110 duration-500 cursor-pointer'>
          <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={300} alt="movie-poster" className="md:mx-auto"></Image>
          <h2 className='text-[1rem] text-white font-semibold md:w-full md:py-4 text-center'>{movie.title}</h2>
        </Link>
      ))}
    </div>
  )
}

export default Related

