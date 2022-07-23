// @ts-nocheck
import { useEffect, useRef } from 'react'
import type { InteractionProps } from 'react-json-view'
import Box from '@mui/material/Box'
import useObjectAttributes from '@/hooks/useObjectAttributes'
import Spin from '@/components/spin'
import JSONView from '@/components/json-view'
import { useObjectContext } from '@/providers/object'



const ObjectAttributes: React.FC = ({ freshTag }) => {
  const { objectAttributes, objectAttributesCache } = useObjectContext('ObjectAttributes')
  const { data } = useObjectAttributes(objectAttributes?.data?._id?.$oid, freshTag)
  console.log(freshTag)
  const handleEdit = (e: InteractionProps) => {
    console.log(e.updated_src)
    objectAttributesCache.current = e.updated_src
  }

  return (
    <Spin spin={objectAttributes.loading}>
      <Box component="div" p={4}>
        <JSONView src={data} onAdd={handleEdit} onEdit={handleEdit} onDelete={handleEdit} />
      </Box>
    </Spin>
  )
}

export default ObjectAttributes
