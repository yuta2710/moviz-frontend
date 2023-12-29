"use client"
import React, { useState, useEffect } from 'react';
import { Cast } from '@/types';
import { getCasts } from '@/utils/clients.utils';
import Image from 'next/image';
import Link from 'next/link';

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

  if (casts.length === 0) {
    return <div>Loading...</div>;
  }

  console.log(casts);


  return (
    <div className='flex gap-3 flex-wrap'>
      {casts.map((cast) => (
        // <div>
        //   <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={100} height={150}></Image>
        //   <h2>{cast.name}</h2>
        //   <h2>{cast.character}</h2>
        // </div>
        cast.profile_path !== null && (
          <Link href={`/cast/${cast.id}`} className='flex flex-col w-28 h-max'>
            <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={100} height={150}></Image>
            <h2 className='text-sm font-bold text-gray-400'>{cast.name}</h2>
            <h2 className='text-sm font-light text-gray-400'>{cast.character}</h2>
          </Link>
        )
      ))}
    </div>
  );
};


export default Casts