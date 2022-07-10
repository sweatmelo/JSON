import { useEffect, useState } from 'react'
import { getCollectionTree } from '@/libs/service'
import type { IDocument } from '@/libs/service'

const useCollectionTree = (collName: string) => {
  const [list, setList] = useState<IDocument[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true)
      try {
        const res = await getCollectionTree(collName)
        setList(res.documents)
      } catch (e) {
        console.warn(e)
      }
      setLoading(false)
    }

    // exec
    if (collName) {
      fetchList()
    }
  }, [collName])

  return {
    list,
    loading,
  }
}

export default useCollectionTree
