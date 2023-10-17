export type MagicSprinklesCleanup = () => void

export type MagicSprinklesOptions = {
  root: HTMLElement
  // ignoreMouseOutside?: boolean
  sprinkles?: Sprinkle[]
}

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type MagicSprinklesPreset = PartiallyRequired<
  Omit<MagicSprinklesOptions, 'root'>,
  'sprinkles'
>

type NonEmptyArray<T> = [T, ...T[]]

export type Point = [x: number, y: number]
export type Line = NonEmptyArray<Point>
export type Sprinkle = NonEmptyArray<Line>
