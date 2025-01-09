import { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom"
import War from "./War"
import { motion } from "framer-motion"

function PokemonCard({ pokemon, index, onSelect, isSelected }) {
  return (
    <div
      onClick={() => onSelect(pokemon)}
      className={`pokemon-card cursor-pointer animate-fadeIn ${
        isSelected ? "selected" : ""
      }`}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      <div className="pokemon-card-inner">
        {/* Card Header */}
        <div className="pokemon-card-header flex justify-between items-start p-2">
          <div>
            <h2 className="text-lg font-bold text-white capitalize tracking-wide">
              {pokemon.name}
            </h2>
            <div className="flex items-center gap-1 mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/90">
                Basic Pokémon
              </span>
              <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs text-white/90 capitalize">
                {pokemon.type}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold text-white">
              {parseInt(pokemon.weight) + 50}
            </span>
            <span className="text-xs text-white/80">HP</span>
          </div>
        </div>

        {/* Pokemon Image */}
        <div className="pokemon-card-image-container relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/30 rounded-lg" />
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-image w-full h-32 object-contain relative z-10"
          />
        </div>

        {/* Pokemon Info */}
        <div className="pokemon-card-stats p-2">
          <div className="text-xs text-gray-600 mb-2 flex items-center justify-between">
            <span className="capitalize font-medium">
              {pokemon.type} Pokémon
            </span>
            <span className="text-gray-500">{pokemon.weight}</span>
          </div>

          {/* Attacks */}
          <div className="space-y-2">
            <div className="p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-400 rounded-full shadow-inner" />
                  <span className="font-semibold text-gray-700 text-sm">
                    Quick Attack
                  </span>
                </div>
                <span className="font-bold text-gray-800 text-sm">20</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                A swift strike that rarely misses its target.
              </p>
            </div>

            <div className="p-2 bg-gradient-to-br from-gray-50 to-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full shadow-inner" />
                  <span className="font-semibold text-gray-700 text-sm">
                    Special Move
                  </span>
                </div>
                <span className="font-bold text-gray-800 text-sm">50</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Discard 1 Energy card to use this powerful attack.
              </p>
            </div>
          </div>

          {/* Type Icons */}
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
            <div className="flex gap-1 items-center">
              <span className="text-xs text-gray-500">Weakness</span>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 shadow-sm" />
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-xs text-gray-500">Resistance</span>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm" />
            </div>
            <div className="flex gap-1 items-center">
              <span className="text-xs text-gray-500">Retreat</span>
              <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

PokemonCard.propTypes = {
  pokemon: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    weight: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  isFirstPokemon: PropTypes.bool,
  isSecondPokemon: PropTypes.bool,
}

function HomePage() {
  const navigate = useNavigate()
  const [pokemons, setPokemons] = useState([])
  const [selectedPokemons, setSelectedPokemons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Filter pokemons based on search query
  const filteredPokemons = pokemons.filter(
    (pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pokemon.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await fetch(
          "https://pokeapi.co/api/v2/pokemon?limit=151"
        )
        const data = await response.json()

        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url)
            const details = await res.json()
            return {
              id: details.id,
              name: details.name,
              image: details.sprites.other["official-artwork"].front_default,
              type: details.types[0].type.name,
              weight: `${details.weight / 10}kg`,
            }
          })
        )

        setPokemons(pokemonDetails)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching Pokemon:", error)
        setLoading(false)
      }
    }

    fetchPokemon()
  }, [])

  const handlePokemonSelect = (pokemon) => {
    if (selectedPokemons.includes(pokemon)) {
      setSelectedPokemons(selectedPokemons.filter((p) => p !== pokemon))
    } else if (selectedPokemons.length < 2) {
      setSelectedPokemons([...selectedPokemons, pokemon])
      if (selectedPokemons.length === 1) {
        // İki pokemon da seçildiğinde savaş sayfasına yönlendir
        navigate("/war", {
          state: { pokemon1: selectedPokemons[0], pokemon2: pokemon },
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <img
          src="/pokemon-loading.png"
          width={100}
          height={100}
          className=" animate-spin"
          style={{ animationDuration: "3s" }}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col items-center mb-8">
        <motion.div
          className="flex items-center justify-center mb-4"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/pokemonLogo.png"
            alt="Pokemon Logo"
            className="h-24 object-contain"
          />
          <div className="text-4xl font-bold ml-3 bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
            Savaşı
          </div>
        </motion.div>
      </div>

      <div className="text-center mb-8">
        {selectedPokemons.length === 0 ? (
          <div className="inline-block">
            <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse">
              <span className="text-xl font-semibold">
                🔥 İlk Pokémon&apos;unu Seç!
              </span>
            </div>
          </div>
        ) : selectedPokemons.length === 1 ? (
          <div className="inline-block">
            <div className="bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 animate-pulse">
              <span className="text-xl font-semibold">
                ⚡ Rakip Pokémon&apos;u Seç!
              </span>
            </div>
          </div>
        ) : (
          <div className="inline-block">
            <div className="bg-gradient-to-r from-yellow-500 via-red-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
              <span className="text-xl font-semibold">🎮 Savaş Başlıyor!</span>
            </div>
          </div>
        )}
      </div>

      {/* Search Input */}
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-white border-2 border-[#FF565F] rounded-xl 
                     text-black placeholder-black/60 outline-none focus:ring-2 
                     focus:ring-[#FF565F]/50 transition-all duration-300"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60">
            🔍
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPokemons.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            index={index}
            onSelect={handlePokemonSelect}
            isSelected={selectedPokemons.includes(pokemon)}
            isFirstPokemon={selectedPokemons[0] === pokemon}
            isSecondPokemon={selectedPokemons[1] === pokemon}
          />
        ))}
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/war"
          element={<War />}
        />
      </Routes>
    </Router>
  )
}

export default App
