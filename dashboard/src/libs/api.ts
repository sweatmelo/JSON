import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'
import nextConfig from 'next/config'
import { isServer } from '@/utils/is'

interface RequestConfig extends AxiosRequestConfig {
  useMock?: boolean
}

const axiosInstance = axios.create()

// next.config.js nextConfig.publicRuntimeConfig
const { API_HOST } = nextConfig().publicRuntimeConfig

// Get mock url
const getMockBaseURL = () => {
  // pages/api/mock/path/to/some
  const result = '/api/mock'
  if (!isServer()) {
    return result
  }

  const port = parseInt(process.env.PORT || '3000', 10)
  return `http://127.0.0.1:${port}${result}`
}

const request = async <T = any>(url: string, config: RequestConfig): Promise<T> => {
  const { useMock = false, ...restConfig } = config

  try {
    const { data: result } = await axiosInstance.request({
      ...restConfig,
      baseURL: useMock ? getMockBaseURL() : API_HOST,
      url,
    })

    return result
  } catch (e) {
    // TODO
    // You can handle request errors uniformly here
    throw e
  }
}

const api = {
  get<T = unknown>(url: string, config: RequestConfig = {}) {
    return request<T>(url, {
      ...config,
      method: 'GET',
    })
  },
  post<T = unknown>(url: string, config: RequestConfig = {}) {
    return request<T>(url, {
      ...config,
      method: 'POST',
    })
  },
  put<T = unknown>(url: string, config: RequestConfig = {}) {
    return request<T>(url, {
      ...config,
      method: 'PUT',
    })
  },
  delete(url: string, config: RequestConfig = {}) {
    return request(url, {
      ...config,
      method: 'DELETE',
    })
  },
}

export default api
