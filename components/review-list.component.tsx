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
        <div>
        {reviewList.length === 0 ? (
            <p>No reviews available.</p>
        ) : (
            <div className='flex flex-col gap-6 mt-5'>
            {reviewList.map((review) => (
                <div className='flex flex-row gap-5 mt-5'>
                    <Image src={`https://image.tmdb.org/t/p/w500/${review.movieObject?.poster_path}`} alt='movie-poster' width={150} height={300}/>
                    <div>
                        <h1 className='text-xl font-semibold'>{review.movieObject?.title}</h1>
                        <h2 className='text-gray-500'>{new Date(review.movieObject?.release_date as string).getFullYear()}</h2>
                        <h2 className='text-xl'>{review.author_details.rating}/10</h2>
                        <p className='text-gray-400 italic'>{review.content}</p>
                    </div>
                </div>
            ))}
            </div>
        )}
        </div>
    );
};

export default ReviewList;
