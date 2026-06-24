import { motion } from 'framer-motion'
import { useScrollReveal } from '../hooks/useScrollReveal'
import { Gem, Leaf, Shield } from 'lucide-react'

function BrandStory() {
  const { ref, isVisible } = useScrollReveal()

  const values = [
    {
      icon: Gem,
      title: 'Rare Ingredients',
      desc: 'Sourced from the finest perfumeries across Grasse, Dubai, and Nairobi. Only the purest essences make the cut.',
    },
    {
      icon: Leaf,
      title: 'Sustainable Luxury',
      desc: 'Our bottles are crafted from recycled crystal glass. Every purchase plants a tree in the Aberdare Range.',
    },
    {
      icon: Shield,
      title: 'Authentic Guarantee',
      desc: 'Each fragrance is batch-coded and certified. We stand behind every drop with a lifetime authenticity pledge.',
    },
  ]

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/30 to-transparent" />

      <div className="container-luxury relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="subtitle-luxury mb-4 text-luxury-gold">Our Philosophy</p>
            <h2 className="heading-luxury text-4xl md:text-5xl mb-6">
              Where Art Meets
              <br />
              <span className="heading-luxury-gold">Alchemy</span>
            </h2>
            <p className="text-white/60 leading-relaxed mb-6">
              Founded in the heart of Nairobi, L'Essence Parfumerie was born from a singular vision: 
              to create fragrances that capture the soul of East Africa while meeting the standards 
              of the world's most discerning noses.
            </p>
            <p className="text-white/60 leading-relaxed">
              Our master perfumer spends eighteen months perfecting each formula. The result? 
              Scents that linger in memory long after the final note fades.
            </p>
          </motion.div>

          <div className="space-y-6">
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                className="liquid-glass p-6 rounded-xl"
                initial={{ opacity: 0, x: 40 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center flex-shrink-0">
                    <value.icon className="w-5 h-5 text-luxury-gold" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-white mb-1">
                      {value.title}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed">
                      {value.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandStory
