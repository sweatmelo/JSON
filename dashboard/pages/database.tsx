import { Fragment } from 'react'
import Head from 'next/head'
import CollectionComp from '@/components/collection'
import { WEBSITE } from '@/constants/config'

const DatabasePage = () => {
  return (
    <Fragment>
      {/* <Head>
        <title>DataBase | {WEBSITE.title}</title>
      </Head> */}

      <CollectionComp />
    </Fragment>
  )
}

export default DatabasePage
