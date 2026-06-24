import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'

function SectionHeader({ subtitle, title, align = 'center' }) {
  const { ref, isVisible } = useScrollReveal()

  return (
    <div 
      ref={ref}
      className={`mb-16 ${align === 'center' ? 'text-center' : 'text-left'}`}
    >
      <motion.p
        className="subtitle-luxury mb-4 text-luxury-gold"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
      >
        {subtitle}
      </motion.p>
      <motion.h2
        className="heading-luxury text-4xl md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: 30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {title}
      </motion.h2>
      <motion.div
        className={`mt-6 h-px w-24 bg-gradient-to-r from-transparent via-luxury-gold to-transparent ${align === 'center' ? 'mx-auto' : ''}`}
        initial={{ scaleX: 0 }}
        animate={isVisible ? { scaleX: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      />
    </div>
  )
}

export default SectionHeader
