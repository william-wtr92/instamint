import { useEffect, useState } from "react"

export const useShowTemp = <T>(
  defaultElement: T,
  duration: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [element, setElement] = useState<T>(defaultElement)

  useEffect(() => {
    const timer = setTimeout(() => setElement(defaultElement), duration)

    return () => clearTimeout(timer)
  }, [defaultElement, duration, setElement])

  return [element, setElement]
}
