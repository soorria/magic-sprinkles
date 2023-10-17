export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

export const randomIndex = (arr: unknown[]): number => random(0, arr.length - 1)

export const createNonRepeatRandomItem = <T>(arr: T[]): (() => T) => {
  let lastIndex: number | null = null

  if (arr.length === 1) {
    return () => arr[0]!
  }

  return () => {
    let index = randomIndex(arr)

    while (index === lastIndex) {
      index = randomIndex(arr)
    }

    lastIndex = index

    return arr[index]!
  }
}
