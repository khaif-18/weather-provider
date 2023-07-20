import Image from 'next/image';
import { FiRefreshCw } from 'react-icons/fi';
import { WeatherData } from '../types/weatherData';

interface WeatherProps {
  data: WeatherData;
  datatime: {
    datetime?: string;
    timezone_location?: string;
    timezone_abbreviation?: string;
    latitude?: number;
    longitude?: number;
  };
  fetchWeather: (e: React.FormEvent) => void;
  temp: string[];
  setCity: React.Dispatch<React.SetStateAction<string>>;
}

const Weather = ({ data, datatime, fetchWeather, temp, setCity }:WeatherProps) => {
  const dH = datatime?.datetime?.slice(11, 13);
  const dM = datatime?.datetime?.slice(14, 16);
  const dday = datatime?.datetime?.slice(8, 10);
  const dmonth = datatime?.datetime?.slice(5, 7);
  const dyear = datatime?.datetime?.slice(0, 4);
  const isAM = dH && Number(dH) < 12;

  const refreshData = (e: React.MouseEvent<HTMLButtonElement>) => {
    setCity(temp[temp.length - 1]);
    fetchWeather(e);
  };

  const months: { [key: number]: string } = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  return (
    <div className='relative flex flex-col max-w-[1280px] w-full m-auto p-4 text-gray-300 z-10'>
      {/* Top */}
        <button title='button' onClick={refreshData}>
      <div className='flex justify-center items-center text-4xl text-black font-semibold text-center pb-8'>
        <p className='mr-2 '>Weather in {data.name}</p>
          <FiRefreshCw />
      </div>
        </button>

      {/* Bottom */}
      <div className='relative flex flex-wrap max-[600px]:justify-center justify-between items-center'>
        {/* Time */}
        <div className='bg-black/50 p-8 rounded-md w-[250px] h-[250px] mt-4 text-center'>
          <p className='text-2xl font-bold  text-center'>TIME</p>
          <p className='font-bold text-6xl flex justify-center items-center'>
            {`${dH ? (Number(dH) > 12 ? Number(dH) - 12 : dH) : '00'}:${dM ? dM : '00'}`}{' '}
            <span className='text-[30px] inline'>{isAM ? 'AM' : 'PM'}</span>
          </p>
          <p className='text-xl font-bold'>
            {datatime?.datetime && months[dmonth as unknown as keyof typeof months]} {dday}, {dyear}
          </p>
          <p className='text-sm'>
            {datatime?.timezone_location} ({datatime?.timezone_abbreviation})
          </p>
          <p className='text-sm'>Latitude: {datatime?.latitude}</p>
          <p className='text-sm'>Longitude: {datatime?.longitude}</p>
        </div>
        {/* Temp */}
        <div className='bg-black/50 p-8 rounded-md w-[250px] h-[250px] mt-4'>
          <p className='text-2xl font-bold  text-center'>TEMP</p>
          <div className='relative flex justify-between items-center'>
            <div className='flex flex-col items-center mr-2 px-4 py-2 rounded-full bg-slate-500'>
              <Image
                src={`https://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                alt='icon'
                width='100'
                height='100'
              />
              <p className='mt-[-10px] font-bold'>{data.weather[0].main}</p>
            </div>
            <p className='text-5xl font-bold '>{data.main.temp.toFixed(0)}&#176;C</p>
          </div>
          <p className='text-xl mt-2 text-center'>(Feels Like {data.main.feels_like.toFixed(0)}&#176;C)</p>
        </div>
        {/* Humidity */}
        <div className='bg-black/50 p-8 rounded-md w-[250px] h-[250px] mt-4 text-center'>
          <p className='text-2xl font-bold text-center'>HUMIDITY</p>
          <p className='font-bold text-6xl p-2'>{data.main.humidity}%</p>
          <p className='text-xl'>{data.weather[0].description}</p>
        </div>
        {/* Wind Speed */}
        <div className='bg-black/50 p-8 rounded-md w-[250px] h-[250px] mt-4 text-center'>
          <p className='text-2xl font-bold text-center'>WIND SPEED</p>
          <p className='font-bold text-4xl p-2'>{data.wind.speed} M/S</p>
          <p className='text-lg'>Angle: {data.wind.deg}&#176;</p>
        </div>
      </div>
    </div>
  );
};

export default Weather;
