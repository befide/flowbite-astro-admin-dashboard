import { isObject } from "./merge-deep"

export function mergeDeep(
  target: object | object[],
  ...sources: unknown[]
): unknown {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    if (
      source instanceof Object ||
      source instanceof Array
    ) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!target[key])
            Object.assign(target, { [key]: {} })
          mergeDeep(target[key], source[key])
        } else {
          Object.assign(target, { [key]: source[key] })
        }
      })
    }
  }

  return mergeDeep(target, ...sources)
}
