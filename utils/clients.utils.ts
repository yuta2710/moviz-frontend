import {
  Movie,
  Review,
  UserLoginProps,
  UserRegisterRequestProps,
} from "@/types";
import axios from "axios";

export const saveUser = async (userData: UserRegisterRequestProps) => {
  try {
    await axios
      .post(`http://localhost:8080/api/v1/auth/register`, userData)
      .then((response) => console.log(response));
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
    return json.results as Movie[];
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

export async function getReviews(pageNumber: number) {
  const url =
    "https://api.themoviedb.org/3/movie/615656/reviews?language=en-US&page=1";
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

    json.results.forEach((item: any) => {
      delete item.author_details;
      delete item.author;
    });

    console.log(json);

    return json.results as Review[];
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throw the error for the caller to handle
  }
}

interface AuthorDetail {}
