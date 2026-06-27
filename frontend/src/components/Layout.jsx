import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import Footer from './Footer'
import Toast from './Toast'
import AmbientBackground from './AmbientBackground'

function Layout() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <AmbientBackground />
      <div className="noise-overlay" />
      <Navigation />
      <main className="relative z-10">
        <Outlet />
      </main>
      <Toast />
      <Footer />
    </div>
  )
}

export default Layout
