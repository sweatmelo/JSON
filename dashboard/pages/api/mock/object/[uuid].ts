import type { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  const {
    query: { uuid },
    method,
  } = req

  switch (method) {
    case 'GET':
      res.status(200).json({
        message: 'ok',
      })
      break
    case 'PUT':
      res.status(201).json({
        message: 'ok',
      })
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.end()
}

export default handler
