import { RootRoute } from '@tanstack/react-router'
import { Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { PWAInitializer } from '@/components/PWAInitializer'
import '@/styles/vars.css'
import '@/styles/glass.css'
import '@/styles/base.css'
import '@/styles/components.css'
import '@/styles/themes.css'
import '../styles/index.css'

export const Route = new RootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vesper-ui-theme">
      <PWAInitializer />
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
    </ThemeProvider>
  )
}

export default Route
