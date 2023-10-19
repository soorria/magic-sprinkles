import { Line } from './types'

export type NonEmptyArray<T> = [T, ...T[]]

export const random = (min: number, max: number): number => {
  return Math.round(Math.random() * (max - min) + min)
}

export const randomIndex = (arr: unknown[]): number => random(0, arr.length - 1)

export const createNonRepeatRandomItem = <T>(
  arr: NonEmptyArray<T>
): (() => T) => {
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

export function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * Math.pow(x, 3) : 1 - Math.pow(-2 * x + 2, 3) / 2
}

export const withCanvasState = (
  ctx: CanvasRenderingContext2D,
  fn: () => void
) => {
  ctx.save()
  fn()
  ctx.restore()
}

export const drawLine = (ctx: CanvasRenderingContext2D, line: Line) => {
  ctx.beginPath()
  const [point, ...rest] = line
  ctx.moveTo(point[0], point[1])

  for (const p of rest) {
    ctx.lineTo(p[0], p[1])
  }
  ctx.stroke()
}
