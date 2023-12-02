"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import { Movie } from '@/types'
import { getMovie } from '@/utils/clients.utils'
import Image from "next/image";


export default async function Page() {
  const path = usePathname();
  const id =  path.replace('/movies/', '')
  console.log(id);
  const movie = await getMovie(id) as Movie;

  return (
    <div className="flex flex-wrap">
      <div className="">
        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={300} height={150} alt="" className="md:mx-auto"></Image>
      </div>
      <div className="text-white">
        <div className="flex">
          <h1 className="text-lg font-bold pr-10">{movie.title}</h1>
          <p className="text-sm font-semibold px-10">{movie.release_date}</p>
          <p className="text-sm font-semibold px-10">Directed by ...</p>
        </div>
        <p className="text-sm">{movie.overview}</p>
        <div className="flex space-x-5">
          <h2>Cast</h2>
          <h2>Genres</h2>
          <h2>Details</h2>
          <h2>Release</h2>
        </div>
      </div>
    </div>
  )
}

