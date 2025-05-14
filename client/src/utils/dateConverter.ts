const dateConverter = (dateString: string): string => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  }

  return date.toLocaleDateString(undefined, options)
}

export default dateConverter
