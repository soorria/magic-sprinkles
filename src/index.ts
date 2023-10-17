import { coreRenderer } from './core'
import { MagicSprinklesCleanup, MagicSprinklesOptions } from './types'

export const magicSprinkles = (
  options: MagicSprinklesOptions
): MagicSprinklesCleanup => {
  const { root, ...delegatedOptions } = options
  const container = document.createElement('div')
  container.setAttribute(
    'style',
    'position: relative; width: 100%; height: 100%'
  )
  const canvas = document.createElement('canvas')
  canvas.setAttribute(
    'style',
    'position: absolute; top: 0; left: 0; width: 100%; height: 100%'
  )
  container.append(canvas)

  if (root.hasChildNodes()) {
    console.warn('magicSprinkles: root already element has child nodes')
  }
  root.append(container)

  return coreRenderer({
    container,
    canvas,
    ...delegatedOptions,
  })
}
