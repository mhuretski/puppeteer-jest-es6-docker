const generatePassword = (length = 4,
        uppercase = true,
        lowercase = true,
        numbers = true,
        special = true) => {
  if (length < 0) {
    throw new Error(`Length can't be ${length}.`)
  }
  let result = ''
  const generateChars = (chars: string) => {
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
  }

  if (uppercase) {
    generateChars('ABCDEFGHIJKLMNOPQRSTUVWXYZ')
  }
  if (lowercase) {
    generateChars('abcdefghijklmnopqrstuvwxyz')
  }
  if (numbers) {
    generateChars('0123456789')
  }
  if (special) {
    generateChars('[!#$&*+/=?^_{|}~-]')
  }

  return result
}

export default generatePassword
