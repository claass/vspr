import React from 'react'
import ReactDOM from 'react-dom/client'
import { RootRoute, Router, RootRouteWithoutChildren } from '@tanstack/react-router'
import App from './routes/__root'
import IndexRoute from './routes/index'
import DesignRoute from './routes/design'
import LuminousArcanaRoute from './routes/luminous-arcana'

// Create the root route
const rootRoute = new RootRoute({
  component: App,
})

// Create route tree
const routeTree = rootRoute.addChildren([
  IndexRoute,
  DesignRoute,
  LuminousArcanaRoute,
])

// Create router instance
const router = new Router({ routeTree })

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')
if (!rootElement?.innerHTML) {
  const root = ReactDOM.createRoot(rootElement!)
  root.render(
    <React.StrictMode>
      <router.RootComponent />
    </React.StrictMode>,
  )
}
