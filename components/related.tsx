"use client"
import { Movie } from '@/types';
import {  getRelatedMovies } from '@/utils/clients.utils';
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';


const Related = ({id} : {id: string}) => {
    const [movies, setMovies] = useState<Movie[]>([])

    useEffect(() => {
        const fetchRelatedMovies = async () => {
        try {
            const data = await getRelatedMovies(id);
            const movieArray: Movie[] = data.results.slice(0,6); 
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
        <div className='flex flex-wrap gap-3'>
            {movies.map((movie) => (
                <Link href={`/movies/${movie.id}`}>
                    <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={100} height={150} alt="" className="md:mx-auto"></Image>
                    <h2>{movie.title}</h2>
                </Link>
            ))}
        </div>
    )
}

export default Related