import { useState, useCallback } from "react"

export function useLoader(initialValue: boolean = false) {
  const [isLoading, setIsLoading] = useState(initialValue)

  const startLoading = useCallback(() => setIsLoading(true), [])
  const stopLoading = useCallback(() => setIsLoading(false), [])
  const toggleLoading = useCallback(() => setIsLoading((prev) => !prev), [])

  const executeWithLoader = useCallback(async <T>(asyncFunction: () => Promise<T>): Promise<T> => {
    setIsLoading(true)
    try {
      return await asyncFunction()
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    isLoading,
    startLoading,
    stopLoading,
    toggleLoading,
    executeWithLoader 
  }
}
