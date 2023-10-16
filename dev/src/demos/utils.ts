export type DemoFactory = (element: HTMLElement) => void

export const defineDemo = (factory: DemoFactory) => factory
