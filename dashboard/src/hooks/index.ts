export interface IUseFetch<T> {
  data: T
  loading: boolean
  refresh(): void
}
