"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import MovieDetails from "./components/MovieDetails"
import Mascot from "./components/Mascot"
import FancyLoader from "./components/FancyLoader"
import PullToRefresh from "./components/PullToRefresh"
import { RefreshCw, ArrowLeft } from "lucide-react"
import { formatDuration } from "./utils/formatDuration"
import { searchMovies, getMovieDetails } from "./utils/tmdbApi"

const questions = [
  {
    id: "streaming",
    question: "Sur quelles plateformes de streaming avez-vous un abonnement ?",
    type: "checkbox",
    options: [
      { id: "netflix", name: "Netflix" },
      { id: "amazon", name: "Amazon Prime Video" },
      { id: "disney", name: "Disney+" },
      { id: "canal", name: "Canal+" },
      { id: "ocs", name: "OCS" },
      { id: "apple", name: "Apple TV+" },
    ],
  },
  {
    id: "genre",
    question: "Quel genre de film voulez-vous regarder ?",
    type: "choice",
    options: ["Action", "Comédie", "Drame", "Science-fiction", "Horreur", "Romance", "Documentaire"],
  },
  {
    id: "era",
    question: "De quelle époque préférez-vous les films ?",
    type: "choice",
    options: [
      "Classiques (avant 1980)",
      "Années 80-90",
      "Années 2000-2010",
      "Films récents (après 2010)",
      "Peu importe",
    ],
  },
  {
    id: "duration",
    question: "Quelle durée de film préférez-vous ?",
    type: "duration",
    options: [],
  },
  {
    id: "origin",
    question: "Quelle origine de film préférez-vous ?",
    type: "choice",
    options: ["Américain", "Français", "Européen", "Asiatique", "Peu importe"],
  },
]

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [recommendedMovies, setRecommendedMovies] = useState([])
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0)
  const [duration, setDuration] = useState([120])
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [movieHistory, setMovieHistory] = useState<number[]>([])
  const [selectedStreamingServices, setSelectedStreamingServices] = useState<string[]>([])
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    console.log("Component mounted")
    const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY
    console.log("TMDB API Key status:", apiKey ? "Present" : "Missing")
    if (!apiKey) {
      setError("Error: TMDB API Key is not configured")
    }
    setIsInitialLoading(false)
  }, [])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setAnswers({})
    setRecommendedMovies([])
    setCurrentMovieIndex(0)
    setError(null)
    setSelectedStreamingServices([])
    setIsLoading(false)
  }, [])

  const forceRefresh = useCallback(() => {
    handleRestart()
  }, [handleRestart])

  const handleAnswer = useCallback(
    (answer) => {
      try {
        console.log("handleAnswer called with answer:", answer)
        const updatedAnswers = { ...answers, [questions[currentQuestion].id]: answer }
        console.log("Updated answers:", updatedAnswers)
        setAnswers(updatedAnswers)

        if (questions[currentQuestion].type === "checkbox") {
          setSelectedStreamingServices(answer)
        }

        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion((prev) => prev + 1)
        } else {
          setIsLoading(true)
          setError(null)

          getRecommendations(updatedAnswers)
            .then((movies) => {
              console.log("Received movies:", movies)
              if (!movies || movies.length === 0) {
                throw new Error(
                  `Aucun film trouvé pour vos critères. Critères: ${JSON.stringify(updatedAnswers, null, 2)}`,
                )
              }
              setRecommendedMovies(movies)
              setCurrentMovieIndex(0)
              setIsLoading(false)
            })
            .catch((err) => {
              console.error("Erreur dans handleAnswer:", err)
              setError(
                err instanceof Error
                  ? `Erreur: ${err.message}`
                  : `Une erreur inattendue s'est produite: ${JSON.stringify(err)}`,
              )
              setIsLoading(false)
            })
        }
      } catch (error) {
        console.error("Erreur inattendue dans handleAnswer:", error)
        setError(
          error instanceof Error
            ? `Une erreur inattendue s'est produite: ${error.message}`
            : `Une erreur inattendue s'est produite: ${JSON.stringify(error)}`,
        )
        setIsLoading(false)
      }
    },
    [currentQuestion, answers, questions],
  )

  const handleReject = useCallback(() => {
    if (currentMovieIndex < recommendedMovies.length - 1) {
      setCurrentMovieIndex((prev) => prev + 1)
    } else {
      setError("Désolé, nous n'avons plus de recommandations pour le moment. Essayez de modifier vos critères.")
    }
  }, [currentMovieIndex, recommendedMovies.length])

  const clearHistory = useCallback(() => {
    setMovieHistory([])
    handleRestart()
  }, [handleRestart])

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }, [currentQuestion])

  const handleStreamingServiceChange = useCallback((serviceId: string) => {
    setSelectedStreamingServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }, [])

  const content = useCallback(() => {
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 z-50">
          <Card className="w-full max-w-md mx-4">
            <CardContent className="pt-6">
              <FancyLoader />
            </CardContent>
          </Card>
        </div>
      )
    }

    if (recommendedMovies.length > 0) {
      const currentMovie = recommendedMovies[currentMovieIndex]
      const nextMovie =
        currentMovieIndex < recommendedMovies.length - 1 ? recommendedMovies[currentMovieIndex + 1] : null
      return (
        <MovieDetails
          key={currentMovie.id}
          movie={currentMovie}
          nextMovie={nextMovie}
          onReject={handleReject}
          onRestart={handleRestart}
          onClearHistory={clearHistory}
          userChoices={answers}
        />
      )
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="relative flex justify-center items-center">
            <CardTitle className="text-center">AkinaMovie</CardTitle>
            <Button onClick={forceRefresh} className="absolute top-2 right-2" size="icon" variant="ghost">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Forcer le rafraîchissement</span>
            </Button>
            {currentQuestion > 0 && (
              <Button onClick={handlePreviousQuestion} className="absolute top-2 left-2" size="icon" variant="ghost">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Question précédente</span>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Mascot message={questions[currentQuestion].question} />
            {questions[currentQuestion].type === "checkbox" ? (
              <div className="space-y-4">
                {questions[currentQuestion].options.map((service) => (
                  <div key={service.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={service.id}
                      checked={selectedStreamingServices.includes(service.id)}
                      onCheckedChange={() => handleStreamingServiceChange(service.id)}
                      className="w-6 h-6"
                    />
                    <label
                      htmlFor={service.id}
                      className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {service.name}
                    </label>
                  </div>
                ))}
                <Button onClick={() => handleAnswer(selectedStreamingServices)} className="w-full mt-6">
                  Valider
                </Button>
              </div>
            ) : questions[currentQuestion].type === "duration" ? (
              <div className="space-y-4">
                <Slider min={40} max={180} step={1} value={duration} onValueChange={setDuration} className="w-full" />
                <div className="text-center text-lg font-semibold">{formatDuration(duration[0])}</div>
                <Button onClick={() => handleAnswer(duration[0])} className="w-full">
                  Valider
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {questions[currentQuestion].options.map((option) => (
                  <Button key={option} onClick={() => handleAnswer(option)} className="w-full">
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }, [
    isLoading,
    recommendedMovies,
    currentMovieIndex,
    handleReject,
    handleRestart,
    clearHistory,
    answers,
    forceRefresh,
    currentQuestion,
    handlePreviousQuestion,
    selectedStreamingServices,
    duration,
    handleAnswer,
    handleStreamingServiceChange,
    questions,
  ])

  if (isInitialLoading) {
    console.log("Initial loading")
    return <div>Chargement...</div>
  }

  console.log("Rendering main content")
  return (
    <PullToRefresh onRefresh={forceRefresh}>
      {error ? <div>Une erreur s'est produite : {error}</div> : content()}
    </PullToRefresh>
  )
}

const getRecommendations = async (currentAnswers) => {
  try {
    if (!process.env.NEXT_PUBLIC_TMDB_API_KEY) {
      throw new Error("La clé API TMDB n'est pas configurée")
    }

    console.log("Recherche de films avec les critères:", JSON.stringify(currentAnswers, null, 2))

    const movies = await searchMovies({
      genre: currentAnswers.genre,
      year: currentAnswers.era,
      duration: currentAnswers.duration,
      origin: currentAnswers.origin,
    })

    if (!movies || movies.length === 0) {
      throw new Error(
        `Aucun film ne correspond à vos critères. Critères utilisés: ${JSON.stringify(currentAnswers, null, 2)}`,
      )
    }

    console.log(`${movies.length} films trouvés, récupération des détails...`)

    const detailedMovies = await Promise.all(
      movies.slice(0, 5).map(async (movie) => {
        try {
          const details = await getMovieDetails(movie.id)
          if (!details) {
            throw new Error(`Impossible de récupérer les détails pour le film ${movie.id}`)
          }
          return details
        } catch (error) {
          console.error(`Erreur lors de la récupération des détails du film ${movie.id}:`, error)
          return null
        }
      }),
    )

    const validMovies = detailedMovies.filter((movie) => movie !== null)

    if (validMovies.length === 0) {
      throw new Error("Impossible de récupérer les détails des films. Veuillez réessayer.")
    }

    console.log(`${validMovies.length} films valides récupérés avec succès.`)

    return validMovies
  } catch (error) {
    console.error("Erreur dans getRecommendations:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error(`Une erreur inattendue s'est produite lors de la recherche de films: ${JSON.stringify(error)}`)
  }
}

