import { getSubObject, IDocument } from '@/libs/service'
import { DependencyList, useEffect, useState } from 'react'

const useObjectSubObject = (id: string, deps?: DependencyList) => {
  const [dataState, setDataState] = useState<IDocument[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(false)

  useEffect(() => {
    handleFetchData()
  }, [id, ...(deps || [])])

  const handleFetchData = async () => {
    if (!id) {
      if (dataState.length) {
        setDataState([])
      }
      return
    }

    setLoadingState(true)
    try {
      const { documents } = await getSubObject(id)
      setDataState(documents)
    } catch (e) {
      console.warn(e)
    }
    setLoadingState(false)
  }

  return {
    data: dataState,
    loading: loadingState,
    refresh: handleFetchData,
  }
}

export default useObjectSubObject
