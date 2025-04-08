'use client'
import { useState } from 'react'

const mockData: Record<string, string> = {
  'sol en acuario': 'El Sol en Acuario indica una personalidad independiente, visionaria y orientada al futuro.',
  'sol en casa 4': 'El Sol en la Casa 4 sugiere que la identidad está profundamente conectada con el hogar y la familia.',
  'aspectos a pluton': 'Aspectos al planeta Plutón traen intensidad, transformación y poder personal en la carta natal.',
  'aspectos a jupiter': 'Los aspectos con Júpiter expanden y benefician las áreas involucradas, trayendo suerte y optimismo.',
}

export default function Home() {
  const [input, setInput] = useState('')
  const [results, setResults] = useState<string[]>([])

  const handleSearch = () => {
    const terms = input.toLowerCase().split(',').map(t => t.trim())
    const texts = terms.map(term => mockData[term]).filter(Boolean)
    setResults(texts)
  }

  return (
    <main className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Biblioteca Astrológica</h1>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Escribe combinaciones como: sol en acuario, sol en casa 4..."
        className="w-full p-2 border rounded mb-4"
        rows={4}
      />
      <button
        onClick={handleSearch}
        className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
      >
        Buscar
      </button>
      <div className="mt-6 space-y-4">
        {results.map((text, i) => (
          <div key={i} className="p-4 border rounded bg-gray-50">
            {text}
          </div>
        ))}
      </div>
    </main>
  )
}
