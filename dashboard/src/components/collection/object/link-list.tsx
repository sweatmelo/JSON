// @ts-nocheck
import { Fragment, MouseEventHandler, useEffect, useId, useState } from 'react'
import List from '@mui/material/List'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import ListItem, { ListItemProps } from '@mui/material/ListItem'
import { ArrowRightOutlined, Add } from '@mui/icons-material'

import Drawer from '@/components/drawer'
import theme from '@/libs/theme'
import { getCollectionTree, IDocument, getSubObject } from '@/libs/service'
import { useCollectionContext } from '@/providers/collection'
import { useObjectContext, ObjectModes, TObject } from '@/providers/object'
import useAllCollections from '@/hooks/useAllCollections'
import { DATABASE_LIST_PANEL_WIDTH } from '@/constants/config'
import Spin from '../../spin'
import { Alert, Snackbar } from '@mui/material'

interface HoverListItemProps extends ListItemProps {
  active?: boolean
}

const CustomerDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ open }) => ({
    '& .MuiDrawer-paper': {
      width: DATABASE_LIST_PANEL_WIDTH,
      ...(!open && {
        width: 0,
      }),
    },
  })
)

const HoverListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<HoverListItemProps>(({ theme, active }) => ({
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ':hover': {
    color: 'white',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
  },
  ...(active && {
    color: 'white',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
  }),
}))

interface CollectionItemProps {
  name: string
  onSuccess(): void
  onError(msg: string): void
  currentType?: object,
  newLinkName?: string
  newLinkType?: string,
  handleAddLinkDialogClose(): void


}

const CollectionItem: React.FC<CollectionItemProps> = ({ name, onError, onSuccess, currentType,
  newLinkName, newLinkType, handleAddLinkDialogClose }) => {
  const [treeDataState, setTreeDataState] = useState<IDocument[]>([])
  //展开状态
  const [openState, setOpenState] = useState<boolean>(false)
  const { collectionName, handleCollectionNameChange, forceRefreshFlag } =
    useCollectionContext('CollectionItem')
  const parentName = name
  // const { handleAddDialogChange } = useObjectContext('CollectionItem')

  useEffect(() => {
    if (openState) {
      handleFetchCollectionTree()
    }
  }, [forceRefreshFlag])

  const handleClick = () => {
    if (!openState) {
      handleFetchCollectionTree()
    }
    setOpenState(!openState)
  }
  //获取子目录数据
  const handleFetchCollectionTree = async () => {
    try {
      const { documents } = await getCollectionTree(name)
      setTreeDataState(documents)
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <Fragment>
      <HoverListItem onClick={handleClick}>
        <ArrowRightOutlined
          sx={{
            marginRight: 2,
            transform: `rotate(${openState ? 90 : 0}deg)`,
            transition: theme.transitions.create(['transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        />
        <ListItemText primary={name} />
      </HoverListItem>

      <Collapse in={openState} timeout="auto" unmountOnExit>
        {treeDataState.length > 0 &&
          treeDataState.map(({ _id, name }) => (
            <CollectionItemBeta
              key={_id}
              objectV={{ id: _id, name }}
              level={1}
              onSuccess={onSuccess}
              onError={onError}
              currentType={currentType}
              parentName={parentName}
              newLinkName={newLinkName}
              newLinkType={newLinkType}
              handleAddLinkDialogClose={handleAddLinkDialogClose}

            />
          ))}
      </Collapse>
    </Fragment>
  )
}

interface CollectionItemBetaProps {
  objectV: Omit<TObject, 'key'>
  level: number,
  parentName: string,
  onSuccess(): void
  onError(msg: string): void,
  handleAddLinkDialogClose(): void
}

const CollectionItemBeta: React.FC<CollectionItemBetaProps> = ({
  objectV: { id: objectId, name: objectName },
  level,
  onError,
  onSuccess,
  currentType,
  newLinkName,
  newLinkType,
  parentName,
  handleAddLinkDialogClose

}) => {
  const [dataState, setDataState] = useState<IDocument[]>([])
  const [openState, setOpenState] = useState<boolean>(false)
  const { forceRefreshFlag, handleForceRefresh } = useCollectionContext('CollectionItemBeta')
  const { objectV, handleObjectVChange, objectAttributesCache, update } =
    useObjectContext('CollectionItemBeta')
  const id = useId()

  useEffect(() => {
    if (dataState.length > 0) {
      setOpenState(true)
    }
  }, [dataState])

  useEffect(() => {
    if (openState) {
      handleFetchSubObject()
    }
  }, [forceRefreshFlag, openState])

  const handleClick = () => {
    setOpenState(!openState)
  }
  //处理添加link
  const handleAddLink: MouseEventHandler = (e) => {
    e.stopPropagation()
    // debugger
    if (newLinkName && newLinkType === 'list') {
      objectAttributesCache.current[newLinkName] = {
        "referenced_collection": parentName,
        object_references: []
      }
      objectAttributesCache.current[newLinkName].object_references.push({
        $oid: objectId,
      })
      update()
      onSuccess()
    } else if (newLinkName && newLinkType === 'single') {
      objectAttributesCache.current[newLinkName] = {
        "referenced_collection": parentName,
        object_reference: {
          $oid: objectId,
        }
      }
      update()
      onSuccess()
    } else {
      let links = objectAttributesCache.current[currentType.value]
      if (links.object_reference) {
        onError('The single Link can not add link')
        return
      }
      if (Array.isArray(links.object_references)) {
        const exsit = links.object_references.findIndex((item: any) => item['$oid'] === objectId)
        if (exsit >= 0) {
          onError('The link already exists')
          return
        }
        links.object_references.push({
          $oid: objectId,
        })
        console.log('new value', objectAttributesCache.current)
        //手动触发更新
        update()
        onSuccess()
      }
    }
    handleAddLinkDialogClose()
  }
  //获取子目录
  const handleFetchSubObject = async () => {
    try {
      const { documents } = await getSubObject(objectId)
      setDataState(documents)
    } catch (e) {
      console.warn(e)
    }
  }

  const renderAction = () => {
    return (
      <Fragment>
        <IconButton color="inherit" size="small" onClick={handleAddLink}>
          <Add />
        </IconButton>
      </Fragment>
    )
  }

  return (
    <Box>
      <HoverListItem
        active={objectV.key === id}
        sx={{ pl: (level + 1) * 2 }}
        onClick={handleClick}
        secondaryAction={renderAction()}
      >
        <ArrowRightOutlined
          sx={{
            marginRight: 2,
            transform: `rotate(${openState ? 90 : 0}deg)`,
            transition: theme.transitions.create(['transform'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          }}
        />
        <ListItemText primary={objectName} />
      </HoverListItem>
      <Collapse in={openState} timeout="auto" unmountOnExit>
        {dataState.length > 0 &&
          dataState.map(({ _id, name }) => (
            <CollectionItemBeta
              key={_id}
              objectV={{ id: _id, name }}
              level={level + 1}
              onSuccess={onSuccess}
              onError={onError}
            />
          ))}
      </Collapse>
    </Box>
  )
}

interface CollectionListProps {
  type?: 'drawer' | 'dialog',
  currentType?: object | string,
  newLinkName?: string
  newLinkType?: string,
  handleAddLinkDialogClose(): void
}

const CollectionList: React.FC<CollectionListProps> = ({ type = 'dialog', currentType, newLinkType,
  newLinkName, handleAddLinkDialogClose }) => {
  const [addLinkSuccessState, setAddLinkSuccessState] = useState<boolean>(false)
  const [addLinkErrorState, setAddLinkErrorState] = useState<boolean>(false)
  const [addLinkErrorMsgState, setAddLinkErrorMsgState] = useState<string>('')
  const { data: collectionList, loading: collectionLoading } = useAllCollections()

  const handleSuccess = () => {
    if (addLinkSuccessState) {
      return
    }
    setAddLinkSuccessState(true)
  }

  const handleError = (msg: string) => {
    setAddLinkErrorMsgState(msg)
    if (addLinkErrorState) {
      return
    }
    setAddLinkErrorState(true)
  }

  return (
    <Fragment>
      {/* tip message */}
      <Snackbar
        open={addLinkSuccessState}
        autoHideDuration={2000}
        onClose={() => setAddLinkSuccessState(false)}
      >
        <Alert severity="success">Add link success</Alert>
      </Snackbar>
      <Snackbar
        open={addLinkErrorState}
        autoHideDuration={2000}
        onClose={() => setAddLinkSuccessState(false)}
      >
        <Alert severity="error">{addLinkErrorMsgState}</Alert>
      </Snackbar>

      <List component="nav">
        <Spin spin={collectionLoading}>
          {currentType.value !== 'create new Link' ? collectionList.filter(e => e.name === currentType.key).map(({ name }) => (
            <CollectionItem
              onError={handleError}
              onSuccess={handleSuccess}
              key={name}
              name={name}
              currentType={currentType}
              newLinkName={newLinkName}
              newLinkType={newLinkType}
              handleAddLinkDialogClose={handleAddLinkDialogClose}
            />
          )) : collectionList.map(({ name }) => (
            <CollectionItem
              onError={handleError}
              onSuccess={handleSuccess}
              key={name}
              currentType={currentType}
              newLinkName={newLinkName}
              newLinkType={newLinkType}
              name={name}
              handleAddLinkDialogClose={handleAddLinkDialogClose}
            />
          ))}
        </Spin>
      </List>
    </Fragment>
  )
}

export default CollectionList
