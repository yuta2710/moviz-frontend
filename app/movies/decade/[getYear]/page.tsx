"use client";

export default function Page({ params }: { params: { getYear: string } }) {
  return <p className="text-white">{params.getYear}</p>
}