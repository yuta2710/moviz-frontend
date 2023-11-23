"use client";

import { ReactElement, useEffect, useState } from "react";
import { useAuth } from "../../components/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getMe, getMovies } from "@/utils/clients.utils";
import { Movie, User } from "@/types";

export default function Page(): ReactElement {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const moviesData = await getMovies(1);
        setMovies(moviesData);
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
          {movies.map((movie) => (
            <li className="text-white" key={movie.id}>{movie.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
