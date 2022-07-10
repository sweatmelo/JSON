import type { NextApiHandler } from 'next'

const getMockData = {
  name: 'Name of the product',
  type: 'product type',
  create_date: 'date when the product was created',
  product_id: 'id of the product in the warehouse',
}

const handler: NextApiHandler = (req, res) => {
  const {
    query: { uuid },
    method,
  } = req

  switch (method) {
    case 'GET':
      res.status(200).json(getMockData)
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.end()
}

export default handler
