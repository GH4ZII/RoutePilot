import { useCallback, useEffect, useState } from 'react'
import { ApiError } from './api'

export function useAsync<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const reload = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const result = await loader()
      setData(result)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Noe gikk galt')
      }
    } finally {
      setIsLoading(false)
    }
  }, deps)

  useEffect(() => {
    reload()
  }, [reload])

  return { data, error, isLoading, reload, setError }
}
