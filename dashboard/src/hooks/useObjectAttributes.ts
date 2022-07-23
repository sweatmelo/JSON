import { useEffect, useState } from 'react'
import { getObjectAttributes } from '@/libs/service'

const useObjectAttributes = (id?: string, fresh?: boolean) => {
  const [data, setData] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    fetchObjectAttributes()
  }, [id, fresh])

  const fetchObjectAttributes = async () => {
    setLoading(true)
    if (!id) {
      setData({})
    } else {
      try {
        const result = await getObjectAttributes(id)
        setData(result)
      } catch (e) {
        console.warn(e)
      }
    }
    setLoading(false)
  }

  return { data, loading, refresh: fetchObjectAttributes }
}

export default useObjectAttributes
