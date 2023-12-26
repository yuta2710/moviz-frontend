"use client";

import { FilmReviewProps, ReviewCustomization, Genre } from "@/types";
import {
  Movie,
  Review,
  UserLoginProps,
  UserRegisterRequestProps,
} from "@/types";
import axios from "axios";
import letterboxd from "letterboxd-api";
import { useRouter } from "next/navigation";

// data
export const saveUser = async (userData: UserRegisterRequestProps) => {
  try {
    return await axios
      .post(`http://localhost:8080/api/v1/auth/register`, userData)
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.accessToken);
          window.location.reload();
        } else {
          console.error("Registration failed:", response.status);
        }
      });
  } catch (error) {
    throw error;
  }
};

export const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
  },
});

export const login = async (props: UserLoginProps) => {
  try {
    return await axios.post(`http://localhost:8080/api/v1/auth/login`, props);
  } catch (error) {
    throw error;
  }
};

export const registerNewUser = async (props: UserRegisterRequestProps) => {
  try {
    return await axios.post(
      `http://localhost:8080/api/v1/auth/register`,
      props
    );
  } catch (error) {
    throw error;
  }
};

export async function getMe() {
  const res = await axios.get("http://localhost:8080/api/v1/auth/me", {
    headers: {
      authorization: `Bearer ${localStorage.getItem("accessToken")} `,
    },
  });

  const json = res.data;

  console.log(`Bearer ${localStorage.getItem("accessToken")} `);

  return json;
}

export async function getMovie(id: string) {
  const url = `http://localhost:8080/api/v1/movies/${id}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // const json = await response.json();
    const json = await response.json();

    console.log("Json = ", json);
    // console.log("Json 2 = ", json2);
    const movieData = json.data;

    console.table({ movieData });

    return movieData;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getMovies(pageNumber: number) {
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${pageNumber}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    console.log("Json = ", json);
    return json;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getRelatedMovies(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}/similar`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    console.log("Json = ", json);
    return json;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getCasts(id: string) {
  const url = `https://api.themoviedb.org/3/movie/${id}/credits`;
  const ENDPOINT = `http://localhost:8080/api/v1/movies/${id}/casts`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();
    const casts = json.data;

    return casts;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getCast(id: string) {
  const url = `https://api.themoviedb.org/3/person/${id}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    console.log("Json = ", json);
    return json;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getReviews(pageNumber: number) {
  // add movie_id as second param
  const url = `https://api.themoviedb.org/3/movie/615656/reviews?language=en-US&page=${pageNumber}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    // json.results.forEach((item: any) => {
    //   delete item.author_details;
    //   delete item.author;
    // });

    console.log(json);

    return json.results as Review[];
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getGenres() {
  // add movie_id as second param
  const url = `https://api.themoviedb.org/3/genre/movie/list?language=en`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY",
    },
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    // json.results.forEach((item: any) => {
    //   delete item.author_details;
    //   delete item.author;
    // });

    console.log("Genre json = ", json);

    return json.genres as Genre[];
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getCurrentReviewsFromLetterboxdServer(username: string) {
  const currentReviews = (await letterboxd(username)) as ReviewCustomization[];

  return currentReviews;
}

interface AuthorDetail {}

export const APPLICATION_PATH = ["/register", "/movies", "/news"];

export const getReviewsByMovieId = async (movieId: number) => {
  console.log("This is movieId = ", movieId);
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/movies/${movieId}/reviews`
    );

    // console.log(response)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("Reviews fetching is = ", data);

    return data.data as FilmReviewProps[];
  } catch (error) {
    console.log(error);
  }
};

export const getAllReviews = async () => {
  try {
    const response = await fetch(`http://localhost:8080/api/v1/reviews`);

    // console.log(response)

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log("All Reviews fetching is = ", data);

    return data.data as FilmReviewProps[];
  } catch (error) {
    console.log(error);
  }
};

export const saveReviewsByMovieId = async (
  movieId: string,
  props: FilmReviewProps
) => {
  try {
    console.log("Film props = ", props);
    return axios
      .post(`http://localhost:8080/api/v1/reviews/${movieId}`, props, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          console.log(response);
        } else {
          console.error("Registration failed:", response.status);
        }
      });
  } catch (error) {
    throw error;
  }
};

export async function fetchMovies(pageNumber: number) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/v1/movies?page=${pageNumber}&primary_release_date.gte=${new Date().getFullYear()}-01-01&primary_release_date.lte=${new Date().getFullYear()}-12-31&sort_by=popularity.desc`
    );
    const data = await response.json();
    return data;
  } catch (e) {
    console.log("Error fetching movies: ", e);
  }
}

export async function searchMovies(query: string) {
  if (query) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=d95a8926ef62fc2a5c3ca22b8a95b91b`;
    try {
      const response = await fetch(url);
      const response2 = await axios.get(url);
      const movies = await (await response2).data;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(movies);

      return movies;
    } catch (error) {
      console.error("Error:", error);
      throw error; // Re-throw the error for the caller to handle
    }
  }
}
