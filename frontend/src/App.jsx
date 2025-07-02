import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// Removed App.css – we're using Tailwind now

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-white text-center p-8">
      <div className="flex justify-center items-center gap-8 mb-6">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="h-16" alt="React logo" />
        </a>
      </div>

      <h1 className="text-4xl font-bold text-blue-600 mb-4">
        Devfolio is Live with Tailwind 🎯
      </h1>

      <div className="bg-gray-100 rounded-lg p-6 inline-block shadow-md">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          count is {count}
        </button>
        <p className="mt-2 text-gray-700">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="mt-6 text-gray-500 italic">
        Click on the logos to learn more
      </p>
    </div>
  )
}

export default App
