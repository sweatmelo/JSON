// @ts-nocheck
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useCollectionContext } from '@/providers/collection'
import { useObjectContext } from '@/providers/object'
import ObjectAttributes from './object/attributes'
import CollectionSchema from './schema'

const View: React.FC = ({ freshTag }) => {
  const { collectionName } = useCollectionContext('View')
  const { objectV } = useObjectContext('View')

  if (!collectionName) {
    return (
      <Box py={6} textAlign="center">
        <Typography>Nothing here</Typography>
      </Box>
    )
  }

  return objectV.id ? <ObjectAttributes freshTag={freshTag} /> : <CollectionSchema />
}

export default View
