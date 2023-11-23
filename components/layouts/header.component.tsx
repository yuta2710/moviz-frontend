"use client"

import { HeaderProps } from '@/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { use, useEffect, useState } from 'react'
import _ from "lodash";
// import { getColorName } from '@/utils'
// import SplitType from 'split-type'
import gsap from 'gsap';
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { getMe } from '@/utils/clients.utils'


const Comp_Header = (header: HeaderProps) => {
  const { logo, items, background, textColorPalette, height, fontLogo, fontItem } = header
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  // useEffect(() => {
  //   const logo = document.querySelector(".logo");
  //   const split = new SplitType(logo as HTMLElement);

  //   gsap.set('.char', {
  //     opacity: 0
  //   })
  //   gsap.to('.char', {
  //     y: 0,
  //     stagger: 0.25,
  //     duration: .1,
  //     opacity: 1
  //   })
  // }, [])

  // useEffect(() => {
  //   document.querySelectorAll(".custom-link-underline").forEach(underline => {
  //     const item = new SplitType(underline as HTMLElement)
  //     gsap.set('.char', {
  //       opacity: 0
  //     })
  //     gsap.to('.char', {
  //       y: 0,
  //       stagger: 0.05,
  //       duration: .05,
  //       opacity: 1
  //     })
  //   })
  // }, [])

  // useEffect(() => {
  //   document.querySelectorAll(".custom-link-underline").forEach(underline => {
  //     const classNameObj = underline.className.split(" ")
  //     const extra = getColorName(fontItem?.color as string);
  //     classNameObj.push(extra);
  //     underline.className = classNameObj.join(" ")
  //   })
  // }, [fontItem?.color])

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

        {customer !== null ? <Image className='rounded-full absolute right-0 md:right-16' src={customer?.photo} width={50} height={50} alt=''></Image> : <button className=''>Login</button>}
      </nav>
    </header >
  )
}

export default Comp_Header
