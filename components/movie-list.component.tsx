'use client'
import { Movie } from '@/types'
import { getMovie } from '@/utils/clients.utils'
import Link from 'next/link';
import Image from "next/image";
import React, { useEffect, useState } from 'react'


interface MovieListProps {
    ids: string[];
}

const MovieList: React.FC<MovieListProps> = ({ ids }) => {
    const [movies, setMovies] = useState<Movie[]>()
    
    useEffect(() => {
        // Define a function to fetch a single movie by ID
        const fetchMovieById = async (id: string) => {
        try {
            // Assume there's a function that fetches a movie based on ID
            const fetchedMovie = await getMovie(id);
            return fetchedMovie;
        } catch (error) {
            console.error(`Error fetching movie with ID ${id}:`, error);
            return null;
        }
        };

        // Fetch movies for each ID in the ids array
        const fetchMovies = async () => {
            const fetchedMovies = await Promise.all(ids.map(fetchMovieById));
            setMovies(fetchedMovies.filter((movie) => movie !== null) as Movie[]);
        };

        // Call the fetchMovies function when the component mounts
        fetchMovies();
        console.log("Movie list: ", movies)
    }, [ids]);
    return (
        <>
        {!movies && (
            <div className='text-white'>Nothing here yet!</div>
        )}
        {movies && (
            <div className='grid grid-cols-6 gap-5'>
                {movies.map((movie) => (
                    <div>
                        <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow movie-obj">
                            <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
                        </Link>
                    </div>
                ))}
            </div>
        )}
        </>
    )
}

export default MovieList