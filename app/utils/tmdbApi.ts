const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = "https://api.themoviedb.org/3"

type TMDBParams = {
  genre?: string
  year?: string
  duration?: number
  origin?: string
  page?: number
}

const genreMapping: Record<string, number> = {
  Action: 28,
  Comédie: 35,
  Drame: 18,
  "Science-fiction": 878,
  Horreur: 27,
  Romance: 10749,
  Documentaire: 99,
  Animation: 16,
}

export async function searchMovies(params: TMDBParams) {
  if (!TMDB_API_KEY) {
    console.error("La clé API TMDB n'est pas configurée")
    throw new Error("La clé API TMDB n'est pas configurée")
  }

  try {
    const { genre, year, duration, origin, page = 1 } = params
    console.log("Paramètres de recherche:", JSON.stringify(params, null, 2))

    const url = new URL(`${TMDB_BASE_URL}/discover/movie`)
    const searchParams = new URLSearchParams()

    // Configuration de base
    searchParams.append("api_key", TMDB_API_KEY)
    searchParams.append("language", "fr-FR")
    searchParams.append("sort_by", "popularity.desc")
    searchParams.append("include_adult", "false")
    searchParams.append("include_video", "false")
    searchParams.append("page", page.toString())
    searchParams.append("with_original_language", "en,fr")

    // Filtres
    if (genre && genreMapping[genre]) {
      searchParams.append("with_genres", genreMapping[genre].toString())
    }

    if (year) {
      const yearRange = getYearRange(year)
      if (yearRange) {
        searchParams.append("primary_release_date.gte", `${yearRange.start}-01-01`)
        searchParams.append("primary_release_date.lte", `${yearRange.end}-12-31`)
      }
    }

    if (duration) {
      const durationRange = getDurationRange(duration)
      searchParams.append("with_runtime.gte", durationRange.min.toString())
      searchParams.append("with_runtime.lte", durationRange.max.toString())
    }

    if (origin && origin !== "Peu importe") {
      const regionCode = getRegionCode(origin)
      if (regionCode) {
        searchParams.append("region", regionCode)
      }
    }

    url.search = searchParams.toString()
    console.log("URL de l'API TMDB:", url.toString())

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!response.ok) {
      console.error("Erreur de l'API TMDB:", JSON.stringify(data, null, 2))
      throw new Error(
        `Erreur HTTP ${response.status}: ${response.statusText}. Message: ${data.status_message || "Pas de message d'erreur"}`,
      )
    }

    console.log("Réponse de l'API TMDB:", JSON.stringify(data, null, 2))

    if (!data.results || !Array.isArray(data.results)) {
      console.error("Format de réponse invalide:", JSON.stringify(data, null, 2))
      throw new Error("Format de réponse invalide de l'API TMDB")
    }

    if (data.results.length === 0) {
      console.warn("Aucun résultat trouvé pour les critères donnés")
      throw new Error(
        `Aucun film ne correspond à vos critères. Paramètres utilisés: ${JSON.stringify(params, null, 2)}`,
      )
    }

    return data.results
  } catch (error) {
    console.error("Erreur dans searchMovies:", error)
    if (error instanceof Error) {
      throw new Error(`Erreur de recherche : ${error.message}`)
    }
    throw new Error(`Une erreur inattendue s'est produite: ${JSON.stringify(error)}`)
  }
}

export async function getMovieDetails(movieId: number) {
  if (!TMDB_API_KEY) {
    console.error("La clé API TMDB n'est pas configurée")
    throw new Error("La clé API TMDB n'est pas configurée")
  }

  try {
    const url = new URL(`${TMDB_BASE_URL}/movie/${movieId}`)
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "fr-FR",
      append_to_response: "credits,watch/providers",
    })

    url.search = searchParams.toString()
    console.log("URL des détails du film:", url.toString())

    const response = await fetch(url.toString())
    const data = await response.json()

    if (!response.ok) {
      console.error("Erreur de l'API TMDB:", data)
      throw new Error(data.status_message || "Erreur lors de la récupération des détails du film")
    }

    console.log("Détails du film récupérés:", JSON.stringify(data, null, 2))

    return data
  } catch (error) {
    console.error("Erreur dans getMovieDetails:", error)
    if (error instanceof Error) {
      throw new Error(`Erreur de récupération des détails : ${error.message}`)
    }
    throw new Error("Une erreur inattendue s'est produite")
  }
}

function getYearRange(era: string): { start: number; end: number } | null {
  const currentYear = new Date().getFullYear()
  switch (era) {
    case "Classiques (avant 1980)":
      return { start: 1900, end: 1979 }
    case "Années 80-90":
      return { start: 1980, end: 1999 }
    case "Années 2000-2010":
      return { start: 2000, end: 2010 }
    case "Films récents (après 2010)":
      return { start: 2011, end: currentYear }
    default:
      return null
  }
}

function getDurationRange(duration: number): { min: number; max: number } {
  return {
    min: Math.max(duration - 30, 0),
    max: duration + 30,
  }
}

function getRegionCode(origin: string): string | null {
  switch (origin) {
    case "Américain":
      return "US"
    case "Français":
      return "FR"
    case "Européen":
      return "FR" // Changé pour utiliser la France comme région par défaut pour l'Europe
    case "Asiatique":
      return "JP" // Utilise le Japon comme région par défaut pour l'Asie
    default:
      return null
  }
}

