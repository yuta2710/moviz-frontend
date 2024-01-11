"use client"
import React, { useState, useEffect } from 'react';
import { Cast } from '@/types';
import { getCasts } from '@/utils/clients.utils';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';

const Casts = ({ id }: { id: string }) => {
  const [casts, setCasts] = useState<Cast[]>([]);

  useEffect(() => {
    const fetchCasts = async () => {
      try {
        const castData = await getCasts(id);
        const castArray: Cast[] = castData.cast;
        setCasts(castArray);
      } catch (error) {
        console.error('Error fetching casts:', error);
      }
    };

    fetchCasts();
  }, [id]);

  useEffect(() => {
    const castKeys = Array.from(document.querySelectorAll(".cast-key"));
    gsap.set(castKeys, {
      opacity: 0,
      y: -50,
    });
    gsap.to(castKeys, {
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      opacity: 1,
    });
  }, [casts.length > 0])

  if (casts.length === 0) {
    return <div>Loading...</div>;
  }

  console.log(casts);


  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-left text-2xl font-semibold text-white md:ml-16'>Casts</h1>
      <div className='grid grid-cols-6 md:mx-auto gap-8 flex-wrap md:px-16 md:mt-8'>
        {casts.map((cast) => (
          // <div>
          //   <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={100} height={150}></Image>
          //   <h2>{cast.name}</h2>
          //   <h2>{cast.character}</h2>
          // </div>
          cast.profile_path !== null && (
            <Link href={`/cast/${cast.id}`} className='flex flex-col w-28 h-max cast-key'>
              <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={100} height={150}></Image>
              <h2 className='text-sm font-bold text-white text-left md:mt-2'>{cast.name}</h2>
              <h2 className='text-[0.8rem] font-regular text-gray-400 md:mt-1'>{cast.character}</h2>
            </Link>
          )
        ))}
      </div>
    </div>
  );
};


export default Casts