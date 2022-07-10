// @ts-nocheck
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Close from '@mui/icons-material/Close'
import { styled } from '@mui/material/styles'

import Drawer from '@/components/drawer'
import { useObjectContext } from '@/providers/object'
import { DATABASE_HANDLER_PANEL_WIDTH } from '@/constants/config'
import ObjectAttributes from './attributes'
import ObjectSchema from './schema'

const CustomerDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ open }) => ({
    '& .MuiDrawer-paper': {
      width: DATABASE_HANDLER_PANEL_WIDTH,
      ...(!open && {
        width: 0,
      }),
    },
  })
)

const ObjectHandler: React.FC = () => {
  const { handlerOpen, handleHandlerOpenChange } = useObjectContext('ObjectHandler')

  const renderCloseBtn = () => {
    return (
      <IconButton
        color="error"
        onClick={() => {
          handleHandlerOpenChange(false)
        }}
      >
        <Close />
      </IconButton>
    )
  }

  return (
    <CustomerDrawer anchor="right" variant="permanent" open={handlerOpen}>
      <Box p={2}>
        <Box textAlign="right">{renderCloseBtn()}</Box>

        <ObjectAttributes />

        <Divider sx={{ my: 4 }} />

        <ObjectSchema />
      </Box>
    </CustomerDrawer>
  )
}

export default ObjectHandler
