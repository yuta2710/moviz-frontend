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
  const [expandedBiography, setExpandedBiography] = useState(false);

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
        console.error('Error fetching cast details:', response.statusText);
        return;
      }

      const data = await response.json();
      setSelectedCast(data);
    } catch (error) {
      console.error('Error fetching cast details:', error);
    }
  };
  const toggleBiographyExpansion = () => {
    setExpandedBiography(!expandedBiography);
  };

  const handleCloseCastInfo = () => {
    setSelectedCast(null);
    setExpandedBiography(false);
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
    width: 850,
    height: 600,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: "6rem",
    boxShadow: "0px 1px 0px 0px transparent inset, 0px 20px 100px 0px rgba(74, 57, 127, 0.7)",
    p: 4,
    outline: "none",
    overflow: "auto",
    display: 'flex',
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div className='flex flex-col justify-center items-center'>
      <h1 className='text-left text-2xl font-semibold text-white md:ml-16'>Casts</h1>
      <div className='grid grid-cols-3 md:grid-cols-6 md:mx-auto gap-8 flex-wrap md:px-16 md:mt-8'>
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
            style={{ borderRadius: 'xl' }}

          >
            <Box
              sx={style}
              style={
                {
                  backgroundImage:
                    "linear-gradient(-225deg, #FF3CAC 0%, #562B7C 52%, #2B86C5 100%)"
                }
              }
              className="util-box-shadow-purple-mode container mx-auto"
            >
              <div className="z-10 relative items-center justify-center">
                <div className='grid grid-cols-2 justify-center items-center'>
                  <div className='col-span-2 md:col-span-1 flex justify-center'>
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${selectedCast.profile_path}`}
                    width={300}
                    height={300}
                    className="rounded-full md:mx-auto md:my-auto "
                    alt={`${selectedCast.name}`}
                  ></Image>
                  </div>
                  <div className='flex flex-col col-span-2 md:col-span-1 justify-center'>
                    <h1 className="text-white font-bold text-[1.6rem]">
                      {selectedCast.name}
                    </h1>
                    <p className="text-white md:mt-2 font-medium">
                      D.O.B: {selectedCast.birthday || "N/A"}
                    </p>
                    <p className="text-white md:mt-2 font-medium">Place of Birth: {selectedCast.place_of_birth || "N/A"}</p>
                    <p className="text-white text-sm italic md:mt-5">
                      {selectedCast.biography.length > 1000
                        ? expandedBiography
                          ? selectedCast.biography
                          : `${selectedCast.biography.slice(0, 1000)}...`
                        : selectedCast.biography}
                      {selectedCast.biography.length > 1000 && (
                        <button
                          className='text-blue-500 hover:underline focus:outline-none'
                          onClick={toggleBiographyExpansion}
                        >
                          {expandedBiography ? ' Read Less' : ' Read More'}
                        </button>
                      )}
                    </p>
                  </div>
                </div>




              </div>

            </Box>
          </Modal>
        )}

      </div>

    </div>
  );
};


export default Casts