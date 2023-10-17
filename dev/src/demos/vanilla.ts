import { magicSprinkles } from '../../../src/index'
import { defineDemo } from './utils'

export const vanilla = defineDemo((root) => {
  return magicSprinkles({ root })
})
