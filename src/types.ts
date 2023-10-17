export type MagicSprinklesCleanup = () => void

export type MagicSprinklesOptions = {
  root: HTMLElement
  // canvas?: HTMLCanvasElement
  // ignoreMouseOutside?: boolean
}

export type Point = [x: number, y: number]
export type Line = [Point, ...Point[]]
export type Sprinkle = [Line, ...Line[]]
