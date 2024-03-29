import { useEffect, useState } from "react"

export const useShowTemp = <T>(
  defaultElement: T,
  duration: number
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [element, setElement] = useState<T>(defaultElement)

  useEffect(() => {
    if (element === defaultElement) {
      return
    }

    const timer = setTimeout(() => setElement(defaultElement), duration)

    return () => clearTimeout(timer)
  }, [defaultElement, duration, element])

  return [element, setElement]
}
