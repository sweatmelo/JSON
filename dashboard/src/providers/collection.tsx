import { createContext, useState, useContext } from 'react'
import useColletionSchema from '@/hooks/useCollectionSchema'
import { ICollectionSchema } from '@/libs/service'

interface ICollectionContext {
  collectionName: string
  handleCollectionNameChange(value: string): void

  schema: ICollectionSchema
  schemaLoading: boolean

  forceRefreshFlag: number
  handleForceRefresh(): void
}

const CollectionContext = createContext<ICollectionContext | null>(null)

export const useCollectionContext = (component: string) => {
  let context = useContext(CollectionContext)
  if (context === null) {
    const err = new Error(`<${component} /> is missing a parent <CollectionProvider /> component.`)
    Error.captureStackTrace && Error.captureStackTrace(err, useCollectionContext)
    throw err
  }
  return context
}

interface CollectionProviderProps {
  children?: React.ReactNode
}

const CollectionProvider: React.FC<CollectionProviderProps> = ({ children }) => {
  const [collectionNameState, setCollectionNameState] = useState<string>('')
  const [refreshFlagState, setRefreshFlagState] = useState<number>(0)
  const { data: schema, loading: schemaLoading } = useColletionSchema(collectionNameState)

  const handleCollectionNameChange = (value: string) => {
    console.log('current document:', value)
    setCollectionNameState(value)
  }

  const handleForceRefresh = () => {
    setRefreshFlagState(refreshFlagState + 1)
  }

  const contextValue: ICollectionContext = {
    collectionName: collectionNameState,
    handleCollectionNameChange,

    schema,
    schemaLoading,

    forceRefreshFlag: refreshFlagState,
    handleForceRefresh,
  }

  return <CollectionContext.Provider value={contextValue}>{children}</CollectionContext.Provider>
}

export default CollectionProvider
