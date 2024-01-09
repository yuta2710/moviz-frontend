"use client"

import React, { useEffect, useState } from 'react';
import { FilmReviewProps, Movie } from '@/types';
import { getMovie } from '@/utils/clients.utils';
import Image from 'next/image';



interface ReviewListProps {
  reviews: FilmReviewProps[];
  currentPage: number;
  itemsPerPage: number;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, currentPage, itemsPerPage }) => {
  const [reviewList, setReviewList] = useState<FilmReviewProps[]>([]);


  // Loop through all reviews and set movie poster path 
  useEffect(() => {
    const fetchPosters = async () => {
      try {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedReviews = reviews.slice(startIndex, endIndex);

        const reviewsWithMovies = await Promise.all(
          paginatedReviews.map(async (review: FilmReviewProps) => {
            try {
              const movieDetails = await getMovie(review.movie) as Movie;
              return { ...review, movieObject: movieDetails };
            } catch (error) {
              console.error(`Error fetching poster for movie ${review.movie}:`, error);
              return { ...review };
            }
          })
        );

        setReviewList(reviewsWithMovies);
        console.log("reviews: ", reviews);
      } catch (error) {
        console.error("Error fetching paginated movie details:", error);
      }
    };

    fetchPosters();
  }, [reviews, currentPage, itemsPerPage]);

  return (
    <div className='' style={{ paddingBottom: "4rem" }}>
      {reviewList.length === 0 ? (
        <p className='text-white text-sm opacity-40 md:mt-2'>No reviews available.</p>
      ) : (
        <div className='flex flex-col gap-6 mt-5'>
          {reviewList.map((review) => (
            <div className='flex flex-row gap-5 mt-5 items-center'>
              <Image src={`https://image.tmdb.org/t/p/w500/${review.movieObject?.poster_path}`} style={{ height: "100px" }} alt='movie-poster' width={60} height={100} />
              <div className='flex flex-col justify-center items-start'>
                <div className='flex flex-row justify-between gap-4 items-center'>
                  <h1 className='text-[1rem] font-semibold italic'>{review.movieObject?.title}</h1>
                  <h2 className='text-gray-500 text-sm'>{new Date(review.movieObject?.release_date as string).getFullYear()}</h2>
                  <h2 className='text-sm'>{review.author_details.rating}/10</h2>
                </div>
                <p className='text-white text-[0.8rem] line-clamp-4 md:max-w-[500px]'>{review.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
