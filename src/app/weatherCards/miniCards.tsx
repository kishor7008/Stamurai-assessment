"use client";

import { BiDownArrowAlt, BiUpArrowAlt } from "react-icons/bi";;
import { useEffect, useState } from "react";
import Image from "next/image";
interface MiniCardsData {
    time: string;
    description: string;
    temp: number;
    icon: string;
    iconTheme: string;
    windSpeed: number;
    maxTemp: number;
    minTemp: number;
    humidity: number;
    pressure: number;
}

const MiniCards = ({
    time,
    description,
    temp,
    icon,
    iconTheme,
    windSpeed,
    maxTemp,
    minTemp,
    humidity,
    pressure,
}: MiniCardsData) => {
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [anyIcon, setAnyIcon] = useState("")
    useEffect(() => {
        switch (iconTheme) {
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
    }, [iconTheme])


    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 440);
        };

        // Initial check for window size
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup function to remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <>
            <div className="relative w-full mb-3 p-2 bg-gray-500 bg-opacity-50">
                <div className="border border-white p-4 text-white">
                    <h2 className="text-lg font-semibold mb-4">{new Date(time).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric" })}</h2>
                    <div className="flex flex-col lg:flex-row items-center">
                        <Image src={anyIcon} alt="forecast not available" className="w-24 h-24 lg:w-32 lg:h-32 mb-4 lg:mb-0" />
                        <div className="ml-0 lg:ml-4">
                            <p className="font-bold text-center  text-3xl ">{(temp - 273.15).toFixed(2)}&deg;C</p>
                            <p className="mb-1 text-center">{description}</p>
                            <div className="flex flex-row items-center mb-2">
                                <span><BiUpArrowAlt className="text-red-400 text-3xl" /></span>
                                <span className="mr-2">{(maxTemp - 273.15).toFixed(2)}&deg;C</span>
                                <span><BiDownArrowAlt className="text-blue-400 text-3xl" /></span>
                                <span className="mr-4">{(minTemp - 273.15).toFixed(2)}&deg;C</span>
                            </div>
                            {!isSmallScreen ?

                                <>
                                    <div className="flex flex-row items-center mb-2">
                                        <span className="mr-4">   <p className='flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-blue-600'>Wind Speed </p></span>
                                        <span className="mr-4"  >  <p className='flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-green-600'> Humidity </p> </span>
                                        <span className="mr-4">   <p className='flex-1 text-center p-2 mr-1  font-bold rounded-lg bg-yellow-500'>Pressure </p></span>

                                    </div>
                                    <div className="flex flex-row items-center mb-2">
                                        <span><BiUpArrowAlt className="text-blue-500 text-3xl" /></span>
                                        <span className="mr-2 text-blue-500">{windSpeed} km/h</span>
                                        <span><BiDownArrowAlt className="text-green-600 text-3xl" /></span>
                                        <span className="mr-2 text-green-600">{humidity} gm/m&#179;</span>
                                        <span className="ml-2"><BiDownArrowAlt className="text-yellow-500 text-3xl" /></span>
                                        <span className=" text-yellow-500">{pressure}</span>
                                    </div>
                                </>
                                :
                                <>
                                    <div className="flex flex-row items-center text-center mb-2">
                                        <span className="mr-4 ml-5"  >  <p className='flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-green-600'>H</p> </span>
                                        <span className="ml-7 mr-5">   <p className='flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-blue-600'>W-S </p></span>
                                        <span className="ml-5">   <p className='flex-1 text-center p-2 mr-1 font-bold rounded-lg bg-yellow-500'>P </p></span>
                                    </div>

                                    <div className="flex flex-row items-center mt-2">
                                        <span><BiDownArrowAlt className="text-green-600 text-3xl" /></span>
                                        <span className="mr-2 text-green-600">{humidity} gm/m&#179;</span>
                                        <span><BiUpArrowAlt className="text-blue-500 text-3xl" /></span>
                                        <span className="mr-2 text-blue-500">{windSpeed} km/h</span>
                                        <span><BiDownArrowAlt className="text-yellow-500 text-3xl" /></span>
                                        <span className="text-yellow-500">{pressure}</span>
                                    </div>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}


export default MiniCards;



