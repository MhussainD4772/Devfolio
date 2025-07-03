import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-slate-100 px-4 text-center">
      {/* Branding */}
      <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">Devfolio</h1>

      {/* Tagline */}
      <p className="text-lg sm:text-xl text-gray-600 mb-8">
        Create your personal developer portfolio in seconds.
      </p>

      {/* CTA Button */}
      <Link
        to="/create"
        className="px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        Create My Portfolio
      </Link>
    </div>
  )
}

export default App

