import { useState } from 'react'

export default function useLoading(initValue: boolean = false) {
  const [isLoading, setIsLoading] = useState<boolean>(initValue)
  const [isError, setIsError] = useState<boolean>(false)

  return { isLoading, setIsLoading, isError, setIsError }
}
