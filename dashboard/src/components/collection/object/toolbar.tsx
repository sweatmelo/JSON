// @ts-nocheck
import { useState, useRef, useMemo } from 'react'
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Theme,
  InputLabel, MenuItem, Select, Input, TextField, FormControl
} from '@mui/material'
import { Add, Delete, Update, Edit, Check } from '@mui/icons-material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Typography from '@mui/material/Typography'
import Popover from '@mui/material/Popover'
import LoadingButton from '@mui/lab/LoadingButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import IconButton from '@mui/material/IconButton'
import { deleteObeject } from '@/libs/service'
import { useObjectContext, objectInitValue } from '@/providers/object'
import { useCollectionContext } from '@/providers/collection'
import CollectionList from './link-list'
import useObjectSubObject from '@/hooks/useObjectSubObject'
import Spin from '@/components/spin'
// import { useRouter } from 'next/router'
import { Alert, Snackbar } from '@mui/material'
import { uploadFile, downloadFile, addObject, addLinkAfteruploadfile, deleteObject } from '@/libs/service'
const ObjectTool = ({ setFreshTag }) => {
  const [addLinkDialogState, setAddLinkDialogState] = useState<boolean>(false)
  const [deleteLinkDialogState, setDeleteLinkDialogState] = useState<boolean>(false)
  const [removeBtnTargetState, setRemoveBtnTargetState] = useState<HTMLButtonElement | null>(null)
  const [confirmDeleteLinkDialogState, setConfirmDeleteLinkDialogState] = useState<boolean>(false)
  const [uploadFileType, setUploadFileType] = useState('json')
  const [uploadVisible, setUploadVisible] = useState(false)
  const [isAddLinkSecondConfirm, setIsAddLinkSecondConfirm] = useState<boolean>(false)
  const [options, setOptions] = useState([{ label: 'create new Link', value: { value: 'create new Link', key: 'create new Link' } }])
  const [newLinkName, setNewLinkName] = useState('')
  const [newLinkType, setNewLinkType] = useState('')
  const { collectionName, handleForceRefresh, forceRefreshFlag } = useCollectionContext('CollectionTool')
  const { objectV, handleObjectVChange, update, objectAttributesCache, objectAttributes } = useObjectContext('CollectionTool')

  const curSubObject = useObjectSubObject(objectV.id, [forceRefreshFlag])
  const deleteLinkIdRef = useRef<string>('')
  const [currentType, setCurrentType] = useState('')
  const [changeLinkDialogState, setChangeLinkDialogState] = useState(false)
  // console.log('...', objectAttributes);
  const subObject = useMemo(() => {
    return curSubObject.data.map(e => {
      e.referName = objectAttributes.data[e.attribute_name]?.referenced_collection
      return e
    })
  }, [curSubObject])

  const UpdateRes = async () => {
    const res = await update()
    res?.message?.includes('sucessfull') && setUpdateSuccess(true)
    !res && setUpdateError(true)
    setFreshTag(e => !e)
  }
  //是否有两种link
  const isMulTypeLinks = useMemo(() => {
    let tag = 0
    setOptions([{ label: 'create new Link', value: { value: 'create new Link', key: 'create new Link' } }])
    Object.keys(objectAttributes.data).forEach(e => {
      console.log(objectAttributes.data[e]);
      if (objectAttributes.data[e] && typeof objectAttributes.data[e] === 'object' &&
        (Object.keys(objectAttributes.data[e]).includes('referenced_collection') || Object.keys(objectAttributes.data[e]).includes('referenced_collections'))) {
        // debugger
        tag++
        setOptions(ele => [...ele, {
          label: objectAttributes.data[e].referenced_collection, value: {
            key: objectAttributes.data[e].referenced_collection,
            value: e
          }
        }])
      }

    })
    return tag > 1
  }, [objectAttributes])
  const changeLink = (e) => {
    console.log(e)
    setCurrentType({ value: e.attribute_name, key: e.referName, _id: e._id })
    setChangeLinkDialogState(true)
  }
  //下载文件
  const downLoadFile = async () => {
    const elink = document.createElement('a')
    if (window.location.host !== 'http://localhost:3000/')
      elink.href = `https://iot.wzl-mq.rwth-aachen.de/am-database/api/file/download/${objectV.id}`
    else
      elink.href = `http://127.0.0.1:5000/file/download/${objectV.id}`
    elink.setAttribute('download', objectV.name)
    elink.style.display = 'none'
    document.body.appendChild(elink)
    setTimeout(() => {
      elink.click()
      document.body.removeChild(elink)
    }, 66)
  }
  const deleteAction = async () => {
    // debugger
    deleteObject(objectV.id)
    setFreshTag(e => !e)
  }
  const exportDoc = (data = objectAttributes.data, filename) => {
    if (!objectAttributes.data) {
      alert('no data');
      return;
    }
    if (!filename)
      filename = `${objectAttributes.data.name}.json`
    // let data;
    if (typeof data === 'object') {
      console.log(objectAttributes.data);
      data = JSON.stringify(objectAttributes.data, undefined, 2)
    }
    var blob = new Blob([data], { type: 'text/json' }),
      e = document.createEvent('MouseEvents'),
      a = document.createElement('a')
    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
  }
  const handleAddLink = async (e) => {
    const resultFile = document.getElementById('upload_file').files[0]
    console.log(resultFile)
    if (!resultFile.name.includes(uploadFileType === 'file' ? '' : 'json')) {
      alert('file type wrong')
      return
    }
    if (uploadFileType == 'json') {
      let reader = new FileReader();
      reader.readAsText(resultFile, 'UTF-8');
      reader.onload = function (e) {
        let data = this.result;
        console.log(data);
        addObject(collectionName, JSON.parse(data))
      }
    } else {
      const formData = new FormData();
      const params = {
        fiilename: resultFile.name,
      }
      formData.append('file', resultFile);
      await addLinkAfteruploadfile(objectV.id, formData)
      objectAttributes.refresh()
    }

    setUploadVisible(false)
    setTimeout(() => setFreshTag(e => !e), 500)

  }
  // }
  // handleAddLinkDialogClose()
  // }
  const handleAddLinkDialogShow = () => {
    // if (isMulTypeLinks) {
    setIsAddLinkSecondConfirm(true)
    // } else {
    // setAddLinkDialogState(true)
    // }
  }


  const handleSelect = (e) => {
    setCurrentType(e.target.value)
    if (e.target.value.value !== 'create new Link')
      setAddLinkDialogState(true)
  }
  const newLinkChange = e => {
    setNewLinkName(e.target.value)
  }

  const handleAddLinkDialogClose = () => {
    setNewLinkName('')
    setNewLinkType('')
    setCurrentType('')
    setIsAddLinkSecondConfirm(false)
    setAddLinkDialogState(false)
  }

  const handleRemove = async () => {
    try {
      await deleteObeject(objectV.id)
      handleObjectVChange(objectInitValue)
      setRemoveBtnTargetState(null)

      // force refresh collection tree list
      handleForceRefresh()
    } catch (e) {
      console.warn(e)
    }
  }

  const handleDeleteDialogShow = () => {
    setDeleteLinkDialogState(true)
  }

  const handleDeleteDialogOk = async (id?: string) => {
    if (id && typeof id === 'string') {
      deleteLinkIdRef.current = id
    }
    if (!confirmDeleteLinkDialogState) {
      setConfirmDeleteLinkDialogState(true)
      return;
    }

    let { links } = objectAttributesCache.current
    if (links) {
      links = links.filter((item: any) => item['$oid'] !== deleteLinkIdRef.current)
      objectAttributesCache.current = {
        ...objectAttributesCache.current,
        links,
      }
      await update()
      setFreshTag(e => !e)
    }
    handleConfirmDeleteDialogClose()
    handleDeleteDialogClose()
    objectAttributes.refresh()
    // const { refresh } = useObjectContext('ObjectAttributes')
    // refresh()

  }

  const handleDeleteDialogClose = () => {
    deleteLinkIdRef.current = ''
    setDeleteLinkDialogState(false)
  }

  const handleConfirmDeleteDialogClose = () => {
    setConfirmDeleteLinkDialogState(false)
  }
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState(false)
  return (
    <>
      <Snackbar
        open={updateSuccess}
        autoHideDuration={2000}
        onClose={() => setUpdateSuccess(false)}
      >
        <Alert severity="success">update success</Alert>
      </Snackbar>
      <Snackbar
        open={updateError}
        autoHideDuration={2000}
        onClose={() => setUpdateError(false)}
      >
        <Alert severity="error">update fail</Alert>
      </Snackbar>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        sx={{ width: '100%' }}
        py={2}
      >
        <Typography component="h2" fontSize={18} fontWeight="bold" textTransform="uppercase">
          <Box
            component="span"
            color={(theme: Theme) => theme.palette.primary.light}
            sx={{
              cursor: 'pointer',
            }}
            onClick={handleObjectVChange.bind(null, objectInitValue)}
          >
            {collectionName || 'None'}
          </Box>
          {objectV.name && (
            <Box component="span">
              <Box component="span" mx={1}>
                /
              </Box>
              {objectV.name}
            </Box>
          )}
        </Typography>
        {objectV.id && !objectAttributes.data.filepath && !objectAttributes.data.creation_date && (
          <Box>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              startIcon={<Add />}
              onClick={handleAddLinkDialogShow}
            >
              Add Link
            </Button>
            <Button
              variant="contained"
              sx={{ marginRight: 2 }}
              startIcon={<Update />}
              onClick={UpdateRes}
            >
              Update
            </Button>

            <LoadingButton
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
              startIcon={<Delete />}
              onClick={(e) => setRemoveBtnTargetState(e.currentTarget)}
            >
              Delete
            </LoadingButton>

            <Button
              variant="contained"
              color="error"
              sx={{ marginRight: 2 }}
              startIcon={<Delete />}
              onClick={handleDeleteDialogShow}
            >
              Edit Link
            </Button>

            <Popover
              id="removeObjectPopover"
              open={Boolean(removeBtnTargetState)}
              anchorEl={removeBtnTargetState}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Box px={6} py={2}>
                <Box mb={2}>Confirm delete</Box>
                <LoadingButton variant="contained" onClick={handleRemove} style={{ marginRight: '10px' }}>
                  Confirm
                </LoadingButton>
                <LoadingButton variant="contained" onClick={() => setRemoveBtnTargetState(null)}>
                  Cancel
                </LoadingButton>
              </Box>
            </Popover>


            <ButtonGroup>
              <Button onClick={exportDoc}>Export Doc</Button>
              <Button onClick={() => {
                setUploadFileType('file')
                setUploadVisible(true)
              }}>Import File</Button>
              {/* <Input type="file"></Input> */}

            </ButtonGroup>
          </Box>
        )}
        {/* files 目录下的特殊处理 */}
        {objectV.id && objectAttributes.data.filepath && objectAttributes.data.creation_date && collectionName !== '' && (
          <Box>
            <Button onClick={deleteAction} color="error">Delete</Button>
            <Button onClick={downLoadFile}>DownLoad file</Button>
          </Box>
        )}
        {/* collection 层下的导入json */}
        {JSON.stringify(objectAttributes.data) === '{}' && collectionName !== 'Files' && (
          <Box>
            <Button onClick={() => {
              setUploadVisible(true)
              setUploadFileType('json')
            }}>Import Document</Button>
          </Box>
        )}
        {/* upload */}
        <Dialog open={uploadVisible} fullWidth>
          <DialogTitle>upload</DialogTitle>
          <DialogContent>
            {/* <Select
onChange={(e) => setUploadFileType(e.target.value)}
variant="outlined"
value={uploadFileType}
placeholder="Please select"
>
{['file', 'json'].map((e) => (
<MenuItem key={e} value={e}>
{e}
</MenuItem>
))}
</Select> */}
            <Input type="file" id="upload_file"></Input>
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setUploadVisible(false)
            }}>Cancel</Button>
            <Button onClick={() => {
              handleAddLink()
            }}>upload</Button>
          </DialogActions>
        </Dialog>
        {/* add link */}
        <Dialog open={addLinkDialogState} fullWidth>
          <DialogTitle>Add Link</DialogTitle>
          <DialogContent>
            <CollectionList
              currentType={currentType}
              newLinkName={newLinkName}
              newLinkType={newLinkType}
              setFreshTag={setFreshTag}
              handleAddLinkDialogClose={handleAddLinkDialogClose} />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleAddLinkDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>
        {/*add */}
        <Dialog open={isAddLinkSecondConfirm} fullWidth>
          <DialogContent>
            <Select
              // value={options[0].value}
              onChange={handleSelect}
              variant="outlined"
              placeholder="Please select"
            >
              {options.map(({ value, label }) => (
                <MenuItem key={label} value={value}>
                  {value.value}
                </MenuItem>
              ))}
            </Select>
            {currentType.value === 'create new Link' && <TextField value={newLinkName} onChange={newLinkChange} style={{ marginLeft: '10px' }}>

            </TextField>}
            {/* {currentType === 'create new Link' && <Button onClick={() => setAddLinkDialogState(true)}>confirm</Button>} */}
            {currentType.value === 'create new Link' &&
              <FormControl fullWidth>
                <InputLabel id="select-label">linkType</InputLabel>
                <Select
                  label='linkType'
                  labelId="select-label"
                  onChange={(e) => {
                    setNewLinkType(e.target.value)
                    setAddLinkDialogState(true)
                    // setCurrentType({ value: '' })
                  }}
                // variant="outlined"
                >
                  {['list', 'single'].map((e) => (
                    <MenuItem key={e} value={e}>
                      {e}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsAddLinkSecondConfirm(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteLinkDialogState} fullWidth>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogContent>
            <Spin spin={curSubObject.loading}>
              <List>
                {
                  subObject.length === 0 ? 'None' :
                    subObject.map(
                      item => (
                        <ListItem secondaryAction={
                          <>
                            <IconButton>
                              <Edit onClick={() => changeLink(item)} />
                            </IconButton>
                            <IconButton onClick={handleDeleteDialogOk.bind(null, item._id)}>
                              <Delete />
                            </IconButton>
                          </>
                        }>{`${item.name} (${item.attribute_name})`}</ListItem>
                      ))
                }
              </List>
            </Spin>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>


        <Dialog open={confirmDeleteLinkDialogState}>
          <DialogTitle>Confirm delete Link</DialogTitle>
          <DialogActions>
            <Button variant="contained" onClick={handleDeleteDialogOk.bind(null, undefined)}>Confirm</Button>
            <Button onClick={handleConfirmDeleteDialogClose}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={changeLinkDialogState} fullWidth>
          <DialogTitle>Change Link</DialogTitle>
          <DialogContent>
            <CollectionList
              currentType={currentType}
              isChange={true}
              setFreshTag={setFreshTag}
              // newLinkName={newLinkName}
              // newLinkType={newLinkType}
              handleAddLinkDialogClose={() => {
                setChangeLinkDialogState(false)
                setCurrentType({ key: '', value: '' })
              }} />
          </DialogContent>

          <DialogActions>
            <Button onClick={() => {
              setChangeLinkDialogState(false)
              setCurrentType({ key: '', value: '' })
            }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  )
}

export default ObjectTool
