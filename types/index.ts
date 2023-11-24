export interface UserRegisterRequestProps {
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
    fam?: string;
    color?: string;
    size?: string;
  };
  fontLogo?: {
    fam?: string;
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
