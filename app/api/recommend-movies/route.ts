import { NextResponse } from "next/server";

// Il faut definir les types pour une meilleure sécurité
// https://www.typescriptlang.org/docs/handbook/2/objects.html
interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  vote_average: number;
  poster_path: string;
  runtime: number;
  genres: number[];
}

interface UserPreferences {
  favoriteGenres?: number[];
  favoriteMovies?: number[];
  minRating?: number;
}

export async function POST(request: Request) {
  try {
    const body: UserPreferences = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    // On peut utiliser les variables d'environnement pour cacher la clé API
    // https://nextjs.org/docs/basic-features/environment-variables
    const TMDB_API_KEY = process.env.TMDB_API_KEY;
    const baseUrl = 'https://api.themoviedb.org/3';

    // On recupere les films recommandés en fonction des films favoris de l'utilisateur
    let recommendedMovies: Movie[] = [];
    
    if (body.favoriteMovies?.length) {
      // On recupere les recommandations en fonction de chaque film favori
      const moviePromises = body.favoriteMovies.map(async (movieId) => {
        const response = await fetch(
          `${baseUrl}/movie/${movieId}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );
        const data = await response.json();
        return data.results;
      });

      const recommendations = await Promise.all(moviePromises);
      recommendedMovies = recommendations.flat();
    } else {
      // Si pas de films favoris, on recupere les films populaires filtrés par les genres favoris
      const response = await fetch(
        `${baseUrl}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const data = await response.json();
      recommendedMovies = data.results;
    }

    // On filtre les films recommandés en fonction des préférences de l'utilisateur
    const filteredMovies = recommendedMovies
      .filter((movie: Movie) => {
        // On filtre les films en fonction de la note minimale si spécifiée
        if (body.minRating && movie.vote_average < body.minRating) {
          return false;
        }
        // On filtre par genre si spécifié
        if (body.favoriteGenres?.length) {
          return movie.genres.some(genre => body.favoriteGenres?.includes(genre));
        }
        return true;
      })
      .sort((a, b) => b.vote_average - a.vote_average) // On trie par note décroissante
      .slice(0, 10); // On limite à 10 films

    return NextResponse.json(filteredMovies);
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
