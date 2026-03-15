export function isEmail(value: string) {
  const emailRegex = /^[a-zA-Z][a-zA-Z0-9_.+-]+@([a-zA-Z0-9-]+\.)+[a-z]{2,}$/
  return emailRegex.test(value)
}

export function isPhone(value: string) {
  const phoneRegex = /^\d{7,15}$/
  return phoneRegex.test(value)
}
