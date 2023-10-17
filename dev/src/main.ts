import { DemoFactory, DemoFactoryCleanup } from './demos/utils'
import { vanilla } from './demos/vanilla'
import './style.css'

const getDemoElement = (demoContainerId: `${string}-demo`) =>
  document.querySelector<HTMLElement>(`#${demoContainerId} > .magic-sprinkles`)!

type DemoConfig = {
  id: string
  title: string
  element: HTMLElement
  factory: DemoFactory
}

const demos: DemoConfig[] = [
  {
    id: 'vanilla',
    title: 'Vanilla JS',
    element: getDemoElement('vanilla-demo')!,
    factory: vanilla,
  },
]

const DEMO_TEMPLATE = document.querySelector(
  '#demo-template'
) as HTMLTemplateElement
const createDemo = (
  config: DemoConfig
): {
  root: HTMLElement
  cleanup?: void | (() => void)
} => {
  const root = DEMO_TEMPLATE.content.cloneNode(true) as HTMLElement
  const title = root.querySelector('h2')!
  title.textContent = config.title

  const section = root.querySelector('section')!
  section.id = config.id

  const demoWrapper = root.querySelector('.magic-sprinkles')! as HTMLElement

  const cleanup = config.factory(demoWrapper)

  return {
    root,
    cleanup,
  }
}

const cleanups: DemoFactoryCleanup[] = []
const ROOT = document.querySelector('#demos')!
demos.forEach((config) => {
  const demo = createDemo(config)
  ROOT.append(demo.root)
  if (demo.cleanup) {
    cleanups.push(demo.cleanup)
  }
})
