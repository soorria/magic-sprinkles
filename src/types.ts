import { NonEmptyArray } from './utils'

export type MagicSprinklesCleanup = () => void

export type MagicSprinklesOptions = {
  root: HTMLElement
  // ignoreMouseOutside?: boolean
  sprinkles?: NonEmptyArray<Sprinkle>

  /**
   * Currently only supports 6-character hex colors since we append
   * 2 characters to make it transparent.
   */
  colors?: NonEmptyArray<`#${string}`>
}

type PartiallyRequired<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type MagicSprinklesPreset = PartiallyRequired<
  Omit<MagicSprinklesOptions, 'root'>,
  'sprinkles' | 'colors'
>

export type Point = [x: number, y: number]
export type Line = NonEmptyArray<Point>
export type Sprinkle = NonEmptyArray<Line>
