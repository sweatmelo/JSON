// @ts-nocheck
import { useRef, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import LoadingButton from '@mui/lab/LoadingButton'

import { useCollectionContext } from '@/providers/collection'
import { useObjectContext } from '@/providers/object'
import { collectionSchemaToJson } from '@/utils'
import JSONView from '../json-view'

interface AddDialogProps { }

const AddDialog: React.FC<AddDialogProps> = () => {
  const { collectionName, schema, handleForceRefresh } = useCollectionContext('AddDialog')
  const { addDialog, handleAddDialogChange, submit } = useObjectContext('AddDialog')
  const dataCacheRef = useRef<Record<string, any>>({})
  const [submitLoadingState, setSubmitLoadingState] = useState<boolean>(false)

  const handleSubmit = async () => {
    if (!collectionName || Object.keys(dataCacheRef.current).length === 0) {
      return
    }
    setSubmitLoadingState(true)
    await submit(dataCacheRef.current)
    setSubmitLoadingState(false)
    handleForceRefresh()
    handleCancel()
  }

  const handleCancel = () => {
    handleAddDialogChange(false)
  }

  return (
    <Dialog open={addDialog} maxWidth="md">
      <DialogTitle>Add Object</DialogTitle>

      <DialogContent>
        <Box width={600} p={4}>
          <JSONView
            src={collectionSchemaToJson(schema)}
            onAdd={(e) => {
              dataCacheRef.current = e.updated_src
            }}
            onEdit={(e) => {
              dataCacheRef.current = e.updated_src
            }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Box>
          <Button sx={{ mr: 2 }} onClick={handleCancel}>
            Cancel
          </Button>
          <LoadingButton variant="contained" onClick={handleSubmit} loading={submitLoadingState}>
            Submit
          </LoadingButton>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AddDialog
