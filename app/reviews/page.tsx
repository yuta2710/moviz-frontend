"use client";

import Image from "next/image";
import { getMe, getMovies, getReviews } from "@/utils/clients.utils";
import { Movie, Review, User } from "@/types";
import letterboxd, { Letterboxd } from "letterboxd-api";
import React, { ReactElement } from "react";

// Log function to check the data is correct or not. 
function logItems(items: ReviewCustomization[]) {
  console.log("Items = ", items);
  const diaryEntries = items.filter((item) => item.type === "diary");
  const lists = items.filter((item) => item.type === "list");
  console.log("");
  console.log(`Diary entries (${diaryEntries.length}):\n`);
  diaryEntries.map((diaryEntry) => {
    if ("film" in diaryEntry) {
      console.log(`  + ${diaryEntry.film.title} (${diaryEntry.uri})\n`);
    }
  });
  console.log(`\nLists (${lists.length}):\n`);
  items.map((item) => {
    if ("medium" in item.film.image) {
      console.log(item.film.image.medium)
    }

  });
  console.log("");
}


export default async function Page(): Promise<ReactElement> {
  // const reviews = await letterboxd("akickedsandwich") as ReviewCustomization[];
  const reviews = await letterboxd("akickedsandwich") as ReviewCustomization[];
  logItems(reviews);

  console.log("Reviews = ", reviews);

  return (
    <div>
      <ul>
        {reviews.map((review) => (
          <React.Fragment key={review.type}>
            <li className="text-white">
              <Image src={review.film.image.large} width={250} height={250} alt="" priority></Image>
            </li>
            <li className="text-white">{review.film.title}</li>
            <li className="text-white">{review.film.year}</li>
            <li className="text-white">{review.review}</li>
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

// Extend the Letterboxd type
export type ReviewCustomization = Letterboxd & {
  film: {
    title: string;
    year: string;
    image: { tiny: string; medi: string; medium: string; large: string; };
  };
  review?: string;
};