const isDev = process.env.NODE_ENV === 'development'

const API_HOST_DEV = 'http://127.0.0.1:5000'
const API_HOST_ONLINE = 'https://iot.wzl-mq.rwth-aachen.de/am-database/api'

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  basePath: '/am-database',
  publicRuntimeConfig: {
    API_HOST: isDev ? API_HOST_DEV : API_HOST_ONLINE,
  },
  env: {
    PORT: 3005,
  },
  experimental: {
    outputStandalone: true,
  },
}
