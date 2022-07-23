import type { NextApiHandler } from 'next'

const testData = {
  documents: [
    {
      _id: '6274028973a912881a3085e9',
      name: 'engine',
      documents: [
        {
          _id: '6274098453a912881a3085e9',
          name: 'engine cover',
        },
        {
          _id: '6083743973a912881a3085e9',
          name: 'transmission',
        },
        {
          _id: '1293801293a912881a3085e9',
          name: 'electric motor',
        },
        {
          _id: '6274028973a123124a3085e9',
          name: 'Max Mustermann',
        },
      ],
    },
    {
      _id: '6274028973a912881a3085e9',
      name: 'chair',
      documents: [
        {
          _id: '6274028973a912881a8953f3',
          name: 'legs',
        },
        {
          _id: '6274028973a463539g4650f0',
          name: 'backrest',
        },
        {
          _id: '6274003856r4899543a3085e9',
          name: 'polishing',
        },
        {
          _id: '1293898g3509802342a3085e9',
          name: 'Miriam Mustermann',
        },
      ],
    },
  ],
}

const handler: NextApiHandler = (req, res) => {
  const {
    query: { name },
    method,
  } = req

  // console.log(name)

  switch (method) {
    case 'GET':
      res.status(200).json(testData)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }

  res.end()
}

export default handler
