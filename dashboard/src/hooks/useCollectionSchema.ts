import { useEffect, useState } from 'react'
import { getCollectionSchema, ICollectionSchema } from '@/libs/service'

const schemaInitValue = {}

const useColletionSchema = (collectionName: string) => {
  const [dataState, setDataState] = useState<ICollectionSchema>(schemaInitValue)
  const [loadingState, setLoadingState] = useState<boolean>(false)

  useEffect(() => {
    setDataState(schemaInitValue)
    fetchCollectionSchema()
  }, [collectionName])

  const fetchCollectionSchema = async () => {
    setLoadingState(true)
    if (!collectionName) {
      setDataState(schemaInitValue)
      return
    }
    try {
      const result = await getCollectionSchema(collectionName)
      setDataState(result)
    } catch (e) {
      console.warn(e)
    }
    setLoadingState(false)
  }

  return {
    data: dataState,
    loading: loadingState,
    refresh: fetchCollectionSchema,
  }
}

export default useColletionSchema
