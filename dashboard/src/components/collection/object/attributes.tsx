// @ts-nocheck
import { useEffect, useRef } from 'react'
import type { InteractionProps } from 'react-json-view'
import Box from '@mui/material/Box'

import Spin from '@/components/spin'
import JSONView from '@/components/json-view'
import { useObjectContext } from '@/providers/object'



const ObjectAttributes: React.FC = () => {
  const { objectAttributes, objectAttributesCache } = useObjectContext('ObjectAttributes')

  const handleEdit = (e: InteractionProps) => {
    console.log(e.updated_src)
    objectAttributesCache.current = e.updated_src
  }

  return (
    <Spin spin={objectAttributes.loading}>
      <Box component="div" p={4}>
        <JSONView src={objectAttributes.data} onAdd={handleEdit} onEdit={handleEdit} onDelete={handleEdit} />
      </Box>
    </Spin>
  )
}

export default ObjectAttributes
