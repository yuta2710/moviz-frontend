"use client";

import './globals.css'
import { AuthProvider, useAuth } from '@/components/context/AuthContext'
import Header from '@/components/layouts/header.component';
import { getMe } from '@/utils/clients.utils';
import { useEffect, useState } from 'react';

export const config = {
  HEADER_ITEM_PATH: [
    {
      APPLICATION_PATH: "/home",
      KEY: "home",
    },
    {
      APPLICATION_PATH: "/movies",
      KEY: "movies",
    },
    // {
    //   APPLICATION_PATH: "/reviewsfeed",
    //   KEY: "reviewsfeed",
    // },
    {
      APPLICATION_PATH: "/news",
      KEY: "news",
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en" className=''>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"></link>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='anonymous'></link>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
          integrity="sha512-z3gLpd7yknf1YoNbCzqRKc4qyor8gaKU1qmn+CShxbuBusANI9QpRohGBreCFkKxLhei6S9CQXFEbbKuqLg0DA==" crossOrigin="anonymous" referrerPolicy="no-referrer"></link>
      </head>
      <body className='overflow-x-hidden md:overflow-x-hidden'>
        <AuthProvider>
          <Header
            logo={
              {
                photo: "",
                text: "Moviz"
              }
            }
            items={config.HEADER_ITEM_PATH}
            background='glass'
            height='90px'
            fontItem={
              {
                size: "text-[0.7rem] md:text-sm",
                color: "text-white"
              }
            }
            fontLogo={
              {
                size: "text-4xl",
                color: "text-white"
              }
            }>
          </Header>
          {children}

        </AuthProvider>
      </body>
    </html>
  )
}
