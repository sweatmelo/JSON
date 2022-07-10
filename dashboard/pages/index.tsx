import { Fragment } from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { Box, CircularProgress } from '@mui/material'
import { WEBSITE } from '@/constants/config'

const IndexPage: NextPage = () => {
  return (
    <Fragment>
      <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    </Fragment>
  )
}

export default IndexPage
