import { DemoFactory } from './demos/utils'
import { vanilla } from './demos/vanilla'
import './style.css'

const demos: { element: HTMLElement; factory: DemoFactory }[] = [
  {
    element: document.getElementById('vanilla-demo')!,
    factory: vanilla,
  },
]

demos.forEach((demo) => {
  demo.factory(demo.element)
})
