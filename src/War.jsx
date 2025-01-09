import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"

export default function War() {
  const location = useLocation()
  const navigate = useNavigate()
  const { pokemon1, pokemon2 } = location.state || {}

  const [battleState, setBattleState] = useState("start")
  const [battleLog, setBattleLog] = useState([])
  const [pokemon1Attacking, setPokemon1Attacking] = useState(false)
  const [pokemon2Attacking, setPokemon2Attacking] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pokemon1Health, setPokemon1Health] = useState(100)
  const [pokemon2Health, setPokemon2Health] = useState(100)
  const [pokemon1Power, setPokemon1Power] = useState(0)
  const [pokemon2Power, setPokemon2Power] = useState(0)
  const [pokemon1Ultimate, setPokemon1Ultimate] = useState(false)
  const [pokemon2Ultimate, setPokemon2Ultimate] = useState(false)
  const [countdown, setCountdown] = useState(3)
  const [showStartAnimation, setShowStartAnimation] = useState(true)
  const [pokemon1Hit, setPokemon1Hit] = useState(false)
  const [pokemon2Hit, setPokemon2Hit] = useState(false)

  // Add sound effects
  const fireballSound = new Audio("/fireball.mp3")
  const fightStartSound = new Audio("/fightStart.mp3")
  const thunderSound = new Audio("/lightningSoundEffect.mp3")

  const playFireballSound = () => {
    fireballSound.currentTime = 0
    fireballSound
      .play()
      .catch((error) => console.log("Sound play failed:", error))
  }

  const playFightStartSound = () => {
    fightStartSound.currentTime = 0
    fightStartSound
      .play()
      .catch((error) => console.log("Sound play failed:", error))
  }

  const playThunderSound = () => {
    thunderSound.currentTime = 0
    thunderSound
      .play()
      .catch((error) => console.log("Sound play failed:", error))
  }

  useEffect(() => {
    if (!pokemon1 || !pokemon2) {
      navigate("/")
      return
    }

    if (battleState === "start") {
      // Start countdown and play sound
      playFightStartSound()
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            setShowStartAnimation(false)
            setBattleState("fighting")
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [pokemon1, pokemon2, battleState, navigate])

  useEffect(() => {
    const handleKeyPress = async (e) => {
      if (battleState !== "fighting" || showResults) return

      if (e.key === "Enter" && !pokemon1Attacking && !pokemon2Attacking) {
        // Pokemon 1 Ultimate Attack
        if (e.shiftKey && pokemon1Power >= 100) {
          setPokemon1Attacking(true)
          setPokemon1Ultimate(true)
          setBattleLog((prev) => [
            ...prev,
            `${pokemon1.name} ULTRA SALDIRI kullanıyor! ⚡️`,
          ])
          playThunderSound()

          const damage = Math.floor(Math.random() * 30) + 20
          setTimeout(() => {
            setPokemon2Health((prev) => Math.max(0, prev - damage))
            setPokemon2Hit(true)
            setTimeout(() => setPokemon2Hit(false), 300)
            setPokemon1Attacking(false)
            setPokemon1Ultimate(false)
            setPokemon1Power(0)

            if (pokemon2Health - damage <= 0) {
              setBattleLog((prev) => [...prev, `${pokemon1.name} kazandı! 🏆`])
              setBattleState("finished")
              setShowResults(true)
            }
          }, 1000)
          return
        }

        // Pokemon 1 Normal Attack
        setPokemon1Attacking(true)
        setBattleLog((prev) => [...prev, `${pokemon1.name} saldırıyor!`])
        playFireballSound()

        const damage = Math.floor(Math.random() * 20) + 10
        setTimeout(() => {
          setPokemon2Health((prev) => Math.max(0, prev - damage))
          setPokemon2Hit(true)
          setPokemon1Power((prev) => Math.min(100, prev + 25))
          setTimeout(() => setPokemon2Hit(false), 300)
          setPokemon1Attacking(false)

          if (pokemon2Health - damage <= 0) {
            setBattleLog((prev) => [...prev, `${pokemon1.name} kazandı! 🏆`])
            setBattleState("finished")
            setShowResults(true)
          }
        }, 1000)
      }

      if (e.key === " " && !pokemon1Attacking && !pokemon2Attacking) {
        e.preventDefault()
        // Pokemon 2 Ultimate Attack
        if (e.shiftKey && pokemon2Power >= 100) {
          setPokemon2Attacking(true)
          setPokemon2Ultimate(true)
          setBattleLog((prev) => [
            ...prev,
            `${pokemon2.name} ULTRA SALDIRI kullanıyor! ⚡️`,
          ])
          playThunderSound()

          const damage = Math.floor(Math.random() * 30) + 20
          setTimeout(() => {
            setPokemon1Health((prev) => Math.max(0, prev - damage))
            setPokemon1Hit(true)
            setTimeout(() => setPokemon1Hit(false), 300)
            setPokemon2Attacking(false)
            setPokemon2Ultimate(false)
            setPokemon2Power(0)

            if (pokemon1Health - damage <= 0) {
              setBattleLog((prev) => [...prev, `${pokemon2.name} kazandı! 🏆`])
              setBattleState("finished")
              setShowResults(true)
            }
          }, 1000)
          return
        }

        // Pokemon 2 Normal Attack
        setPokemon2Attacking(true)
        setBattleLog((prev) => [...prev, `${pokemon2.name} saldırıyor!`])
        playFireballSound()

        const damage = Math.floor(Math.random() * 20) + 10
        setTimeout(() => {
          setPokemon1Health((prev) => Math.max(0, prev - damage))
          setPokemon1Hit(true)
          setPokemon2Power((prev) => Math.min(100, prev + 25))
          setTimeout(() => setPokemon1Hit(false), 300)
          setPokemon2Attacking(false)

          if (pokemon1Health - damage <= 0) {
            setBattleLog((prev) => [...prev, `${pokemon2.name} kazandı! 🏆`])
            setBattleState("finished")
            setShowResults(true)
          }
        }, 1000)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [
    battleState,
    pokemon1,
    pokemon2,
    pokemon1Attacking,
    pokemon2Attacking,
    pokemon1Health,
    pokemon2Health,
    pokemon1Power,
    pokemon2Power,
    showResults,
  ])

  const handleCloseBattle = () => {
    navigate("/")
  }

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ backgroundImage: "url(/space.png)", backgroundSize: "cover" }}
    >
      <div className="h-full flex flex-col justify-between">
        {/* Pokemon Display */}
        <div className="flex-1 flex justify-between items-center p-8">
          {/* Pokemon 1 */}
          {pokemon1 && (
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ x: -200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <div className="mb-4 w-full bg-gray-800/50 rounded-lg px-4 py-2">
                <div className="text-white text-sm mb-1">
                  HP: {pokemon1Health}%
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${pokemon1Health}%` }}
                  />
                </div>
                <div className="text-white text-sm mt-2 mb-1">
                  Ultra Güç: {pokemon1Power}%
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${pokemon1Power}%` }}
                  />
                </div>
              </div>

              <motion.div
                className={`transform transition-transform duration-300 ${
                  pokemon1Attacking ? "translate-x-20" : ""
                }`}
                animate={
                  pokemon1Hit
                    ? pokemon2Ultimate
                      ? {
                          x: [-20, 20, -20, 20, 0],
                          y: [-20, 20, -20, 20, 0],
                          filter: ["brightness(3)", "brightness(1)"],
                          scale: [1, 0.8, 1],
                        }
                      : {
                          x: [-5, 5, -5, 5, 0],
                          filter: ["brightness(2)", "brightness(1)"],
                        }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                <img
                  src={pokemon1.image}
                  alt={pokemon1.name}
                  className="w-64 h-64 object-contain"
                />
                {pokemon1Ultimate && (
                  <motion.div
                    className="absolute inset-0 bg-yellow-400/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3, repeat: 3 }}
                  >
                    <div className="absolute inset-0 bg-[url('/lightning.png')] bg-cover bg-center bg-no-repeat" />
                  </motion.div>
                )}
              </motion.div>

              <div className="mt-4 flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white font-medium">{pokemon1.name}</span>
                <div className="flex flex-col items-start gap-1">
                  <kbd className="px-2 py-1 bg-gray-800 text-white text-sm rounded">
                    Enter
                  </kbd>
                  {pokemon1Power >= 100 && (
                    <kbd className="px-2 py-1 bg-yellow-600 text-white text-sm rounded animate-pulse">
                      Shift + Enter
                    </kbd>
                  )}
                </div>
              </div>

              {pokemon1Attacking && !pokemon1Ultimate && (
                <img
                  src="/fireball.png"
                  alt="fireball"
                  className="absolute top-1/2 left-full w-20 h-20 transform -translate-y-1/2 animate-move-right z-10"
                  style={{
                    filter: "drop-shadow(0 0 20px #ff6b6b) brightness(1.5)",
                  }}
                />
              )}

              {pokemon1Ultimate && (
                <motion.img
                  src="/lightning.png"
                  alt="lightning"
                  className="fixed top-1/2 left-1/2 w-[800px] h-[800px] transform -translate-x-1/2 -translate-y-1/2 z-50"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                />
              )}
            </motion.div>
          )}

          <motion.div
            className="flex flex-col items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 1, delay: 0.5 }}
          >
            <img
              src="/vs.png"
              alt="VS"
              className="w-24 h-24 object-contain"
            />
          </motion.div>

          {/* Pokemon 2 */}
          {pokemon2 && (
            <motion.div
              className="relative flex flex-col items-center"
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: "spring", duration: 1 }}
            >
              <div className="mb-4 w-full bg-gray-800/50 rounded-lg px-4 py-2">
                <div className="text-white text-sm mb-1">
                  HP: {pokemon2Health}%
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${pokemon2Health}%` }}
                  />
                </div>
                <div className="text-white text-sm mt-2 mb-1">
                  Ultra Güç: {pokemon2Power}%
                </div>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                  <div
                    className="h-full bg-yellow-500 rounded-full transition-all duration-300"
                    style={{ width: `${pokemon2Power}%` }}
                  />
                </div>
              </div>

              <motion.div
                className={`transform transition-transform duration-300 ${
                  pokemon2Attacking ? "-translate-x-20" : ""
                }`}
                animate={
                  pokemon2Hit
                    ? pokemon1Ultimate
                      ? {
                          x: [-20, 20, -20, 20, 0],
                          y: [-20, 20, -20, 20, 0],
                          filter: ["brightness(3)", "brightness(1)"],
                          scale: [1, 0.8, 1],
                        }
                      : {
                          x: [-5, 5, -5, 5, 0],
                          filter: ["brightness(2)", "brightness(1)"],
                        }
                    : {}
                }
                transition={{ duration: 0.3 }}
              >
                <img
                  src={pokemon2.image}
                  alt={pokemon2.name}
                  className="w-64 h-64 object-contain transform scale-x-[-1]"
                />
                {pokemon2Ultimate && (
                  <motion.div
                    className="absolute inset-0 bg-yellow-400/30"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.3, repeat: 3 }}
                  >
                    <div className="absolute inset-0 bg-[url('/lightning.png')] bg-cover bg-center bg-no-repeat" />
                  </motion.div>
                )}
              </motion.div>

              <div className="mt-4 flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-lg backdrop-blur-sm">
                <span className="text-white font-medium">{pokemon2.name}</span>
                <div className="flex flex-col items-start gap-1">
                  <kbd className="px-2 py-1 bg-gray-800 text-white text-sm rounded">
                    Space
                  </kbd>
                  {pokemon2Power >= 100 && (
                    <kbd className="px-2 py-1 bg-yellow-600 text-white text-sm rounded animate-pulse">
                      Shift + Space
                    </kbd>
                  )}
                </div>
              </div>

              {pokemon2Attacking && !pokemon2Ultimate && (
                <img
                  src="/fireball.png"
                  alt="fireball"
                  className="absolute top-1/2 right-full w-20 h-20 transform -translate-y-1/2 scale-x-[-1] animate-move-left z-10"
                  style={{
                    filter: "drop-shadow(0 0 20px #ff6b6b) brightness(1.5)",
                  }}
                />
              )}

              {pokemon2Ultimate && (
                <motion.img
                  src="/lightning.png"
                  alt="lightning"
                  className="fixed top-1/2 left-1/2 w-[800px] h-[800px] transform -translate-x-1/2 -translate-y-1/2 z-50"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1.2, 0],
                    rotate: [0, 15, -15, 0],
                  }}
                  transition={{ duration: 0.5, repeat: 2 }}
                />
              )}
            </motion.div>
          )}
        </div>

        {/* Start Animation */}
        <AnimatePresence>
          {showStartAnimation && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
              >
                <motion.div
                  className="text-6xl font-bold text-white mb-8"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                >
                  {pokemon1.name} VS {pokemon2.name}
                </motion.div>
                {countdown > 0 && (
                  <motion.div
                    key={countdown}
                    className="text-8xl font-bold text-yellow-400"
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {countdown}
                  </motion.div>
                )}
                {countdown === 0 && (
                  <motion.div
                    className="text-8xl font-bold text-green-400"
                    initial={{ scale: 2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    SAVAŞ BAŞLASIN!
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Battle Results */}
        <AnimatePresence>
          {showResults && (
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-gradient-to-br from-gray-900 to-gray-800 p-10 rounded-2xl border border-white/20 shadow-2xl w-[800px]"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", duration: 0.5 }}
              >
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                    Savaş Sona Erdi!
                  </h3>

                  <div className="flex justify-between items-center mb-8">
                    <motion.div
                      className={`relative ${
                        pokemon1Health <= 0 ? "opacity-50 grayscale" : ""
                      }`}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <img
                        src={pokemon1.image}
                        alt={pokemon1.name}
                        className="w-40 h-40 object-contain"
                      />
                      <p className="text-white text-center mt-2 font-medium">
                        {pokemon1.name}
                      </p>
                      {pokemon1Health > 0 && (
                        <motion.div
                          className="absolute inset-0 bg-yellow-400/30 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col items-center"
                    >
                      <img
                        src="/vs.png"
                        alt="VS"
                        className="w-20 h-20 object-contain mb-2"
                      />
                      <div className="text-3xl font-bold text-yellow-400">
                        {pokemon1Health > 0 ? pokemon1.name : pokemon2.name}{" "}
                        Kazandı!
                      </div>
                    </motion.div>

                    <motion.div
                      className={`relative ${
                        pokemon2Health <= 0 ? "opacity-50 grayscale" : ""
                      }`}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <img
                        src={pokemon2.image}
                        alt={pokemon2.name}
                        className="w-40 h-40 object-contain transform scale-x-[-1]"
                      />
                      <p className="text-white text-center mt-2 font-medium">
                        {pokemon2.name}
                      </p>
                      {pokemon2Health > 0 && (
                        <motion.div
                          className="absolute inset-0 bg-yellow-400/30 rounded-full"
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}
                    </motion.div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {battleLog.slice(-3).map((log, index) => (
                      <motion.p
                        key={index}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="text-lg text-white/90 bg-white/5 p-3 rounded-lg border border-white/10"
                      >
                        {log}
                      </motion.p>
                    ))}
                  </div>

                  <div className="flex justify-center">
                    <motion.button
                      onClick={handleCloseBattle}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-medium 
                               transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30
                               active:scale-95"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Ana Sayfaya Dön
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
