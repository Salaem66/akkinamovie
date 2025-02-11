export function formatProviderName(name: string): string {
  const nameMap: { [key: string]: string } = {
    "Amazon Prime Video": "Amazon Prime Video",
    "Disney Plus": "Disney+",
    "Apple TV Plus": "Apple TV+",
    "Canal+": "Canal+",
    OCS: "OCS",
    Netflix: "Netflix",
    "Netflix basic with ads": "Netflix",
    "Paramount+": "Paramount+",
    "MGM+": "MGM+",
    Starz: "Starz",
    "HBO Max": "HBO Max",
    Peacock: "Peacock",
    Showtime: "Showtime",
    "discovery+": "discovery+",
    fuboTV: "fuboTV",
    "YouTube TV": "YouTube TV",
    Hulu: "Hulu",
    "ESPN+": "ESPN+",
    "Apple TV": "Apple TV",
  }

  console.log("Formatting provider name:", name, "Result:", nameMap[name] || name)
  return nameMap[name] || name
}

