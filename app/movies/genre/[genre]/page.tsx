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
    <div className="flex flex-wrap justify-center -mx-2">
    {[...movieFilteringByGenre].map((movie) => (
      <div key={movie.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 p-2">
        <Link href={`/movies/${movie.id}`} className="block max-w-sm p-6 rounded-lg shadow">
          <Image
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            width={200}
            height={300} // Set an appropriate height
            alt=""
            className="mx-auto object-cover rounded-sm"
          />
          {/* Additional information if needed */}
          {/* <h5 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">{movie.title}</h5> */}
        </Link>
      </div>
    ))}
  </div>

  </div>
}