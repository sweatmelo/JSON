import { useEffect, useState } from 'react'
import { getAllCollection } from '@/libs/service'
import type { ICollection } from '@/libs/service'

const useAllCollections = () => {
  const [dataState, setDataState] = useState<ICollection[]>([])
  const [loadingState, setLoadingState] = useState<boolean>(false)

  useEffect(() => {
    fetchDataList()
  }, [])

  const fetchDataList = async () => {
    setLoadingState(true)
    try {
      const { collections } = await getAllCollection()
      setDataState(collections)
    } catch (e) {
      console.warn(e)
    }
    setLoadingState(false)
  }

  return {
    data: dataState,
    loading: loadingState,
    refresh: fetchDataList,
  }
}

export default useAllCollections
