export const PREVIOUS_ROUTE_STORAGE_KEY = 'dgdb.previousRoute'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function setPreviousRoute(storage: StorageLike, route: string) {
  storage.setItem(PREVIOUS_ROUTE_STORAGE_KEY, route)
}

export function getPreviousRoute(storage: StorageLike) {
  return storage.getItem(PREVIOUS_ROUTE_STORAGE_KEY)
}

export function getClientSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}
