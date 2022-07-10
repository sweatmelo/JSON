import type { NextApiHandler } from 'next'

const getMockData = {
  name: 'BMW car engine',
  type: 'engine',
  create_date: '11.3.2022',
  product_id: 5623,
}

const handler: NextApiHandler = (req, res) => {
  const {
    query: { uuid },
    method,
  } = req

  console.log(uuid)

  switch (method) {
    case 'GET':
      res.status(200).json(getMockData)
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
