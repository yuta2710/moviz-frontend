"use client";

export default function Page({ params }: { params: { papa: string } }) {
  return <p className="text-white">{params.papa}</p>
}