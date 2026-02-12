export function isEmail(value: string) {
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-z]{2,}$/
  return emailRegex.test(value)
}
