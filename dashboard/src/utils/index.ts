import type { ICollectionSchema, ICollectionSchemaValue } from '@/libs/service'

const createNewObject = () => {
  return Object.create({}) as Record<string, any>
}

function toJson(_value?: ICollectionSchema) {
  const result = createNewObject()
  if (_value) {
    Object.keys(_value).forEach((item) => {
      result[item] = getValue(_value[item])
    })
  }
  return result
}

function getValue(_value: ICollectionSchemaValue) {
  switch (_value.bsonType) {
    case 'string':
      return ''
    case 'object':
      return toJson(_value.properties)
    default:
      return ''
  }
}

export const collectionSchemaToJson = (value: ICollectionSchema) => {
  return toJson(value)
}
