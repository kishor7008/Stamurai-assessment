"use client"
import { useEffect, useState } from "react";
import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";
interface WeatherCardProps {
  time: string;
  windSpeed: number;
  name: string;
  theme: string;
  humidity: number;
  description: string;
  icon: string;
  minTemp: number;
  temp: number;
  maxTemp: number;
  feelsLike: number;
  sunrise: string;
  sunset: string;
  pressure:number;
}
const WeatherCard: React.FC<WeatherCardProps> = ({ pressure, windSpeed, name, theme, humidity, icon, minTemp, temp, maxTemp, feelsLike, sunrise, sunset }) => {

  const [anyIcon, setAnyIcon] = useState("")
  useEffect(() => {
    switch (theme) {
      case "Clouds ":
        setAnyIcon('/assets/cloudy.svg');
      case "Rain":
        setAnyIcon('/assets/thunderstorms-night-rain.svg');
        break;
      case "Clear":
        setAnyIcon('/assets/clear-day.svg');
        break;
      case "Snow":
        setAnyIcon('/assets/snow.svg');
        break;
      case "Fog":
        setAnyIcon('/assets/sleet.svg');
        break;
      case "Wind":
        setAnyIcon('/assets/wind.svg');
        break;
      case "Storm":
        setAnyIcon('/assets/thunderstorms.svg');
        break;
      default:
        setAnyIcon('/assets/cloudy.svg');
        break;
    }
  }, [theme])
  return (
    <>
      <div className="bg-gray-700 bg-opacity-50 w-full glassCard p-4 mt-12 items-center">
        <div className="text-white border border-white text-center">

          <img src={anyIcon} alt="weather_icon" width={200} height={50} className="mb-4 mx-auto" />
          <p className="font-bold text-4xl md:text-5xl mb-4">{name}</p>
          <div className="font-bold text-1x1">Weather You Feel Like: {feelsLike}&deg;C</div>
          <div className="font-bold text-x1">{new Date().toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
          <div className="font-bold text-x1">
            <p className="font-semibold text-lg">{temp} &deg;C</p>
          </div>
          <div className="w-full flex justify-between items-center mt-4">
            <p className="flex-1 text-center p-2">{theme[0]?.description}</p>
          </div>
          <div className="w-full pl-3 mt-4 flex justify-between items-center">
            <p className="text-lg flex"> <BiUpArrowAlt className="text-red-400 text-3xl" />
              <span className="mr-2">{maxTemp}&deg;C</span></p>
            <p className="text-lg flex">   <BiDownArrowAlt className="text-blue-400 text-3xl" />
              <span className="mr-4">{minTemp}&deg;C</span></p>
          </div>
          <hr className="bg-slate-600 mt-5 mb-5" />

          <div className="w-full flex justify-between items-center mt-4 gap-4">
            <p className="flex-1 text-center p-2 ml-1 font-bold bg-blue-600 shadow rounded-lg">Wind Speed <p className="font-normal">{windSpeed} km/h</p></p>
            <p className="flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-green-600">Humidity <p className="font-normal">{humidity} gm/m&#179;</p></p>
          </div>
          <div className="w-full p-3 mt-4 flex justify-center items-center">
            <p className="flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-yellow-500">Pressure <p className="font-normal">{pressure} gm/m&#179;</p></p>
          </div>
          <hr className="bg-slate-600 mt-5 mb-5" />
        </div>
      </div>
    </>
  )
}



export default WeatherCard;