// @ts-nocheck
import { Fragment } from 'react'
// import Head from 'next/head'
import { Box, Typography } from '@mui/material'
import DatabaseSelect from '@/components/database-select'
// import { WEBSITE } from '@/constants/config'

const HomePage = () => {
  return (
    <Fragment>
      {/* <Head>
        <title>Home | {WEBSITE.title}</title>
      </Head> */}

      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="100%"
      >
        <Typography component="h1" fontSize="32px" marginBottom="24px">
          Database Management
        </Typography>
        <DatabaseSelect />
      </Box>
    </Fragment>
  )
}

export default HomePage
