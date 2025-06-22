export const ObjectId = () => {
  return (
    Math.floor(Date.now() / 1000).toString(16) +
    ' '
      .repeat(16)
      .replace(/./g, () => Math.floor(Math.random() * 16).toString(16))
  )
}
