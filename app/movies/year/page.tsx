"use client";

export default function Page({ params }: { params: { slug: string } }) {
  return <p className="text-white">{params.slug}</p>
}