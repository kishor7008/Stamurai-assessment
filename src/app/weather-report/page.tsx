"use client"

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import WeatherCard from '../weatherCards/weatherCard';
import MiniCards from '../weatherCards/miniCards';

interface Weather {
    main: string;
    description: string;
    icon: string;
}

interface WeatherData {
    coord: {
        lon: number;
        lat: number;
    };
    main: {
        temp: number;
        temp_min: number;
        temp_max: number;
        humidity: number;
        pressure: number;
        feels_like: number;
    };
    wind: {
        speed: number;
    };
    sys: {
        sunrise: string;
        sunset: string;
    };
    name: string;
    dt_txt: string;
    weather: Weather[];
}

interface ForecastData {
    dt_txt: string;
    weather: Weather[];
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

interface ForecastResponse {
    list: ForecastData[];
}

const Page: React.FC = () => {
    const searchParams = useSearchParams();
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [fiveDaydata, setFiveDayaData] = useState<ForecastResponse | null>(null);
    const [bg, setBg] = useState<Weather[]>([]);
    const [toDay, setToDay] = useState<WeatherData | null>(null);

    const city = searchParams.get('city');
    const key = "07f6e8c0dff0d9d6260082aee791ec34";
    let lon: number | undefined;
    let lat: number | undefined;

    const getWetherData = () => {
        fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`
        ).then((res) => res.json())
            .then((data: WeatherData) => {
                setToDay(data);
                lon = data.coord.lon;
                lat = data.coord.lat;
                setBg(data.weather);
                weatherData(lon, lat);
            })
            .catch((error) => console.log("error", error));
    }

    const weatherData = (lon: number, lat: number) => {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${key}`)
            .then((res) => res.json())
            .then((data: ForecastResponse) => {
                setFiveDayaData(data);
            })
            .catch((error) => console.log("error", error));
    }

    const filterForcastByfirstObjTime = (fiveDaydata: ForecastData[] | undefined) => {
        if (!fiveDaydata) {
            return [];
        }
        const firstObjTime = fiveDaydata[0]?.dt_txt.split(" ")[1];
        return fiveDaydata.filter((data) => data.dt_txt.endsWith(firstObjTime));
    }

    const filteredForcast = filterForcastByfirstObjTime(fiveDaydata?.list);

    useEffect(() => {
        getWetherData();
    }, []);

    const mapUrl = `https://maps.google.com/maps?q=${lat},${lon}&z=16&output=embed`;

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 940);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const weatherBackgrounds = () => {
        if (bg[0]?.main === "Clouds") {
            return "url('/assets/img-4.webp')";
        }
        if (bg[0]?.main === "Rain") {
            return "url('/assets/img-3.jpg')";
        }
        if (bg[0]?.main === "Clear") {
            return "url('/assets/img-2.jpg')";
        }
        if (bg[0]?.main === "Snow") {
            return "url('/assets/img-5.jpeg')";
        }
    }
console.log(bg,"bg")
    return (
        <>
            <div className={`fixed pt-10 w-full top-0 left-0 bg-cover bg-no-repeat h-screen`} style={{ backgroundImage: `${weatherBackgrounds()}` }}>
                <div className='absolute flex inset-0 overflow-y-auto flex-wrap justify-between'>
                    <div className={`border-white w-full md:w-1/2 lg:w-1/2 px-4 md:px-6 lg:px-8 ${isSmallScreen ? 'mb-8 md:mb-0' : ''}`}>
                        <WeatherCard
                            time={toDay?.dt_txt ?? ""}
                            windSpeed={toDay?.wind?.speed}
                            humidity={toDay?.main?.humidity}
                            pressure={toDay?.main?.pressure}
                            minTemp={toDay?.main?.temp_min}
                            temp={toDay?.main?.temp}
                            name={toDay?.name}
                            feelsLike={toDay?.main?.feels_like}
                            maxTemp={toDay?.main?.temp_max}
                            sunrise={toDay?.sys?.sunrise}
                            sunset={toDay?.sys?.sunset ?? ""}
                            // theme={bg[0]}
                        />
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

                    <div className={`w-full md:w-1/2 lg:w-1/2 px-4 md:px-6 lg:px-8 flex flex-col`}>
                        {filteredForcast?.map((curr, index) => (
                            <MiniCards
                                key={index}
                                description={curr.weather[0].description}
                                time={curr.dt_txt}
                                temp={curr.main.temp}
                                icon={curr.weather[0].icon}
                                iconTheme={curr.weather[0].main}
                                windSpeed={curr.wind.speed}
                                maxTemp={curr.main.temp_max}
                                minTemp={curr.main.temp_min}
                                humidity={curr.main.humidity}
                                pressure={curr.main.pressure}
                            />
                        ))}
                    </div>

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
    );
}

export default Page;
