"use client"

import { HeaderProps, Movie, User } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { MouseEventHandler, ReactNode, useEffect, useRef, useState } from 'react'
import _ from "lodash";
import { useAuth } from '../context/AuthContext'
import { APPLICATION_PATH, getMe, searchMovies } from '../../utils/clients.utils'
import { Autocomplete, Box, Button, Grid, Icon, IconButton, InputBase, TextField, Typography, alpha, styled } from '@mui/material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { usePathname, useRouter } from 'next/navigation'
import gsap from "gsap";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SearchIcon from '@mui/icons-material/Search';
import Fuse from "fuse.js";
import { SearchBar } from '../common/search-bar.component'
import AddIcon from '@mui/icons-material/Add';
import BurgerMenu from "../common/burger-menu";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faBars } from '@fortawesome/free-solid-svg-icons';
// import fetch from 'node-fetch'

interface DropdownProps {
  icon: ReactNode;
  text: string;
  url?: string;
  onClick: MouseEventHandler<HTMLAnchorElement>;
}

const Header = (header: HeaderProps) => {
  const { logo, items, background, height, fontLogo, fontItem } = header
  const [customer, setCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, logout, isAuthenticated, currentUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();
  const [isBurgerMenuOpen, setBurgerMenuOpen] = useState(false);
  const handleBurgerMenuToggle = () => {
    setBurgerMenuOpen(!isBurgerMenuOpen);
  };
  // const [inputValue, setInputValue] = useState("");
  // const [searchQuery, setSearchQuery] = useState('')
  // const searchRef = useRef<typeof InputBase>();
  const [searchQuery, setSearchQuery] = useState("");
  const [totalSearchResults, setTotalSearchResults] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [isHoveringSearchResult, setIsHoveringSearchResult] = useState(false);

  const handleMouseOver = () => {
    setIsHoveringSearchResult(true);
  };

  const handleMouseOut = () => {
    setIsHoveringSearchResult(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const logoPhoto = document.querySelector(".logo-photo");
    const logoText = document.querySelector(".logo-text");
    gsap.set([logoPhoto, logoText], {
      opacity: 0,
      y: -50
    })
    gsap.to([logoPhoto, logoText], {
      y: 0,
      stagger: 0.2,
      duration: 1,
      opacity: 1
    })
  }, []);

  useEffect(() => {
    // if (isAuthenticated() && user !== null) {
    //   const fetchData = async () => {
    //     try {
    //       const json = await getMe();
    //       setCustomer(json.data);
    //     } catch (error) {
    //       console.log(error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

    //   fetchData();
    // }

    console.log(APPLICATION_PATH, path)
    if (APPLICATION_PATH.includes(path)) {
      setLoading(false);
      router.push(path);
    }
    else {
      setLoading(false);
      // router.push("/login");
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (!isAuthenticated()) {

  //   }
  // }, [])

  useEffect(() => {
    handleSearchMovie(searchQuery);
  }, [searchQuery])

  const handleSearchMovie = async (query: string) => {
    if (query) {
      const searchResults = await searchMovies(query);
      const moviesDatum = searchResults.results as Movie[];
      const totalResults = searchResults.total_results as number;
      setSuggestions(moviesDatum);
      setTotalSearchResults(totalResults);
    }
  }

  useEffect(() => {
    setSearchQuery("");
    setTotalSearchResults(0);
  }, [path])

  // Search HTML 
  let searchResultHTML = (suggestion: Movie, index: number) =>
    <li
      className={"flex flex-col hover:scale-105 duration-500 rounded-xl cursor-pointer md:mt-4"}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      onClick={() => router.push(`/movies/${suggestion.id}`)
      }
      key={suggestion.id}>
      <div className='flex flex-row justify-start items-center md:mt-4 rounded-xl'>
        <Image
          src={`https://image.tmdb.org/t/p/w500/${suggestion.poster_path}`}
          width={50}
          height={50}
          className='rounded-sm'
          alt="Random Picture"
        ></Image>
        <p className='text-white text-[0.8rem] text-left overflow-hidden whitespace-nowrap relative md:ml-4'> {suggestion.title}</p>
      </div>
      {index < 4 && <div className='md:w-full bg-white md:h-[2px] md:mt-2 opacity-50'></div>}
    </li>

  console.log("Current user = ", currentUser);


  return (
    <header className={`lg:container mx-auto px-3 py-3 relative bg-transparent rounded-sm`}>
      <nav className={`grid grid-cols-12 nav-container md:w-full md:mx-auto relative flex flex-row justify-between items-center sm:px-16 md:px-6 md:py-4 bg-transparent`}>
        <Link href='/home' className='col-span-1 flex justify-center items-center hidden lg:flex'>
          <Image className='logo-photo' src={"/assets/icons/logo_icon.png"} width={36} height={42} alt='Logo header'></Image>
          <span className={`logo-text self-center relative left-[2rem] md:left-[0rem] top-[4rem] md:top-[0rem] text-[2.5rem] md:text-2xl font-semibold whitespace-nowrap logo block ${fontLogo?.size} ${fontLogo?.color}`}>
            {logo?.text}
          </span>

        </Link>

        <div className="lg:hidden">
          <button id="burger-btn" className="text-white focus:outline-none">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        </div>

        <div className="burger-menu-wrapper lg:hidden">
          <button onClick={handleBurgerMenuToggle}>
            {/* <FontAwesomeIcon icon={faBars} /> */}
          </button>
          <BurgerMenu isOpen={isBurgerMenuOpen} onClose={() => setBurgerMenuOpen(false)} />
        </div>

        <div className='col-span-1 hidden md:flex '></div>
        <div className="col-span-3  hidden lg:flex">
          <ul className="items-container font-medium flex flex-row p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 border-0 md:border-0">
            {items.map(item => (
              <li className='col-span-1 flex justufy-center z-10' key={item.KEY}>
                <Link href={item.APPLICATION_PATH} className={`z-10 item-mapper relative md:block custom-link-underline white block font-medium px-8 md:px-0 md:py-2 md:pl-3 md:pr-4 ${fontItem?.size} ${fontItem?.color}`}>
                  {_.startCase(item.KEY.split("-").join(" "))}
                </Link>

              </li>

            ))}
          </ul>
        </div>
        <div className='lg:col-span-1 hidden'></div>
        <div className='col-span-6 md:col-span-4 flex flex-col relative z-10 md:ml-24'>
          {/* <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> */}
          <form className='flex flex-row'
            style={{
              // backdropFilter: "blur(1rem)",
              // boxShadow: "1.3rem 1.3rem 1.3rem rgba(0, 0, 0, 0.5)",
            }}
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?query=${searchQuery}`);
            }}
          >
            <TextField
              id="search-bar"
              className="text-[0.75rem] apple-linear-glass md:w-[350px] px-8 py-2 border-none font-poppins focus:outline-none"
              style={{
                color: "#fff",
                // backgroundColor: "rgba(225, 225, 225, 0.1)",
                borderRadius: "8px", outline: "none", border: "none",
              }}
              onInput={(e: any) => {
                setSearchQuery(e.target.value);
              }}
              sx={{ input: { color: '#fff', border: "none" } }}
              InputProps={{
                disableUnderline: true,
              }}
              // label="Enter a movie name"
              variant="standard"
              placeholder="Enter the movie name..."
              size="small"
            />
            <IconButton type='submit' onClick={() => router.push(`/search?query=${searchQuery}`)} aria-label="search" className=''>
              <SearchIcon style={{ fill: "white" }} />
            </IconButton>
          </form>
          {searchQuery &&
            <ul className='absolute md:mt-16 md:w-[500px] p-4 rounded-xl glass-effect z-10'>
              <h1 className='text-white text-sm font-medium text-center md:w-full'>Founded <span className='font-bold' style={{ color: "#45FFCA" }}>{totalSearchResults}</span> results</h1>
              {suggestions
                .slice(0, 5)
                .sort((a: Movie, b: Movie) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())
                .map((suggestion, index) => suggestion.poster_path !== null && (
                  <li
                    className={"flex flex-col hover:scale-105 duration-500 rounded-xl cursor-pointer md:mt-4"}
                    onMouseOver={handleMouseOver}
                    onMouseOut={handleMouseOut}
                    onClick={() => router.push(`/movies/${suggestion.id}`)
                    }
                    key={index}>
                    {searchResultHTML(suggestion, index)}
                  </li>
                ))}

              <Box textAlign='center' marginTop={4}>
                <Button
                  variant="contained"
                  className='md:m-auto hover:opacity-60 md:w-full font-poppins' style={{ background: "#D61355", outline: "none", color: "#fff" }} startIcon={<AddIcon />} onClick={() => router.push(`/search?query=${searchQuery}`)}>
                  More
                </Button>
              </Box>
            </ul>}
        </div>
        <div className='col-span-1 sm:col-span-2 md:col-span-2 lg:col-span-1'></div>
        <div className='col-span-3 md:col-span-2 lg:col-span-1 flex flex-col relative'>
          {currentUser !== null && isAuthenticated()
            ? <div className='col-span-2 flex flex-row justify-center items-center relative gap-4 cursor-pointer'>
              <Image className='rounded-full' src={currentUser.photo} width={50} height={50} style={{ height: "50px" }} alt=''></Image>
              <Link className='text-white font-medium text-sm hover:text-gray-300' href={`/profile`}>{currentUser.username}</Link>
              <ArrowDropDownIcon onClick={toggleDropdown} style={{ color: "#fff" }}></ArrowDropDownIcon>

            </div>
            : <button
              className='text-white bg-red-500 py-2 px-6 text-sm z-10 relative rounded-lg login-btn'
              onClick={() => router.push("/login")}
            >
              Login
            </button>
          }

          {dropdownOpen && (
            <ul className='flex flex-col justify-center items-center dropdown-container absolute md:left-4 util-box-shadow-light-mode md:top-[4rem] apple-linear-glass md:px-2 md:w-[180px] w-full rounded-2xl z-10' style={{ paddingTop: "0rem", paddingBottom: "2rem" }}>
              { /* Render dropdown items here */}
              <DropdownItem
                onClick={() => { }}
                url='/profile'
                icon={<AccountBoxIcon className='md:ml-[1rem]' style={{ color: "#fff" }}></AccountBoxIcon>} text='Profile' />
              <DropdownItem onClick={() => {
                logout().then(() => {
                  router.refresh();
                });
              }} icon={<AddToQueueIcon className='md:ml-[1rem]' style={{ color: "#fff" }}></AddToQueueIcon>} text='Log out' />
            </ul>
          )}

        </div>
      </nav>
    </header >
  )
}

function DropdownItem(props: DropdownProps) {
  return (
    <li className='dropdownItem md:w-full w-full relative md:mt-6 duration-1000 rounded-2xl'>
      {props.icon}
      <Link className='cursor-pointer text-white dropdown-text md:ml-6 text-center hover:text-red-500' href={`${props.url}`} onClick={props.onClick}> {props.text} </Link>
      {/* <div className='dropdown-line w-full md:w-[270px] absolute  md:top-[1.8rem]'></div> */}
    </li>
  );
}

export default Header