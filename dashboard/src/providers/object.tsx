// @ts-nocheck
import { createContext, MutableRefObject, useContext, useEffect, useRef, useState } from 'react'
import { addObject, deleteObeject, IDocument, updateObjectAttributes } from '@/libs/service'
import type { IObejctAttributes } from '@/libs/service'
import useColletionSchema from '@/hooks/useCollectionSchema'
import { useCollectionContext } from './collection'
import type { IUseFetch } from '@/hooks'
import useObjectAttributes from '@/hooks/useObjectAttributes'

export enum ObjectModes {
  ADD,
  UPDATE,
}

export type TObject = Record<'id' | 'name' | 'key', string>
export const objectInitValue: TObject = {
  id: '',
  name: '',
  key: '',
}

interface IObjectContext {
  objectV: TObject
  handleObjectVChange(value: TObject): void

  handlerOpen: boolean
  handleHandlerOpenChange(value: boolean, mode?: ObjectModes): void

  submit(obj: IObejctAttributes): void
  update(): void
  delete(): void
  objectAttributesCache
  schema: IObejctAttributes

  addDialog: boolean
  handleAddDialogChange(value: boolean, mode?: ObjectModes): void

  objectAttributes: IUseFetch<IObejctAttributes>
  objectAttributesCache: MutableRefObject<IObejctAttributes>
}

const ObjectContext = createContext<IObjectContext | null>(null)

export const useObjectContext = (component: string) => {
  let context = useContext(ObjectContext)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <ObjectProvider /> component.`)
    Error.captureStackTrace && Error.captureStackTrace(err, useObjectContext)
    throw err
  }
  return context
}

interface ObjectProviderProps {
  children?: React.ReactNode
}

const ObjectProvider: React.FC<ObjectProviderProps> = ({ children }) => {
  const [objectState, setObjectState] = useState<TObject>(objectInitValue)
  const [handlerOpenState, setHandlerOpenState] = useState<boolean>(false)
  const [addDialogState, setAddDialogState] = useState<boolean>(false)
  const modeRef = useRef<ObjectModes>(ObjectModes.ADD)
  const objectAttributesCacheRef = useRef<IObejctAttributes>({})
  const { collectionName, handleForceRefresh } = useCollectionContext('ObjectProvider')
  const { data: schema } = useColletionSchema(collectionName)
  const objectAttributes = useObjectAttributes(objectState.id)

  useEffect(() => {
    handleObjectVChange(objectInitValue)
  }, [collectionName])

  useEffect(() => {
    objectAttributesCacheRef.current = objectAttributes.data
  }, [objectAttributes.data])

  const handleObjectVChange = (value: TObject) => {
    console.log('current object:', value)
    setObjectState(value)
  }

  const handleHandlerOpenChange = (value: boolean, mode: ObjectModes) => {
    modeRef.current = mode
    setHandlerOpenState(value)
  }

  const handleAddDialogChange = (value: boolean, mode?: ObjectModes) => {
    if (value) {
      modeRef.current = mode ?? ObjectModes.ADD
    }
    setAddDialogState(value)
  }

  // method

  const handleAdd = async (newObject: IObejctAttributes) => {
    try {
      console.log({
        collectionName,
        newObject,
      })
      await addObject(collectionName, newObject)
    } catch (e) {
      console.warn(e)
    }
  }

  const handleUpdate = async (data = null) => {
    console.log('update', objectAttributesCacheRef.current)
    debugger
    if (!objectState.id) {
      return
    }
    try {
      if (!data)
        await updateObjectAttributes(objectState.id, objectAttributesCacheRef.current)
      else
        await updateObjectAttributes(objectState.id, data)
      handleForceRefresh()
      await objectAttributes.refresh()
    } catch (e) {
      console.warn(e)
    }
  }

  const handleSubmit = (object: IObejctAttributes) => {
    switch (modeRef.current) {
      case ObjectModes.ADD:
        return handleAdd(object)
      case ObjectModes.UPDATE:
        return handleUpdate()
      default:
        break
    }
    handleAddDialogChange(false)
  }

  const handleDelete = async () => {
    if (!objectState.id) {
      return
    }
    try {
      await deleteObeject(objectState.id)
    } catch (e) {
      console.warn(e)
    }
  }

  const contextValue: IObjectContext = {
    objectV: objectState,
    handleObjectVChange,

    handlerOpen: handlerOpenState,
    handleHandlerOpenChange,

    submit: handleSubmit,
    update: handleUpdate,
    delete: handleDelete,

    schema,

    addDialog: addDialogState,
    handleAddDialogChange,

    objectAttributes,
    objectAttributesCache: objectAttributesCacheRef,
  }

  return <ObjectContext.Provider value={contextValue}>{children}</ObjectContext.Provider>
}

export default ObjectProvider
