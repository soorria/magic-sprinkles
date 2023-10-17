import { Sprinkle } from '../types'
import { definePreset } from '.'

const debugSprinkle: Sprinkle = [
  [
    [0, -7],
    [0, 2],
  ],
  [
    [-2, -3],
    [0, -7],
    [2, -3],
  ],
  [
    [0, 6],
    [0, 8],
  ],
]

export const debugPreset = definePreset({
  sprinkles: [debugSprinkle],
})
