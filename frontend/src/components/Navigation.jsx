import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Menu, X, Droplets } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { cn } from '../lib/utils'
import { useAuth } from '../context/AuthContext'

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()
  const { count } = useCart()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: 'Home', icon: null },
    { path: '/products', label: 'Collection', icon: null },
    { path: '/checkout', label: 'Checkout', icon: ShoppingBag },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled 
          ? 'py-3 backdrop-blur-xl bg-emerald-950/60 border-b border-white/10' 
          : 'py-6 bg-transparent'
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container-luxury flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-full liquid-glass flex items-center justify-center group-hover:glow-gold transition-all duration-300">
            <Droplets className="w-5 h-5 text-luxury-gold" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl font-bold text-white tracking-tight">
              L'Essence
            </span>
            <span className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-sans">
              Parfumerie
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                isActive(link.path)
                  ? 'text-luxury-gold bg-white/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              )}
            >
              <span className="flex items-center gap-2">
                {link.label}
                {link.path === '/checkout' && count > 0 && (
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-luxury-gold text-emerald-950 text-xs font-bold">
                    {count}
                  </span>
                )}
                {link.icon && link.path !== '/checkout' && <link.icon className="w-4 h-4" />}
              </span>
              {isActive(link.path) && (
                <motion.div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-luxury-gold"
                  layoutId="activeNav"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          {/* Admin link + auth actions */}
          {user && user.role === 'admin' && (
            <>
              <Link to="/admin" className="px-5 py-2 rounded-lg text-sm font-medium text-luxury-gold bg-white/5">
                Admin
              </Link>
              <button onClick={() => logout()} className="px-4 py-2 rounded-lg text-sm bg-white/5">Logout</button>
            </>
          )}

          {user && user.role !== 'admin' && (
            <button onClick={() => logout()} className="px-4 py-2 rounded-lg text-sm bg-white/5">Logout</button>
          )}

          {!user && (
            <Link to="/login" className="px-4 py-2 rounded-lg text-sm bg-white/5">Login</Link>
          )}
        </nav>

        <button
          className="md:hidden p-2 rounded-lg glass-card text-white/80 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 glass-card border-t border-white/10 mx-4 mt-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    isActive(link.path)
                      ? 'text-luxury-gold bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex items-center gap-3">
                    {link.icon && <link.icon className="w-4 h-4" />}
                    {link.label}
                    {link.path === '/checkout' && count > 0 && (
                      <span className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-luxury-gold text-emerald-950 text-xs font-bold">
                        {count}
                      </span>
                    )}
                  </span>
                </Link>
              ))}
            </nav>
            <div className="p-4 border-t border-white/5">
              {user && user.role === 'admin' && (
                <div className="flex items-center gap-2">
                  <Link to="/admin" className="px-4 py-2 rounded bg-white/5">Admin</Link>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false) }} className="px-4 py-2 rounded bg-white/5">Logout</button>
                </div>
              )}

              {user && user.role !== 'admin' && (
                <div>
                  <button onClick={() => { logout(); setIsMobileMenuOpen(false) }} className="px-4 py-2 rounded bg-white/5">Logout</button>
                </div>
              )}

              {!user && (
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 rounded bg-white/5">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navigation
