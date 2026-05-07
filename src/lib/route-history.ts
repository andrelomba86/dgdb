export const ROUTE_STACK_STORAGE_KEY = 'dgdb.routeStack'

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

function readRouteStack(storage: StorageLike) {
  const rawStack = storage.getItem(ROUTE_STACK_STORAGE_KEY)
  if (!rawStack) {
    return [] as string[]
  }

  try {
    const parsed = JSON.parse(rawStack)
    return Array.isArray(parsed) ? parsed.filter(item => typeof item === 'string') : []
  } catch {
    return []
  }
}

function writeRouteStack(storage: StorageLike, stack: string[]) {
  storage.setItem(ROUTE_STACK_STORAGE_KEY, JSON.stringify(stack))
}

export function trackRouteVisit(storage: StorageLike, route: string) {
  const stack = readRouteStack(storage)
  if (stack[stack.length - 1] !== route) {
    stack.push(route)
    writeRouteStack(storage, stack)
  }
}

export function popPreviousRoute(storage: StorageLike, currentRoute: string) {
  const stack = readRouteStack(storage)
  if (stack[stack.length - 1] === currentRoute) {
    stack.pop()
  }

  const previousRoute = stack[stack.length - 1] ?? null
  writeRouteStack(storage, stack)
  return previousRoute
}

export function getClientSessionStorage() {
  if (typeof window === 'undefined') {
    return null
  }

  return window.sessionStorage
}
