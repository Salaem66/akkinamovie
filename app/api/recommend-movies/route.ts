import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Received request body:", JSON.stringify(body, null, 2))

    // TODO: Implement your movie recommendation logic here
    // For now, we'll return a mock response
    const mockRecommendations = [
      {
        id: 1,
        title: "Back to the Future",
        overview:
          "Marty McFly, a 17-year-old high school student, is accidentally sent thirty years into the past in a time-traveling DeLorean invented by his close friend, the eccentric scientist Doc Brown.",
        release_date: "1985-07-03",
        vote_average: 8.5,
        poster_path: "/qvktm0BHcnmDpul4Hz01GIazWPr.jpg",
        runtime: 116,
      },
      // Add more mock movies here
    ]

    return NextResponse.json(mockRecommendations)
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json({ error: "An error occurred while processing your request" }, { status: 500 })
  }
}

