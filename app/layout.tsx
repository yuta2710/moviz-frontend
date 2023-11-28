"use client";

import './globals.css'
import { AuthProvider, useAuth } from '@/components/context/AuthContext'
import Comp_Header from '@/components/layouts/header.component';
import { getMe } from '@/utils/clients.utils';
import { useEffect, useState } from 'react';

export const config = {
  HEADER_ITEM_PATH: [
    {
      APPLICATION_PATH: "/something",
      KEY: "something",
    },
    {
      APPLICATION_PATH: "/something2",
      KEY: "something2",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // const [customer, setCustomer] = useState(null);

  // useEffect(() => {
  //   getMe()
  //     .then(res => setCustomer(res.data))
  //     .catch((err) => console.log(err));
  // }, [])

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer"></link>
      </head>
      <body className='overflow-x-hidden md:overflow-x-hidden'>
        <AuthProvider>
          <Comp_Header
            logo={
              {
                photo: "",
                text: "SEPM"
              }
            }
            items={config.HEADER_ITEM_PATH}
            height='90px'
            fontItem={
              {
                // fam: "font-noto",
                size: "text-[0.7rem] md:text-sm",
                color: "text-white"
              }
            }
            fontLogo={
              {
                // fam: "",
                size: "text-5xl",
                color: "text-white"
              }
            }></Comp_Header>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
