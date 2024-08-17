"use client";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  ChevronUpIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
} from '@material-tailwind/react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Link from "next/link";
import Nav from "../navbar/nav";
import Spiner from "./spiner";
import Typography from "../utils/Typography";

// Define interface for city data fields
interface CityFields {
  city_name: string;
  population: number;
  // Define other fields if needed
}

// Define interface for city data
interface CityData {
  recordid: string;
  cou_name_en: string;
  name: string;
  timezone: string;
  population: number;
  geoname_id: string;
  country_code: string;
  fields: CityFields;
  // Add other fields if needed
}

const Table: React.FC = () => {
  const headingRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [colorUpArraw, setColorUpArraw] = useState(false);
  const [colorDownArrow, setColorDownArrow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [offset, setOffset] = useState(0);

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const getData = () => {
    let url = "";
    if (input.length) {
      url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10&offset=${(1 - 1) * 10}&refine=cou_name_en:${capitalizeFirstLetter(input)}`;
    } else {
      url = `https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=10`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("data", data);
        setCityData(data.results);
        setLoading(false);
      })
      .catch((err) => console.log("error", err));
  };

  useEffect(() => {
    getData();
    const interval = setInterval(() => {
      setLoading(false);
    }, 1000); // Reset after 1 second

    return () => clearInterval(interval);
  }, [input]);

  const handleAscendingOrder = (head: string) => {
    let sortData: CityData[] = [];
    if (head === "Country Code") {
      sortData = [...cityData].sort((a, b) => a.country_code.localeCompare(b.country_code));
    }
    if (head === "Cuntries") {
      sortData = [...cityData].sort((a, b) => a.cou_name_en.localeCompare(b.cou_name_en));
    }
    if (head === "City Name") {
      sortData = [...cityData].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (head === "TimeZone") {
      sortData = [...cityData].sort((a, b) => a.timezone.localeCompare(b.timezone));
    }
    if (head === "Poulation") {
      sortData = [...cityData].sort((a, b) => b.population - a.population);
    }
    setCityData(sortData);
    setColorUpArraw(true);
    setColorDownArrow(false);
  };

  const handleDescendingOrder = (head: string) => {
    let sortData: CityData[] = [];
    if (head === "Country Code") {
      sortData = [...cityData].sort((a, b) => b.country_code.localeCompare(a.country_code));
    }
    if (head === "Cuntries") {
      sortData = [...cityData].sort((a, b) => b.cou_name_en.localeCompare(a.cou_name_en));
    }
    if (head === "City Name") {
      sortData = [...cityData].sort((a, b) => b.name.localeCompare(a.name));
    }
    if (head === "TimeZone") {
      sortData = [...cityData].sort((a, b) => b.timezone.localeCompare(a.timezone));
    }
    if (head === "Poulation") {
      sortData = [...cityData].sort((a, b) => a.population - b.population);
    }
    setCityData(sortData);
    setColorUpArraw(false);
    setColorDownArrow(true);
  };

  const TABLE_HEAD = ["Country Code", "Cuntries", "City Name", "TimeZone", "Poulation"];
  return (
    <>
      <Nav setInput={setInput} input={input} />
      <Card  className="h-full w-full"
  title="Card Title" // Example of a required prop
  color={"default"} />

        <CardHeader
         title="My Card Title" 
         placeholder="Placeholder Text"
         onPointerEnterCapture={() => console.log('Pointer entered')}
         onPointerLeaveCapture={() => console.log('Pointer left')}>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-gray-600 bg-gray-500"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-bold text-white  leading-none opacity-90"
                      >
                        {head}{" "}
                        {index !== TABLE_HEAD.length && (
                          <>
                            <span>
                              <ChevronUpIcon className={`h-3 w-4  text-white hover:text-black`} onClick={() => handleAscendingOrder(head)} />
                              <ChevronDownIcon className={`h-3 w-4 text-white hover:text-black`} onClick={() => handleDescendingOrder(head)} />
                            </span>
                          </>
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
        </CardHeader>
        <CardBody
         placeholder="Your placeholder text"
         onPointerEnterCapture={() => console.log('Pointer entered')}
         onPointerLeaveCapture={() => console.log('Pointer left')}
         className="overflow-y-auto max-h-[600px]">
          <InfiniteScroll
            dataLength={cityData.length}
            next={getData}
            // pageStart={0}
            loadMore={(_:any) => {
              setLoading(true);
            }}
            hasMore={loading}
          >
            {!loading ?
              <table className="w-full table-auto text-left">
                <tbody>
                  {
                    cityData.length > 0 ?
                      (
                        cityData.map(
                          ({ country_code, cou_name_en, name, population, timezone }, index) => {
                            const isLast = index === cityData.length - 1;
                            const classes = isLast
                              ? "p-4"
                              : "p-4 border-b border-blue-gray-50 text-left";
                            return (
                              <tr key={name} className="hover:bg-gray-300">
                                <td className={`${classes} w-80`} color="blue-gray">
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal text-left"
                                  >
                                    {country_code}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal text-left"
                                  >
                                    {cou_name_en}
                                  </Typography>
                                </td>
                                <td className={`${classes} hover:text-blue-700`}>
                                  <Link href={`/weather-report?city=${name}`}>
                                    <Typography
                                      variant="small"
                                      color="blue-gray"
                                      className="font-normal text-left"
                                    >
                                      {name}
                                    </Typography>
                                  </Link>
                                </td>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal text-left"
                                  >
                                    {timezone}
                                  </Typography>
                                </td>
                                <td className={classes}>
                                  <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal text-left"
                                  >
                                    {population}
                                  </Typography>
                                </td>
                              </tr>
                            );
                          },
                        )
                      )
                      : <h3>Data Not Found</h3>
                  }
                </tbody>
              </table>
              : <td className="px-6 py-4 col-span-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan={5}>
                <div className="flex justify-center">
                  <Spiner />
                </div>
              </td>}
          </InfiniteScroll>
        </CardBody>
      </Card>
    </>
  );
};

export default Table;
