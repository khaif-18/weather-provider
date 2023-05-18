export interface Iweather{
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface Home{
  coord: {
    lon: number;
    lat: number;
  }
  weather: {
    [key: number] : Iweather;
  };
  base:string;
  visibility: number;
  main: {
    temp: number,
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level: number;
    grnd_level: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  },
  clouds: {
    all: number;
  },
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  },
  timezone: number;
  id: number;
  name: string;
  cod: number;
}