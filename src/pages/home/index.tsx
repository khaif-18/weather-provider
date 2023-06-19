import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useController } from "@/dist/hooks";
import Image from "next/image";
import styles from "styles/home.module.css";

export default function Home() {
  const { data, setSearch } = useController();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(searchValue.trim());
  };

  const getWeatherColor = () => {
    if (data && data.weather) {
      const weather = data.weather[0].main.toLowerCase();
      switch (weather) {
        case "clear":
          return "bg-gradient-to-b from-yellow-200 via-yellow-300 to-yellow-400";
        case "clouds":
          return "bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400";
        case "rain":
          return "bg-gradient-to-b from-blue-200 via-blue-300 to-blue-400";
        case "thunderstorm":
          return "bg-gradient-to-b from-purple-200 via-purple-300 to-purple-400";
        case "snow":
          return "bg-gradient-to-b from-white via-gray-200 to-gray-300";
        default:
          return "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600";
      }
    }
    return "bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600";
  };
  

  return (
    <div className={`min-h-screen flex items-center justify-center ${getWeatherColor()}`}>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-6">Weather App</h1>
        <form onSubmit={handleSearch} className="flex items-center mb-6 shadow">
          <input
            type="search"
            className="px-4 py-2 text-gray-800 rounded-l-full focus:outline-none focus:ring-blue-500 focus:border-blue-500 flex-grow shadow-sm"
            placeholder="Enter City"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded-r-lg px-4 py-2 ml-4">
            <IoSearch className="w-5 h-5" />
          </button>
        </form>
        {data && (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-semibold mb-2">{data.name}</h2>
            <div className="flex items-center">
              <div className="relative w-20 h-20">
                <div className={styles.weatherIconContainer}>
                  <div className={styles.weatherIconFrame}>
                    <Image
                      id="wIcon"
                      src={`https://openweathermap.org/img/w/${data.weather?.[0].icon}.png`}
                      alt="Weather Icon"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-3xl font-semibold">
                  {data.main?.temp}&deg;C
                </p>
                <p className="text-gray-600 text-lg">
                  {data.weather?.[0].description}
                </p>
                <p className="text-gray-600">
                  Feels like: {data.main?.feels_like}&deg;C
                </p>
                <p className="text-gray-600">
                  Humidity: {data.main?.humidity}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-gray-600">
                <p className="text-gray-600">
                  Wind Speed: {data.wind?.speed} m/s
                </p>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${data.wind?.speed}%` }}
                  ></div>
                </div>
              </div>
              <p className="relative mt-4 p-4 text-center">
                Clouds: {data.clouds?.all}%
              </p>
              <p className="mt-4 p-4 bg-gradient-to-r from-yellow-200 to-yellow-500 rounded-lg shadow-lg">
                Sunrise: {data.sys?.sunrise ? new Date(data.sys?.sunrise * 1000).toLocaleTimeString() : ""}
              </p>
              <p className="mt-4 p-4 bg-gradient-to-r from-gray-200 to-gray-500 rounded-lg shadow-lg;">
                Sunset: {data.sys?.sunset ? new Date(data.sys?.sunrise * 1000).toLocaleTimeString() : ""}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
