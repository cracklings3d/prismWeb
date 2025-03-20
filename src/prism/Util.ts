export function Check<T> (
  value: T | null | undefined,
  message: string = 'Invalid value'
): T {
  if (!value) {
    throw new Error(message)
  }
  return value
}
