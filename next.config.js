/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "http://erpsistem-env.eba-n5ubcteu.us-east-1.elasticbeanstalk.com/"
  },
}

module.exports = nextConfig
