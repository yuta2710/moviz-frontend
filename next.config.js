/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["sepm-bucket.s3.eu-west-1.amazonaws.com", "images.unsplash.com"],
  },
};

module.exports = nextConfig;
