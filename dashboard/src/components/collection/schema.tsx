import Box from '@mui/material/Box'
import { useCollectionContext } from '@/providers/collection'
import Spin from '../spin'
import JSONView from '../json-view'

const CollectionSchema: React.FC = () => {
  const { schema, schemaLoading } = useCollectionContext('CollectionSchema')
  return (
    <Spin spin={schemaLoading}>
      <Box component="div" p={4}>
        <JSONView src={schema} />
      </Box>
    </Spin>
  )
}

export default CollectionSchema
