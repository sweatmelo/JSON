import { NextPageContext } from 'next'
import Router from 'next/router'

const basePath = '/am-database'

/**
 * @todo auth user
 */
const auth = (context: NextPageContext) => {
  const { pathname } = context

  const redirect = (location: string) => {
    const { res } = context
    if (typeof res !== 'undefined') {
      res.writeHead(302, { Location: location })
      res.end()
    } else {
      Router.push(location)
    }
  }

  if (pathname === '/' || pathname === '/_error') {
    redirect(`${basePath}/home`)
  }
}

export default auth
