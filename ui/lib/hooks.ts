import { RefObject, useEffect, useRef, useState } from 'react'

interface IParams {
  ref: RefObject<any>
  callback: () => void
  enabled: boolean
}

export function useClickOutside({ ref, callback, enabled }: IParams) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback
  useEffect(() => {
    if (!enabled) return

    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callbackRef.current()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, enabled])
}
