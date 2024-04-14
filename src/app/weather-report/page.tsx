"use client"
// import { useRouter } from "next/router";

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import WeatherCard from '../weatherCards/weatherCard';
import MiniCards from '../weatherCards/miniCards';
interface WeatherData {
    lon: number;
    lat: number;
    humidity: number;
    speed: number;
}

interface MiniCardData {
    dt_txt: number;
    weather: {
        description: string;
        icon: string;
        main: string;
    }[];
    main: {
        temp: number;
        temp_max: number;
        temp_min: number;
        humidity: number;
        pressure: number;
    };
    wind: {
        speed: number;
    };
}

const Page: React.FC = () => {
    const searchParams = useSearchParams();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [fiveDaydata, setFiveDayaData] = useState([]);
    const [bg, setBg] = useState("");
    // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}
    const [toDay, setToDay] = useState("")
    const city = searchParams.get('city')
    let key = "07f6e8c0dff0d9d6260082aee791ec34";
    var lon;
    var lat;
    const getWetherData = () => {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
        ).then((res) => res.json())
            .then((data) => {
                setToDay(data);
                console.log("data current data", data);
                lon = data.coord.lon;
                lat = data.coord.lat;
                console.log(" data.weather[0].description", data.weather[0].main)
                setBg(data.weather);
                weatherData(lon, lat)
            })
            .catch((error) => console.log("error", error));
    }
    console.log("today data ", toDay)

    const weatherData = (lon: number, lat: number) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
            .then((res) => res.json())
            .then((data) => {
                setFiveDayaData(data);
                console.log("data...............", data);
            })
            .catch((error) => console.log("error", error));
    }

    // function to filter forcast data based on the time of the first objcet 
    const filterForcastByfirstObjTime = (fiveDaydata: string[]) => {
        if (!fiveDaydata) {
            return []
        }
        const firstObjTime = fiveDaydata[0]?.dt_txt.split(" ")[1];
        return fiveDaydata.filter((data) => data.dt_txt.endsWith(firstObjTime));
    }
    const filteredForcast = filterForcastByfirstObjTime(fiveDaydata?.list);
    // console.log("filteredforedcasr", filteredForcast);
    // console.log("fiveDaydata", fiveDaydata)


    useEffect(() => {
        // weatherData
        getWetherData();

    }, [])

    console.log("lan , lat", lon, lat);
    const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`;
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 940);
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

    const weatherBackgrounds = () => {
        // console.log("")
        if (bg[0]?.main === "Clouds") {
            return "url('/assets/img-4.webp')"
        }
        if (bg[0]?.main === "Rain") {
            return "url('/assets/img-3.jpg')"
        }
        if (bg[0]?.main === "Clear") {
            return "url('/assets/img-2.jpg')"
        }
        if (bg[0]?.main === "Snow") {
            return "url('/assets/img-5.jpeg')"
        }
    }

    console.log("nain ",bg[0]?.main)
    return <>
        <div className={` fixed pt-10  w-full  top-0 left-0  h-full  bg-cover bg-no-repeat    h-screen `} style={{ backgroundImage: `${weatherBackgrounds()}` }}>
            {/* Left Side */}
            <div className='absolute flex inset-0 overflow-y-auto flex-wrap justify-between'>
                <div className={` border-white w-full md:w-1/2 lg:w-1/2 px-4 md:px-6 lg:px-8 ${isSmallScreen ? 'mb-8 md:mb-0' : ''}`}>
                    {/* Left Div 1 */}
                    <WeatherCard
                        // place={thisLocation}
                        time={toDay?.dt_txt}
                        windSpeed={toDay?.wind?.speed}
                        humidity={toDay?.main?.humidity}
                        pressure={toDay?.main?.pressure}

                        minTemp={toDay?.main?.temp_min}
                        temp={toDay?.main?.temp}
                        name={toDay?.name}
                        feelsLike={toDay?.main?.feels_like}
                        maxTemp={toDay?.main?.temp_max}
                        sunrise={toDay?.sys?.sunrise}
                        sunset={toDay?.sys?.sunset}
                        // description={toDay?.weather}
                        theme={bg}

                    // icon={toDay?.weather[0]?.icon ?? ""}
                    />
                    {/* Left Div 2 */}
                    {!isSmallScreen && (
                        <div className="bg-gray-200 p-4">
                            <div className="map-container">
                                <iframe

                                    title="Google Maps"
                                    width="100%"
                                    height="400"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={mapUrl}
                                    allowFullScreen
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Side */}
                <div className={`w-full md:w-1/2 lg:w-1/2 px-4 md:px-6 lg:px-8 flex flex-col`}>
                    {/* Right Divs */}
                    {
                        filteredForcast?.map(curr => {
                            return (
                                <MiniCards
                                    key={curr}
                                    description={curr.weather[0].description}
                                    time={curr.dt_txt}
                                    temp={curr?.main?.temp}
                                    icon={curr.weather[0].icon}
                                    iconTheme={curr.weather[0].main}
                                    windSpeed={curr.wind.speed}
                                    maxTemp={curr.main.temp_max}
                                    minTemp={curr.main.temp_min}
                                    humidity={curr.main.humidity}
                                    pressure={curr.main.pressure}
                                />
                            )
                        })
                    }
                </div>

                {/* Conditionally render Left Div 2 at the bottom for small screens */}
                {isSmallScreen && (
                    <div className="bg-gray-200 p-4">
                        <div className="map-container">
                            <iframe
                                title="Google Maps"
                                width="100%"
                                height="400"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={mapUrl}
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default Page;