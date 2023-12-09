"use client"
import { Cast } from '@/types';
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import { getCast } from '@/utils/clients.utils';



export default function Page() {
    const [cast, setCast] = useState<Cast|null>(null)
    const path = usePathname();
    const id = path.replace('/casts/', '');
    
    useEffect(() => {
        const fetchData = async () => {
          const response = await getCast(id) as Cast;
          console.log(response);
          setCast(response);
        };
        fetchData();
      }, [id]);
      if (!cast) {
        return <div>Loading...</div>;
      }

    return (
        <div className='relative flex'>
            <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt="Profile picture"></Image>
            <h1>{cast.name}</h1>
        </div>
    )
}

