import type { ReactElement } from "react"
import { MemoryRouter, type MemoryRouterProps } from "react-router"
import { render, type RenderOptions } from "@testing-library/react"

interface RenderWithRouterOptions extends Omit<RenderOptions, "wrapper"> {
  routerProps?: MemoryRouterProps
}

export function renderWithRouter(ui: ReactElement, { routerProps, ...renderOptions }: RenderWithRouterOptions = {}) {
  return render(ui, {
    wrapper: ({ children }) => <MemoryRouter {...routerProps}>{children}</MemoryRouter>,
    ...renderOptions
  })
}
