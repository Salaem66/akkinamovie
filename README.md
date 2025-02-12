# AkinaMovie

AkinaMovie is a web application that recommends movies to users based on their preferences. It is built with Next.js and TypeScript, and it leverages the TMDB API to fetch movie data.

## Features

* **Movie Recommendations**: Get personalized movie recommendations based on your preferences.
* **Streaming Services**: Filter movies by your subscribed streaming services.
* **Movie Details**: View detailed information about recommended movies.
* **Offline Support**: The application works offline using a service worker.
* **Responsive Design**: Optimized for both desktop and mobile devices.

## Getting Started

### Prerequisites

* Node.js
* npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/akinamovie.git
cd akinamovie
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your TMDB API key:
```bash
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key
```

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Starting the Production Server

```bash
npm start
# or
yarn start
```

## Usage

1. Open the application in your browser.
2. Answer the questions about your movie preferences.
3. Get personalized movie recommendations.
4. View detailed information about each recommended movie.
5. Filter movies by your subscribed streaming services.
