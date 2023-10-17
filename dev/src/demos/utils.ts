export type DemoFactoryCleanup = () => void
export type DemoFactory = (root: HTMLElement) => void | DemoFactoryCleanup

export const defineDemo = (factory: DemoFactory) => factory
