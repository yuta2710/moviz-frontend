"use client"
import React, { useState, useEffect } from 'react';
import { Cast } from '@/types';
import { getCasts } from '@/utils/clients.utils';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { Box, Modal } from '@mui/material';

const Casts = ({ id }: { id: string }) => {
  const [casts, setCasts] = useState<Cast[]>([]);
  const [openCastInfo, setOpenCastInfo] = useState<boolean>(false);
  const [selectedCast, setSelectedCast] = useState<Cast | null>(null);

  const handleOpenCastInfo = async (id: string) => {
    try {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOTVhODkyNmVmNjJmYzJhNWMzY2EyMmI4YTk1YjkxYiIsInN1YiI6IjY0YjBlOTRjNGU0ZGZmMDBlMmY4OWM4OCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.uNP0Bt35sJlucLBeFZUCRvUv_1Si-S9CxsN_8cLhrBY',
        },
      };
      const response = await fetch(`https://api.themoviedb.org/3/person/${id}`, options);
      
      if (!response.ok) {
        // Handle error, maybe show an error message to the user
        console.error('Error fetching cast details:', response.statusText);
        return;
      }
  
      const data = await response.json();
      setSelectedCast(data); // Adjust this based on the actual structure of your API response
    } catch (error) {
      // Handle error
      console.error('Error fetching cast details:', error);
    }
  };
  

  const handleCloseCastInfo = () => {
    setSelectedCast(null);
  };
  

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
  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 800,
    height: 600,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "0.5rem",
    boxShadow: 24,
    p: 4,
    outline: "none",
    overflow: "auto",
  };


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
            <div className='flex flex-col w-28 h-max cast-key'>
              <Image src={`https://image.tmdb.org/t/p/original/${cast.profile_path}`} alt='cast-img' width={100} height={150} onClick={() => handleOpenCastInfo(cast.id)}></Image>
              <h2 className='text-sm font-bold text-white text-left md:mt-2'>{cast.name}</h2>
              <h2 className='text-[0.8rem] font-regular text-gray-400 md:mt-1'>{cast.character}</h2>
              
            </div>
          )
        ))}
        {selectedCast && (
        <Modal
          open={!!selectedCast}
          onClose={handleCloseCastInfo}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={style}
            style={
              {
               // backgroundImage:
               //   "radial-gradient( circle farthest-corner at 10% 20%,  rgba(100,43,115,1) 0%, rgba(4,0,4,1) 90% );"
              }
                  }
                  className="linear-reusable"
                >
                  <div className="z-10 relative md:mx-auto">
                    <Image
                      src={`https://image.tmdb.org/t/p/w500/${selectedCast.profile_path}`}
                      width={250}
                      height={250}
                      className="rounded-sm md:m-auto"
                      alt={`${selectedCast.name}`}
                    ></Image>
                    <h1 className="text-white text-center md:mt-8 text-[1.6rem]">
                      {selectedCast.name}
                    </h1>
                    <p className="text-white text-center md:mt-2">
                      D.O.B: {selectedCast.birthday}
                    </p>
                    <p className="text-white text-center md:mt-2">Place of Birth: {selectedCast.place_of_birth}</p>
                    <p className="text-white text-xl font-bold text-center md:mt-7">Biography</p>
                    <p className="text-white text-left md:mt-2">{selectedCast.biography}</p>
                    <p className="text-white text-center md:mt-2">{selectedCast.character}</p>
                  </div>
                  <div className="glowing">
                    <span className="--i:1;"></span>
                    <span className="--i:2;"></span>
                    <span className="--i:3;"></span>
                  </div>

                  <div className="glowing">
                    <span className="--i:1;"></span>
                    <span className="--i:2;"></span>
                    <span className="--i:3;"></span>
                  </div>

                  <div className="glowing">
                    <span className="--i:1;"></span>
                    <span className="--i:2;"></span>
                    <span className="--i:3;"></span>
                  </div>
                  <div className="glowing">
                    <span className="--i:1;"></span>
                    <span className="--i:2;"></span>
                    <span className="--i:3;"></span>
                  </div>
                </Box>
        </Modal>
      )}

      </div>
      
    </div>
  );
};


export default Casts