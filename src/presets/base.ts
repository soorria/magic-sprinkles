import { definePreset } from '.'

const colors = {
  pink: '#ff7777',
  purple: '#ff00ff',
  red: '#ff0000',
  green: '#00ff00',
  cyan: '#00ffff',
} as const
export const basePreset = definePreset({
  sprinkles: [
    //

    [
      [
        [-4, -9],
        [-3, 8],
      ],
      [
        [3, -7],
        [2, 6],
      ],
    ],

    [
      [
        [-3, -8],
        [-3, 8],
      ],
      [
        [3, -8],
        [3, 8],
      ],
    ],

    [
      [
        [-2, -9],
        [-3, 8],
      ],
      [
        [3, -7],
        [4, 6],
      ],
    ],

    [
      [
        [-3, -9],
        [-4, -3],
        [-4, 0],
        [-3, 6],
      ],
      [
        [4, -9],
        [3, -3],
        [2, 0],
        [2, 3],
        [3, 6],
      ],
    ],

    //
  ],
  colors: [colors.pink, colors.purple, colors.red, colors.green, colors.cyan],
})
