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
  reviews: ReviewCustomization[];
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
  genre_ids: number[];
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
