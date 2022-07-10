import type { NextApiHandler } from 'next'

const getMockData = {
  collections: ['Products', 'Parts'],
}

const handler: NextApiHandler = (req, res) => {
  const { method } = req

  switch (method) {
    case 'GET':
      res.status(200).json(getMockData)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.end()
}

export default handler
