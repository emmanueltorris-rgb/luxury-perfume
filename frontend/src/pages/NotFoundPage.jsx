import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center section-padding">
      <div className="text-center">
        <h1 className="heading-luxury-gold text-8xl font-bold mb-4">404</h1>
        <p className="subtitle-luxury mb-8">Page Not Found</p>
        <p className="text-white/50 mb-8 max-w-md mx-auto">
          The fragrance you seek seems to have evaporated. Return to our collection.
        </p>
        <Link 
          to="/" 
          className="btn-glass inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Collection
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
