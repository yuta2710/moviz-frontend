"use client"

import { HeaderProps, User } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { ReactNode, useEffect, useState } from 'react'
import _ from "lodash";
import { useAuth } from '../context/AuthContext'
import { getMe } from '@/utils/clients.utils'
import { Grid, Icon, Typography } from '@mui/material';
import AddToQueueIcon from '@mui/icons-material/AddToQueue';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface DropdownProps {
  icon: ReactNode;
  text: string;
}


const Comp_Header = (header: HeaderProps) => {
  const { logo, items, background, height, fontLogo, fontItem } = header
  const [customer, setCustomer] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    if (isAuthenticated() && user !== null) {
      const fetchData = async () => {
        try {
          const json = await getMe();
          setCustomer(json.data);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    } else {
      setLoading(false);
      // router.push("/login")
    }
  }, [isAuthenticated]);

  return (
    <header className={`md:w-full md:h-[${height}] absolute md:-left-[10rem] md:z-10 md:px-[16rem] md:py-[2rem] ${background}`}>
      <nav className={`nav-container md:mx-auto flex justify-between items-center sm:px-16 md:px-6 md:py-4 bg-transparent`}>
        <Link href='/' className='flex justify-center items-center'>
          {logo?.photo && (
            <Image
              src={logo.photo}
              alt='logo'
              width={50}
              height={50}
              className='object-contain'
            />
          )}
          <span className={`self-center relative left-[2rem] md:left-[0rem] top-[4rem] md:top-[0rem] text-[2.5rem] md:text-5xl font-semibold whitespace-nowrap logo block ${fontLogo?.fam} ${fontLogo?.size} ${fontLogo?.color}`}>
            {logo?.text}
          </span>

        </Link>
        <div className="w-[1000px] absolute left-[8rem] md:left-[80rem] mt-[3.5rem] md:mt-auto md:block md:w-full">
          <ul className="items-container font-medium flex flex-row p-4 md:p-0 mt-4 md:flex-row md:space-x-8 md:mt-0 border-0 md:border-0">
            {items.map(item => (
              <li className='z-10' key={item.KEY}>
                <Link href={item.APPLICATION_PATH} className={`z-10 item-mapper relative md:block custom-link-underline block font-medium px-8 md:px-0 md:py-2 md:pl-3 md:pr-4 ${fontItem?.fam} ${fontItem?.size} ${fontItem?.color}`}>
                  {_.startCase(item.KEY.split("-").join(" "))}
                </Link>
              </li>

            ))}
          </ul>
        </div>

        <div className='flex flex-col absolute md:left-[100rem] left-[25rem] md:w-full w-full'>
          {customer !== null
            ? <div className='flex flex-row justify-center items-center relative md:w-full w-full md:left-[-50rem] gap-4 cursor-pointer'>
              <Image className='rounded-full right-0 md:right-16' src={customer?.photo} width={50} height={50} alt=''></Image>
              <ArrowDropDownIcon onClick={toggleDropdown} style={{ color: "#fff" }}></ArrowDropDownIcon>
            </div> : <button className=''>Login</button>}
          {dropdownOpen && (
            <ul className='flex flex-col justify-center items-center dropdown-container absolute md:left-0 md:top-[6rem] bg-white md:px-2 md:w-[180px] w-full rounded-sm' style={{ paddingTop: "0rem", paddingBottom: "2rem" }}>
              { /* Render dropdown items here */}
              <DropdownItem icon={<AddToQueueIcon className='md:ml-[1rem]' style={{ color: "#000" }}></AddToQueueIcon>} text='Item 1' />
              <DropdownItem icon={<AddToQueueIcon className='md:ml-[1rem]' style={{ color: "#000" }}></AddToQueueIcon>} text='Item 2' />
              <DropdownItem icon={<AddToQueueIcon className='md:ml-[1rem]' style={{ color: "#000" }}></AddToQueueIcon>} text='Item 2' />

              {/* Add more items as needed */}
            </ul>
          )}

        </div>
      </nav>
    </header >
  )
}

function DropdownItem(props: DropdownProps) {
  return (
    <li className='dropdownItem md:w-full w-full relative md:mt-6'>
      {props.icon}
      <Link className='text-black dropdown-text md:ml-6 text-center' href={"#"}> {props.text} </Link>
      {/* <div className='dropdown-line w-full md:w-[270px] absolute  md:top-[1.8rem]'></div> */}
    </li>
  );
}

export default Comp_Header
