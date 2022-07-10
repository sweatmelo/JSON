import { useObjectContext } from '@/providers/object'
import Spin from '../../spin'

const ObjectSchema: React.FC = () => {
  const { schema } = useObjectContext('ObjectSchema')
  return (
    <Spin>
      {/* {Object.keys(schema).map((item) => (
        <div key={item}>
          <span>{item}: </span>
          <span>{schema[item]}</span>
        </div>
      ))} */}
    </Spin>
  )
}

export default ObjectSchema
