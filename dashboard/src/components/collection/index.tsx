// @ts-nocheck
import { Box, Container, Divider } from '@mui/material'
import CollectionProvider from '@/providers/collection'
import ObjectProvider from '@/providers/object'
import theme from '@/libs/theme'
import ObjectTool from './object/toolbar'
import ObjectHandler from './object/handler'
import CollectionList from './list'
import View from './view'
import AddDialog from './add-dialog'
import { useState } from 'react'

const DatabaseComp: React.FC = () => {
  const [freshTag, setFreshTag] = useState(false)
  return (
    <Box display="flex" height="calc(100% - 64px)">
      <CollectionProvider>
        <ObjectProvider>
          <CollectionList freshTag={freshTag} />
          <Container
            maxWidth="lg"
            sx={{
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.standard,
              }),
            }}
          >
            <ObjectTool setFreshTag={setFreshTag} />
            <Divider />
            <View />
            <AddDialog />
          </Container>
          <ObjectHandler />
        </ObjectProvider>
      </CollectionProvider>
    </Box>
  )
}

export default DatabaseComp
