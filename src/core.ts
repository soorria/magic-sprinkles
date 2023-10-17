import { MagicSprinklesCleanup, MagicSprinklesOptions, Sprinkle } from './types'
import {
  createNonRepeatRandomItem,
  drawLine,
  easeInOutCubic,
  withCanvasState,
} from './utils'

type CoreRendererOptions = Omit<MagicSprinklesOptions, 'root'> & {
  container: HTMLDivElement
  canvas: HTMLCanvasElement
}

const colors = {
  pink: '#ff7777',
  purple: '#ff00ff',
  red: '#ff0000',
  green: '#00ff00',
  cyan: '#00ffff',
  base: '#000000',
}
const availableSprinkleColors = [
  colors.pink,
  colors.purple,
  colors.green,
  colors.cyan,
]

const CELL_WIDTH = 30
const STROKE_WIDTH = 2
const CELL_HALF_WIDTH = CELL_WIDTH / 2
const RESET_DELAY_MS = 500 // 1000
const RESET_DURATION_MS = 1000
const PI = Math.PI
const TAU = PI * 2

const BASE_GRID_SIZE = 10

export const coreRenderer = ({
  container,
  canvas,
}: CoreRendererOptions): MagicSprinklesCleanup => {
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Could not get canvas context')
  }

  const { devicePixelRatio: ratio = 1 } = window

  const query = Object.fromEntries(new URLSearchParams(window.location.search))

  let width = 0
  let height = 0
  let frame: number | null
  let stopped = false

  /**
   * Position in canvas
   */
  let mouse = { x: -1000, y: -1000 }

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

  const availableSprinkles: Sprinkle[] =
    query.debugSprinkle || query.debugPattern
      ? [debugSprinkle]
      : [
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
        ]

  const getRandomXOffset = createNonRepeatRandomItem([-4, -2, 2, 4])
  const getRandomYOffset = createNonRepeatRandomItem([-4, -2, 2, 4])
  const getRandomColor = createNonRepeatRandomItem(availableSprinkleColors)
  const getRandomSprinkle = createNonRepeatRandomItem(availableSprinkles)

  const baseGridSprinklePattern = Array.from(
    { length: BASE_GRID_SIZE },
    (_, _row) =>
      Array.from({ length: BASE_GRID_SIZE }, (_, _column) => {
        return {
          sprinkle: getRandomSprinkle(),
          color: getRandomColor(),
          defaultAngle: query.debugNoRandomAngle ? 0 : Math.random() * TAU,
          lastAngle: 0,
          lastAngleTime: 0,
          xOffset: getRandomXOffset(),
          yOffset: getRandomYOffset(),
        }
      })
  )

  const flattenGrid = (grid: typeof baseGridSprinklePattern) =>
    grid
      .map((row, rowIdx) =>
        row.map((cell, colIdx) => ({
          ...cell,
          rowIdx,
          colIdx,
          x: colIdx * CELL_WIDTH + CELL_HALF_WIDTH + cell.xOffset,
          y: rowIdx * CELL_WIDTH + CELL_HALF_WIDTH + cell.yOffset,
        }))
      )
      .flat()
  let grid = flattenGrid(baseGridSprinklePattern)

  let set = false
  const resizeObserver = new ResizeObserver((entries) => {
    const rect = entries[0]!.contentRect

    console.log(structuredClone(rect))

    if (!entries.length || set) return

    width = rect.width
    height = rect.height

    canvas.width = width * ratio
    canvas.height = height * ratio
    // set = true

    const rows = Math.ceil(height / CELL_WIDTH)
    const columns = Math.ceil(width / CELL_WIDTH)

    grid = flattenGrid(
      Array.from({ length: rows }, (_, rowIdx) =>
        Array.from({ length: columns }, (_, colIdx) => {
          const row =
            baseGridSprinklePattern[rowIdx % baseGridSprinklePattern.length]!
          return structuredClone(row![colIdx % row.length]!)
        })
      )
    )
  })
  resizeObserver.observe(container)

  const handlePointerMove = (_e: MouseEvent | TouchEvent) => {
    const rect = canvas.getBoundingClientRect()
    const isTouch = _e.type === 'touchmove'

    if (isTouch) {
      const e = _e as TouchEvent
      if (e.touches.length !== 1) return
      const touch = e.touches[0]!
      mouse = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      }
    } else {
      const e = _e as MouseEvent

      mouse = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }
  }

  const addPointerListeners = () => {
    window.addEventListener('mousemove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handlePointerMove, { passive: true })
  }
  const removePointerListeners = () => {
    window.removeEventListener('mousemove', handlePointerMove)
    window.removeEventListener('touchmove', handlePointerMove)
  }

  addPointerListeners()

  const handleTouchUpDown = (e: TouchEvent) => {
    if (e.type === 'touchstart') {
      if (e.touches.length !== 1) return
      const touch = e.touches[0]!
      const isOnLink = !!(touch.target as HTMLElement).closest(
        'a,input,button,select,textarea'
      )
      console.log({ isOnLink })
      if (isOnLink) return

      const containerRect = container.getBoundingClientRect()
      const isOverContainer =
        touch.clientX >= containerRect.left &&
        touch.clientX <= containerRect.right &&
        touch.clientY >= containerRect.top &&
        touch.clientY <= containerRect.bottom

      console.log({ isOverContainer })

      if (!isOverContainer) return
      e.preventDefault()
      console.log(document.activeElement)
      ;(document.activeElement as HTMLElement)?.blur()
    } else if (e.type === 'touchend') {
      mouse = { x: -Infinity, y: -Infinity }
    }
  }
  window.addEventListener('touchstart', handleTouchUpDown, { passive: false })
  window.addEventListener('touchend', handleTouchUpDown)

  const draw = () => {
    if (stopped) return

    // console.time('draw')
    withCanvasState(ctx, () => {
      ctx.scale(ratio, ratio)

      ctx.clearRect(0, 0, width, height)

      const now = Date.now()

      const l = grid.length
      for (let i = 0; i < l; i++) {
        const cell = grid[i]!

        const dx = mouse.x - cell.x
        const dy = mouse.y - cell.y

        const inRange = dx ** 2 + dy ** 2 <= (CELL_WIDTH * 2.5) ** 2

        ctx.lineCap = 'round'
        ctx.lineWidth = STROKE_WIDTH

        withCanvasState(ctx, () => {
          ctx.translate(cell.x, cell.y)

          const color =
            cell.lastAngle !== cell.defaultAngle
              ? cell.color
              : `${cell.color}7f`

          ctx.strokeStyle = color

          let angle = cell.defaultAngle

          if (inRange) {
            let targetAngle = Math.atan2(dy, dx) + PI * 0.5
            const diff = targetAngle - cell.defaultAngle
            if (diff > PI) {
              targetAngle -= TAU
            } else if (diff < -PI) {
              targetAngle += TAU
            }
            cell.lastAngle = targetAngle
            if (targetAngle !== cell.defaultAngle) {
              cell.lastAngleTime = now
            }
            angle = targetAngle
          } else if (cell.lastAngle !== cell.defaultAngle) {
            const timeSinceLastAngle = now - cell.lastAngleTime
            if (timeSinceLastAngle < RESET_DELAY_MS) {
              angle = cell.lastAngle
            } else {
              angle =
                cell.lastAngle +
                (cell.defaultAngle - cell.lastAngle) *
                  easeInOutCubic(
                    (timeSinceLastAngle - RESET_DELAY_MS) / RESET_DURATION_MS
                  )
              const diff = Math.abs(angle - cell.defaultAngle)
              if (
                diff < 0.001 ||
                (cell.lastAngle < cell.defaultAngle &&
                  angle > cell.defaultAngle) ||
                (cell.lastAngle > cell.defaultAngle &&
                  angle < cell.defaultAngle)
              ) {
                angle = cell.defaultAngle
                cell.lastAngle = cell.defaultAngle
              }
            }
          }

          ctx.rotate(angle)
          for (const line of cell.sprinkle) {
            drawLine(ctx, line)
          }
        })
      }

      if (query.debugShowPointer) {
        ctx.fillStyle = 'red'
        ctx.beginPath()
        ctx.arc(mouse.x, mouse.y, 5, 0, TAU)
        ctx.fill()
      }
    })

    frame = requestAnimationFrame(draw)
  }

  draw()

  return () => {
    if (frame) {
      cancelAnimationFrame(frame)
    }

    resizeObserver.disconnect()

    window.removeEventListener('touchstart', handleTouchUpDown)
    window.removeEventListener('touchend', handleTouchUpDown)

    removePointerListeners()

    stopped = true
  }
}
