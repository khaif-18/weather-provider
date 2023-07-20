# Weather App

<!-- ![Weather App Screenshot](screenshot.png) -->

A simple weather app built with React and Next.js that allows users to search for weather information in different cities. The app retrieves weather data from the OpenWeatherMap API and displays the current temperature, weather conditions, humidity, and wind speed.


## Features

- Search for weather information in any city around the world.
- Real-time updates for temperature, weather conditions, humidity, and wind speed.
- Beautiful gradient background based on the weather condition.

## Technologies Used

- React
- Next.js
- Axios
- Tailwind CSS
- React Icons

## Getting Started

Follow the instructions below to set up the project on your local machine.

1. Clone the repository:

```bash
https://github.com/khaif-18/weather-provider.git
```

2. Change Into Project Directory:

```bash
cd weather-app
```

3. Install the dependencies using Yarn:

```bash
yarn
```

4. Set up environment variables:

Create a .env.local file in the root directory and add your API keys:

```bash
NEXT_PUBLIC_WEATHER_KEY=your_openweathermap_api_key
NEXT_PUBLIC_TIME_KEY=your_abstractapi_time_key
```

5. Run the development server:

```bash
yarn dev
```

6. Open your browser and navigate to http://localhost:3000 to see the app in action.

## Deploying to Vercel

This app is set up for easy deployment to Vercel. Simply create an account on Vercel, link your GitHub repository, and it will automatically deploy on each push to the master branch.

## Contributing

Contributions are welcome! If you find any issues or want to add new features, feel free to open a pull request.


