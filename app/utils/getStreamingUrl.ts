export function getStreamingUrl(providerName: string, movieTitle: string): { web: string; app: string } | null {
  const encodedTitle = encodeURIComponent(movieTitle)
  switch (providerName) {
    case "Netflix":
      return {
        web: `https://www.netflix.com/search?q=${encodedTitle}`,
        app: `netflix://search?q=${encodedTitle}`,
      }
    case "Disney+":
      return {
        web: `https://www.disneyplus.com/`,
        app: `disneyplus://`,
      }
    case "Prime Video":
      return {
        web: `https://www.primevideo.com/search?k=${encodedTitle}`,
        app: `primevideo://search?phrase=${encodedTitle}`,
      }
    case "Canal+":
      return {
        web: `https://www.canalplus.com/recherche?q=${encodedTitle}`,
        app: `canalplus://`,
      }
    case "OCS":
      return {
        web: `https://www.ocs.fr/`,
        app: `ocs://`,
      }
    case "Apple TV+":
      return {
        web: `https://tv.apple.com/search?term=${encodedTitle}`,
        app: `com.apple.tv://search?term=${encodedTitle}`,
      }
    default:
      return null
  }
}

