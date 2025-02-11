import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Mascot from "./Mascot"
import { formatProviderName } from "../utils/formatProviderName"
import { getStreamingUrl } from "../utils/getStreamingUrl"
import FancyLoader from "./FancyLoader"
import { formatDuration } from "../utils/formatDuration"

const ALLOWED_STREAMING_SERVICES = ["Netflix", "Amazon Prime Video", "Disney+", "Canal+", "OCS", "Apple TV+"]

function getLanguageName(languageCode: string): string {
  const languageNames = {
    en: "anglais",
    fr: "français",
    es: "espagnol",
    de: "allemand",
    it: "italien",
    ja: "japonais",
    ko: "coréen",
    zh: "chinois",
  }
  return languageNames[languageCode] || languageCode
}

export default function MovieDetails({ movie, nextMovie, onReject, onRestart, onClearHistory, userChoices }) {
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false)
  const [currentImage, setCurrentImage] = useState(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
  const [nextImage, setNextImage] = useState<string | null>(null)
  const [nextImageLoaded, setNextImageLoaded] = useState(false)

  useEffect(() => {
    setCurrentImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
    const img = new Image()
    img.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    img.onload = () => setCurrentImageLoaded(true)
  }, [movie])

  useEffect(() => {
    if (nextMovie) {
      const nextImg = new Image()
      nextImg.src = `https://image.tmdb.org/t/p/w500${nextMovie.poster_path}`
      setNextImage(nextImg.src)
      nextImg.onload = () => setNextImageLoaded(true)
    } else {
      setNextImage(null)
      setNextImageLoaded(false)
    }
  }, [nextMovie])

  const handleReject = () => {
    if (nextImageLoaded) {
      setCurrentImage(nextImage!)
      setCurrentImageLoaded(true)
    } else {
      setCurrentImageLoaded(false)
    }
    onReject()
  }

  const choiceSummary = `Tu as choisi un film ${userChoices.genre.toLowerCase()} ${userChoices.era.toLowerCase()}, d'une durée d'environ ${formatDuration(userChoices.duration)}, ${userChoices.origin.toLowerCase() !== "peu importe" ? `d'origine ${userChoices.origin.toLowerCase()}` : "d'origine variée"}.`

  if (!movie) {
    console.log("MovieDetails: movie is undefined")
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Aucun film disponible</CardTitle>
          </CardHeader>
          <CardContent>
            <Mascot message="Désolé, nous n'avons pas pu trouver de film correspondant à vos critères. Voulez-vous essayer à nouveau ?" />
            <Button onClick={onRestart} className="w-full mt-4">
              Recommencer la recherche
            </Button>
            <Button onClick={onClearHistory} className="w-full mt-2" variant="outline">
              Réinitialiser l'historique des films
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentImageLoaded && !nextImageLoaded) {
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

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">{movie.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Mascot
            message={`${choiceSummary} J'ai trouvé le film parfait pour toi ! Que penses-tu de "${movie.title}" ?`}
          />
          <img src={currentImage || "/placeholder.svg"} alt={movie.title} className="w-full mb-2 rounded-lg" />
          <p className="text-sm">
            <strong>Synopsis :</strong> {movie.overview}
          </p>
          <div className="flex justify-between text-sm">
            <p>
              <strong>Note :</strong> {movie.vote_average.toFixed(1)}/10
            </p>
            <p>
              <strong>Durée :</strong> {formatDuration(movie.runtime)}
            </p>
          </div>
          <p className="text-sm">
            <strong>Date de sortie :</strong>{" "}
            {new Date(movie.release_date).toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-sm">
            <strong>Version originale :</strong> Disponible en {getLanguageName(movie.original_language)}
          </p>
          {movie.credits && movie.credits.cast && (
            <p className="text-sm">
              <strong>Acteurs principaux :</strong>{" "}
              {movie.credits.cast
                .slice(0, 3)
                .map((actor) => actor.name)
                .join(", ")}
            </p>
          )}
          {movie["watch/providers"] && movie["watch/providers"].results && movie["watch/providers"].results.FR && (
            <div>
              <strong className="block mb-1 text-sm">Disponible en streaming sur :</strong>
              <div className="flex flex-wrap gap-1">
                {Object.entries(movie["watch/providers"].results.FR)
                  .filter(([key]) => ["flatrate", "rent", "buy"].includes(key))
                  .flatMap(([, providers]) => providers)
                  .filter((provider) => ALLOWED_STREAMING_SERVICES.includes(formatProviderName(provider.provider_name)))
                  .map((provider) => {
                    const providerName = formatProviderName(provider.provider_name)
                    const streamingUrls = getStreamingUrl(providerName, movie.title)
                    return (
                      <Button
                        key={provider.provider_id}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-xs py-1 h-7"
                        onClick={() => {
                          if (streamingUrls) {
                            if (isMobile) {
                              window.location.href = streamingUrls.app
                            } else {
                              window.open(streamingUrls.web, "_blank")
                            }
                          } else {
                            window.open(
                              `https://www.google.com/search?q=${encodeURIComponent(`${movie.title} streaming ${providerName}`)}`,
                              "_blank",
                            )
                          }
                        }}
                      >
                        <img
                          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
                          alt={provider.provider_name}
                          className="w-4 h-4 rounded"
                        />
                        {providerName}
                      </Button>
                    )
                  })}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <Button onClick={() => window.open(`https://www.themoviedb.org/movie/${movie.id}`, "_blank")} size="sm">
              Plus d'infos
            </Button>
            <Button variant="outline" onClick={handleReject} size="sm">
              Autre film
            </Button>
            <Button variant="secondary" onClick={onRestart} size="sm" className="col-span-2">
              Recommencer
            </Button>
          </div>
          <Button onClick={onClearHistory} className="w-full mt-2" variant="outline" size="sm">
            Réinitialiser l'historique
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

