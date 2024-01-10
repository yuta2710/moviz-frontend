"use client";

import { Cast, CrewProps, FilmReviewProps, Movie } from "@/types";
import { getCasts, getMovie, getReviewsByMovieId } from "../../../../utils/clients.utils";
import { useEffect, useState } from "react";
import Image from "next/image";
import { formatHistoryDate } from "@/utils/convert.utils";
import Link from "next/link";

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

  console.log("Review data = ", reviews);
  return (
    movie !== null &&
    <div className="flex flex-row-reverse justify-center">
      <div className="relative flex flex-col justify-center items-start md:ml-24"> {/* Added justify-center and items-center */}
        <div className="flex flex-col justify-start relative">
          <h1 className="text-xl font-bold relative text-white translate-y-4 text-gradient-cyan-blue">Recent Reviews</h1>
          <ul className="md:mt-8">
            {reviews.length > 0 &&
              reviews
                .sort((a: FilmReviewProps, b: FilmReviewProps) => b.author_details.rating - a.author_details.rating)
                .map((review: FilmReviewProps) => review.author_details.reviewerId?._id !== undefined && (
                  <div className='flex flex-col h-max review-section relative md:mt-4'>
                    <div className="flex flex-row justify-start items-center relative">
                      <Link href={`/visitor/${review.author_details.reviewerId._id}`} className="">
                        {review.author_details.reviewerId !== undefined && review.author_details.reviewerId !== null
                          ? <Image src={review.author_details.avatar_path} width={50} height={50} className="rounded-full object-cover relative" style={{ height: "50px" }} alt=""></Image>
                          : review.author_details.avatar_path !== null &&
                          <Image src={`https://image.tmdb.org/t/p/w500/${review.author_details.avatar_path}`} width={100} height={100} className="object-cover relative" alt=""></Image>
                        }
                      </Link>
                      <h2 className='text-sm font-bold text-white md:ml-4'><span className='text-ai4biz-green-quite-light font-semibold text-[0.7rem]'><span className="text-white font-light opacity-50">Review by</span> {review.author_details.username}</span>
                        <span className='text-white md:ml-8 font-bold'>Rating:</span> <span className='md:ml-2'>{review.author_details.rating.toFixed(1)} / 10</span> <span className='text-white opacity-50 text-[0.7rem] md:ml-16'>{formatHistoryDate(review.createdAt)}</span></h2>
                    </div>
                    <h2 className='text-[0.8rem] font-regular text-white md:mt-2 md:w-[800px] text-justify md:pb-8 md:leading-6'>{review.content}</h2>
                    <div className="absolute md:w-full md:h-[1px] bg-white bottom-0 opacity-50"></div>
                  </div>
                ))}
          </ul>
        </div>
      </div>
      <div className="relative md:mt-24">
        <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={306} height={391} alt="" className=""></Image>
        <div className="flex flex-col justify-between items-center">
          <h1 className="text-white font-semibold text-xl text-center md:w-[306px]">{movie?.title}</h1>
          {/* <Image src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} width={306} height={391} alt="" className="md:ml-24"></Image> */}
          <h1 className="text-white font-medium text-sm text-center">{new Date(movie.release_date).getFullYear()}</h1>
          <h1 className="text-white font-medium text-sm text-center">Directed By <span className="font-bold text-ai4biz-green-quite-light">{director?.name}</span></h1>
        </div>
      </div>
    </div>
  )
}