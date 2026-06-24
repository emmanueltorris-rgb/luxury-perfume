import { Link } from 'react-router-dom'
import { Droplets, Instagram, Twitter, Mail } from 'lucide-react'

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/10 mt-auto">
      <div className="container-luxury py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full liquid-glass flex items-center justify-center">
                <Droplets className="w-5 h-5 text-luxury-gold" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">L'Essence</h3>
                <p className="text-xs uppercase tracking-widest text-white/40">Parfumerie</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-md">
              Crafting extraordinary fragrances that capture the essence of luxury. 
              Each bottle is a masterpiece of rare ingredients, distilled for the discerning connoisseur.
            </p>
          </div>

          <div>
            <h4 className="font-serif text-white font-semibold mb-6">Explore</h4>
            <ul className="space-y-3">
              {['Home', 'Collection', 'About', 'Contact'].map((item) => (
                <li key={item}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                    className="text-white/50 hover:text-luxury-gold text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-white font-semibold mb-6">Connect</h4>
            <div className="flex gap-4">
              {[Instagram, Twitter, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full glass-card flex items-center justify-center text-white/50 hover:text-luxury-gold hover:border-luxury-gold/30 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
            <p className="mt-6 text-white/40 text-xs">
              © 2026 L'Essence Parfumerie.<br />All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
