"use client";

import { useEffect, useState } from "react";
import { Movie } from "../../../../types/index"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Page({ params }: { params: { genre: number } }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [movieFilteringByGenre, setMovieFilteringByGenre] = useState<Movie[]>([]);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const router = useRouter();
  useEffect(() => {
    const fetchData = async (pageNumber: number) => {
      console.log("URL is ", `http://localhost:8080/api/v1/movies?page=${pageNumber}&include_video=false&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2019-01-01&primary_release_date.lte=2019-12-31`)
      const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${new Date().getFullYear()}-01-01&primary_release_date.lte=${new Date().getFullYear()}&sort_by=popularity.desc&&with_genres=${params.genre}`);

      const data = response.json();
      data.then(json => {
        const data = json.data;
        console.log(data.results);
        setMovieFilteringByGenre(data.results as Movie[]);
      });
    }

    fetchData(currentPage);
  }, [currentPage, router]);


  return <div className="text-white">
    <ul className="inline-grid grid-cols-3 absolute gap-4 justify-center md:left-[30rem] md:top-[22rem]">
      {[...movieFilteringByGenre]
        .map((movie) => (
          <li className="relative hover:scale-110 duration-500">
            <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow">
              <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={200} height={0} alt="" className="md:mx-auto object-cover rounded-sm"></Image>
              {/* <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{movie.popularity}</h5> */}
            </Link>
          </li>
        ))}
    </ul>

  </div>
}