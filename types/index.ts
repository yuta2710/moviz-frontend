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
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
  gender: string;
  photo: string;
  reviews: FilmReviewProps[];
  watchLists: string[];
  followers: User[];
  followings: User[];
  createdAt: string;
  //watchLists: string[];
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
  genre_ids: [];
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

interface Multimedia {
  rank: number;
  subtype: string;
  caption: null | string;
  credit: null | string;
  type: string;
  url: string;
  height: number;
  width: number;
  legacy: {
    xlarge: string;
    xlargewidth: number;
    xlargeheight: number;
  };
  subType: string;
  crop_name: string;
}

interface BylinePerson {
  firstname: string;
  middlename: null | string;
  lastname: string;
  qualifier: null | string;
  title: null | string;
  role: string;
  organization: null | string;
  rank: number;
}

interface Byline {
  original: string;
  person: BylinePerson[];
  organization: null | string;
}

export interface ArticleProps {
  abstract: string;
  web_url: string;
  snippet: string;
  lead_paragraph: string;
  print_section: string;
  print_page: string;
  source: string;
  multimedia: Multimedia[];
  pub_date: string;
  document_type: string;
  news_desk: string;
  section_name: string;
  byline: Byline;
  type_of_material: string;
  _id: string;
  word_count: number;
  uri: string;
}

export type ReviewCustomization = Letterboxd & {
  film: {
    title: string;
    year: string;
    image: { tiny: string; medi: string; medium: string; large: string };
  };
  review?: string;
};

export interface CardMovieProps {}

export interface Cast {
  id: string;
  name: string;
  gender: number;
  character: string;
  biography: string;
  profile_path: string;
  birthday: string;
  place_of_birth: string;
  deathday: string;
}

export interface CrewProps {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  credit_id: string;
  department: string;
  job: string;
}

interface AuthorDetails {
  reviewerId: User | null;
  name: string;
  username: string;
  avatar_path: string;
  rating: number;
}

export interface FilmReviewProps {
  author: string;
  author_details: AuthorDetails;
  content: string;
  createdAt: string;
  tag?: string;
  movie: string;
  movieObject?: Movie;
  // id: string;
  updatedAt: string;
  // rating: number;
  // url: string;
  //poster_path?: string;
}

export interface Genre {
  id: number;
  name: string;
}
