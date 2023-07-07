/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    //API_URL: "http://erpsistem-env.eba-n5ubcteu.us-east-1.elasticbeanstalk.com/"
    API_URL: "http://127.0.0.1:8080/"
  },
}

module.exports = nextConfig
