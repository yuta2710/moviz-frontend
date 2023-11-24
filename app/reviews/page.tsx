"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, getMovies, getReviews } from "@/utils/clients.utils";
import { Movie, Review, User } from "@/types";

export default function Page(): ReactElement {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewsData = await getReviews(1);
        setReviews(reviewsData);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-white">Error: {error.message}</p>}
      {!loading && !error && (
        <ul>
          {reviews.map((review) => (
            <li className="text-white" key={review.id}>{review.url}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
