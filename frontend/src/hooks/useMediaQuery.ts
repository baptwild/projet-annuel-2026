import { useSyncExternalStore } from 'react'
import { ResponsiveSize } from '@/enums/MediaQuery'

const useMediaQuery = (query: ResponsiveSize): boolean => {
  const subscribe = (callback: () => void) => {
    const matchMediaList = globalThis.matchMedia(query)

    matchMediaList.addEventListener('change', callback)

    return () => matchMediaList.removeEventListener('change', callback)
  }

  const getSnapshot = () => globalThis.matchMedia(query).matches

  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export default useMediaQuery
