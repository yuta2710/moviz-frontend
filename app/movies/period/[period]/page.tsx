"use client";

import { useEffect, useState } from "react";
import { Movie } from "../../../../types/index"
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Page({ params }: { params: { period: string } }) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page"));
  const [movieFilteringByPeriod, setMovieFilteringByPeriod] = useState<Movie[]>([]);

  const [currentPage, setCurrentPage] = useState(page || 1);
  const [numberOfMoviesPerPage] = useState(2);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const router = useRouter();
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const currentDayOfWeek = currentDate.getDay();
  const firstDayOfWeekIndex: number = 1; 
  const difference: number = currentDayOfWeek - firstDayOfWeekIndex;
  const firstDayOfWeek: Date = new Date(currentDate);
  firstDayOfWeek.setDate(currentDate.getDate() - difference - (currentDayOfWeek === 0 ? 7 : 0));
  const lastDayOfWeek = new Date(firstDayOfWeek);
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6); 
  const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
  const lastDayOfYear = new Date(currentDate.getFullYear() + 1, 0, 0);

  useEffect(() => {
    const fetchData = async (pageNumber: number) => {
      console.log("URL is ", `http://localhost:8080/api/v1/movies?page=${pageNumber}&include_video=false&language=en-US&sort_by=popularity.desc&primary_release_date.gte=2019-01-01&primary_release_date.lte=2019-12-31`)
      
      if(params.period === "this-year") {
        const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${formatDate(firstDayOfYear)}&primary_release_date.lte=${formatDate(lastDayOfYear)}&sort_by=popularity.desc&`);  
        const data = response.json();
        data.then(json => {
            const data = json.data;
            console.log(data.results);
            setMovieFilteringByPeriod(data.results as Movie[]);
        });
        }
        else if(params.period === "this-month") {
            const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${formatDate(firstDayOfMonth)}&primary_release_date.lte=${formatDate(lastDayOfMonth)}&sort_by=popularity.desc&`);  
            const data = response.json();
            data.then(json => {
                const data = json.data;
                console.log(data.results);
                setMovieFilteringByPeriod(data.results as Movie[]);
            });
        }
        else if(params.period === "this-week") {
            const response = await fetch(`http://localhost:8080/api/v1/movies?page=${pageNumber + 1}&primary_release_date.gte=${formatDate(firstDayOfWeek)}&primary_release_date.lte=${formatDate(lastDayOfWeek)}&sort_by=popularity.desc&`);  
            const data = response.json();
            data.then(json => {
                const data = json.data;
                console.log(data.results);
                setMovieFilteringByPeriod(data.results as Movie[]);
            });
        }
      
    }

    fetchData(currentPage);
  }, [currentPage, router]);

  function formatDate(date:Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

  return <div className="text-white">
    <div className="flex flex-wrap justify-center -mx-2">
    {[...movieFilteringByPeriod].map((movie) => (
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