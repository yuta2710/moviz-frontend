"use client";

import { Cast, CrewProps, FilmReviewProps, Movie } from "@/types";
import { getCasts, getMovie, getReviewsByMovieId } from "../../../../utils/clients.utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatHistoryDate } from "@/utils/convert.utils";

export default function Page({ params }: { params: { id: string } }) {
  console.log(params.id);
  const movieId = params.id;
  const [movie, setMovie] = useState<Movie | null>(null);
  const [casts, setCasts] = useState<Cast[]>([]);
  const [crews, setCrews] = useState<CrewProps[]>([]);
  const [reviews, setReviews] = useState<FilmReviewProps[]>([]);
  useEffect(() => {
    const fetchMovieById = async () => {
      const movieData = await getMovie(movieId);
      setMovie(movieData);
    }

    const fetchCasts = async () => {
      try {
        const castData = await getCasts(movieId);
        const castArr: Cast[] = castData.cast;
        const crewArr: CrewProps[] = castData.crew;
        setCasts(castArr);
        setCrews(crewArr);
      } catch (error) {
        console.error('Error fetching casts:', error);
      }
    };

    const fetchReviewsByMovieId = async () => {
      const reviewsData = await getReviewsByMovieId(Number(movieId)) as FilmReviewProps[];
      console.log("Reviews data = ", reviewsData);
      setReviews(reviewsData);
    }

    fetchMovieById();
    fetchReviewsByMovieId();
    fetchCasts()
  }, [movieId])

  const director = crews?.find(({ job }) => job === 'Director');

  return (
    movie !== null &&
    <div className="flex flex-row justify-center">
      <div className="relative flex flex-col justify-center items-start md:ml-24"> {/* Added justify-center and items-center */}
        <div className="flex flex-row justify-between items-start">
          <h1 className="text-white font-semibold text-xl md:w-9/12">{movie?.title}</h1>
          <h1 className="text-white font-medium text-lg md:ml-8">{new Date(movie.release_date).getFullYear()}</h1>
          <h1 className="text-white font-medium text-lg md:ml-24 md:w-[600px]">Directed By {director?.name}</h1>
          {/* <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={306} height={391} alt="" className="md:ml-24"></Image> */}
        </div>

        <div className="flex flex-col justify-start translate-y-12 relative">
          <h1 className="text-2xl font-bold relative text-white translate-y-4 text-gradient-cyan-blue">Recent Reviews</h1>
          {reviews.length > 0 &&
            reviews
              .map((review: FilmReviewProps) => (
                <div className='flex flex-col md:w-[500px] h-max review-section relative'>
                  <h2 className='text-sm font-bold text-white md:mt-6'>Review by <span className='text-ai4biz-green-quite-light font-semibold'>{review.author}</span>
                    <span className='text-white md:ml-8 font-bold'>Rating:</span> <span className='md:ml-2'>{review.author_details.rating} / 10</span> <span className='text-white opacity-50 text-[0.7rem] md:ml-16'>{formatHistoryDate(review.createdAt)}</span></h2>
                  <h2 className='text-[1rem] font-regular text-white md:mt-2 md:w-[800px] text-justify md:pb-8'>{review.content}</h2>
                </div>
              ))}
        </div>
      </div>
      <div className="relative md:mr-64 md:mt-24">
        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={506} height={591} alt="" className="md:ml-24"></Image>
      </div>
    </div>
  )
}