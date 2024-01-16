"use client"
import { Movie } from '@/types'
import { searchMovies } from '@/utils/clients.utils'
import Link from 'next/link'
import Image from "next/image";

import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Search = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query')
  const [results, setResults] = useState<Movie[]>()

  useEffect(() => {
    const fetchResults = async (query: string) => {
      const searchResults = await searchMovies(query);
      setResults(searchResults.results as Movie[])
    }
    if (query) {
      fetchResults(query)
    }
  }, [query])
  return (
    <div className='relative'>
      <h1 className='text-xl md:text-3xl text-white text-center mt-10 md:mt-10'>You searched for: <span className='font-bold' style={{ color: "#45FFCA" }}>"{query}"</span></h1>
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 md:mx-auto relative gap-4 justify-center items-center md:mt-8 md:px-20">
        {results &&
          results
            .map((movie) => movie.poster_path !== null && (
              <li className="md:pb-8 pb-8">
                <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg movie-obj">
                  <div className="">
                    <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={250} height={500} objectFit="cover" alt="" style={{ height: "300px" }} className="md:mx-auto rounded-xl md:rounded-xl util-box-shadow-purple-mode "></Image></div>
                </Link>
                <h3 className="text-white text-sm text-center font-regular md:mt-1">{movie.title}</h3>
              </li>
            ))}
      </ul>
    </div>
  )
}

export default Search

