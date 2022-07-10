import api from './api'
import apiDef from '@/constants/api'

export interface ICollection {
  name: string
}

export const getAllCollection = async (useMock?: boolean) => {
  const result = await api.get<{ collections: string[] }>(apiDef.getAllCollection, {
    useMock,
  })

  return { collections: result.collections.map((item) => ({ name: item })) as ICollection[] }
}

export interface IDocument {
  _id: string
  name: string
  documents?: IDocument[]
}

export const getCollectionTree = (collName: string, useMock?: boolean) => {
  return api.get<{ documents: IDocument[] }>(`${apiDef.handleCollectionsTree}${collName}`, {
    useMock,
  })
}

export interface ICollectionSchemaValue {
  bsonType: string
  properties?: ICollectionSchema
}

export interface ICollectionSchema {
  [key: string]: ICollectionSchemaValue
}

export const getCollectionSchema = (collName: string, useMock?: boolean) => {
  return api.get<ICollectionSchema>(`${apiDef.handleCollectionsSchema}${collName}`, {
    useMock,
  })
}

interface TmpSubObject {
  name: string
  _id: string
}

const tmpSubObjectPrefix = `{'$oid': '`
const tmpSubObjectSuffix = `'}`

export const getSubObject = async (id: string) => {
  debugger
  const { documents } = await api.get<{ documents: TmpSubObject[] }>(
    `${apiDef.handleObjSubObj}${id}`
  )
  return {
    documents: documents.map((item) => ({
      _id: item._id.replace(tmpSubObjectPrefix, '').replace(tmpSubObjectSuffix, ''),
      name: item.name,
    })),
  }
}

export interface IObejctAttributes {
  [key: string]: any
}

export const getObjectAttributes = (id: string, useMock?: boolean) => {
  return api.get<IObejctAttributes>(`${apiDef.handleObjectAttributes}${id}`, {
    useMock,
  })
}

export const updateObjectAttributes = (
  id: string,
  payload: IObejctAttributes,
  useMock?: boolean
) => {
  return api.put(`${apiDef.handleObjectAttributes}${id}`, {
    data: payload,
    useMock,
  })
}

export const addObject = (collName: string, payload: IObejctAttributes, useMock?: boolean) => {
  console.log(apiDef.handleAddObject)
  return api.post(`${apiDef.handleAddObject}${collName}`, {
    data: payload,
    useMock,
  })
}

export const deleteObeject = (id: string, useMock?: boolean) => {
  return api.delete(`${apiDef.handleObject}${id}`, {
    useMock,
  })
}

export const uploadFile = (data: any, useMock?: boolean) => {
  return api.post(`/upload/file`, {
    data,
    useMock
  })
}
