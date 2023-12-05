import { Letterboxd } from "letterboxd-api";

export interface UserRegisterRequestProps {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
}

export interface UserLoginProps {
  email: string;
  password: string;
}

const json = {
  firstName: "Admin",
  lastName: "Test",
  email: "admin.test@gmail.com",
  password: "123456",
  role: "admin",
  gender: "female",
};

export interface User {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  photo: string;
  createdAt: string;
}

export interface HeaderProps {
  logo?: {
    photo: string;
    text: string;
  };
  user?: {
    name?: string;
    photo?: string;
  };
  items: Array<{
    APPLICATION_PATH: string;
    KEY: string;
  }>;
  background?: string;
  textColorPalette?: string;
  height?: string;
  fontItem?: {
    color?: string;
    size?: string;
  };
  fontLogo?: {
    color?: string;
    size?: string;
  };
}

export interface Movie {
  adult: boolean;
  backdrop_path: string;
  genres: { id: number; name: string }[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface Review {
  content: string;
  createdAt: string;
  id: string;
  updatedAt: string;
  url: string;
}

export interface PaginationProps {
  // currentPage: number;
  fetchData: () => void;
  numberOfListPerPage: number;
  lengthOfList: number;
  setPaginate: (number: number) => void;
}

export interface CardMovieProps {}

export interface Cast{
  id: string;
  name: string;
  character: string;
  profile_path: string;
}
