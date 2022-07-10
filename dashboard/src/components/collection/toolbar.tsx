// @ts-nocheck
import { Refresh } from '@mui/icons-material'
import { Box, IconButton } from '@mui/material'

const CollectionToolbar = () => {
  return (
    <Box component="div" textAlign="right">
      <IconButton>
        <Refresh />
      </IconButton>
    </Box>
  )
}

export default CollectionToolbar
