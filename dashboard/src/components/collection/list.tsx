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
import { getCollectionTree, IDocument, getSubObject, getLinkList, getSubName, getPreName } from '@/libs/service'
import { useCollectionContext } from '@/providers/collection'
import { useObjectContext, ObjectModes, TObject, objectInitValue } from '@/providers/object'
// import { useObjectContext, objectInitValue } from '@/providers/object'
import useAllCollections from '@/hooks/useAllCollections'
import { DATABASE_LIST_PANEL_WIDTH } from '@/constants/config'
import Spin from '../spin'

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
}

const CollectionItem: React.FC<CollectionItemProps> = ({ name }) => {
  const [treeDataState, setTreeDataState] = useState<IDocument[]>([])
  const [openState, setOpenState] = useState<boolean>(false)
  const { collectionName, handleCollectionNameChange, forceRefreshFlag } =
    useCollectionContext('CollectionItem')
  const isActive = collectionName === name
  const { handleAddDialogChange } = useObjectContext('CollectionItem')
  const { objectV, handleObjectVChange } = useObjectContext('CollectionItem')


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
    handleCollectionNameChange(name)
    handleObjectVChange(objectInitValue)
  }

  const handleAddClick: MouseEventHandler = (e) => {
    // e.preventDefault();
    e.stopPropagation()
    handleAddDialogChange(true, ObjectModes.ADD)
  }

  const handleDeleteClick: MouseEventHandler = (e) => {
    // e.preventDefault();
    e.stopPropagation()
  }

  const handleFetchCollectionTree = async () => {
    try {
      const { documents } = await getCollectionTree(name)
      setTreeDataState(documents)
    } catch (e) {
      console.warn(e)
    }
  }

  const renderAction = () => {
    return isActive ? (
      <Fragment>
        <IconButton color="inherit" size="small" onClick={handleAddClick}>
          <Add />
        </IconButton>
      </Fragment>
    ) : null
  }

  return (
    <Fragment>
      <HoverListItem
        active={collectionName === name}
        secondaryAction={collectionName !== 'Files' ? renderAction() : null}
        onClick={handleClick}
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
        <ListItemText primary={name} />
      </HoverListItem>

      <Collapse in={openState} timeout="auto" unmountOnExit>
        {treeDataState.length > 0 &&
          treeDataState.map(e => ({ ...e, pN: collectionName })).map(({ _id, name, pN }) => (
            <CollectionItemBeta key={_id} objectV={{ id: _id, name }} pN={pN} level={1} />
          ))}
      </Collapse>
    </Fragment>
  )
}

interface CollectionItemBetaProps {
  objectV: Omit<TObject, 'key'>
  level: number
}

const CollectionItemBeta: React.FC<CollectionItemBetaProps> = ({
  objectV: { id: objectId, name: objectName, attribute_name },
  level,
  pN
}) => {
  const [dataState, setDataState] = useState<IDocument[]>([])
  const [openState, setOpenState] = useState<boolean>(false)
  const { forceRefreshFlag, handleCollectionNameChange } = useCollectionContext('CollectionItemBeta')
  const { objectV, handleObjectVChange } = useObjectContext('CollectionItemBeta')
  const id = useId()
  useEffect(() => {
    // reSet()
  }, [objectV.id])
  useEffect(() => {
    if (dataState.length > 0) {
      setOpenState(true)
    }

    // console.log(res)
  }, [dataState])

  useEffect(() => {
    if (openState) {
      handleFetchSubObject()
    }
  }, [forceRefreshFlag, openState])

  const handleClick = () => {
    setOpenState(!openState)
    handleCollectionNameChange(pN)
    handleObjectVChange({
      key: id,
      id: objectId,
      name: objectName,
      attribute_name
    })
  }
  const reSet = () => {
    // setTimeout(() => {
    getPreName(objectId).then(res => {
      console.log(res);
      handleCollectionNameChange(res);
    })
    // }, 1000)

  }
  const handleFetchSubObject = async () => {
    try {
      const { documents } = await getSubObject(objectId)
      // const { documents } = await getLinkList(objectId)

      setDataState(documents)
    } catch (e) {
      console.warn(e)
    }
  }

  return (
    <Box>
      <HoverListItem active={objectV.key === id} sx={{ pl: (level + 1) * 2 }} onClick={() => {
        handleClick()
        reSet()
      }

      }>
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
        {!attribute_name && <ListItemText primary={`${objectName}`} />}
        {attribute_name && <ListItemText primary={`${objectName} (${attribute_name})`} />}
      </HoverListItem>
      <Collapse in={openState} timeout="auto" unmountOnExit>
        {dataState.length > 0 &&
          dataState.map(({ _id, name, attribute_name }) => (
            <CollectionItemBeta key={_id} objectV={{ id: _id, name, attribute_name }} level={level + 1} />
          ))}
      </Collapse>
    </Box>
  )
}

const CollectionList: React.FC = ({ freshTag }) => {
  const { data: collectionList, loading: collectionLoading } = useAllCollections(freshTag)
  //第一层的collection
  return (
    <CustomerDrawer variant="permanent" open>
      <List component="nav">
        <Spin spin={collectionLoading}>
          {collectionList.map(({ name }) => (
            <CollectionItem key={name} name={name} />
          ))}
        </Spin>
      </List>
    </CustomerDrawer>
  )
}

export default CollectionList
