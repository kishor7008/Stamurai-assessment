"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";
const SearchBar = ({ input, setInput }) => {
    const [inputValue, setInputValue] = useState("");
    const [sugestionValue, setSuggestionsValue] = useState([]);
    const [showSugestionBox, setShowSuggestionsBox] = useState("");

    const handleOnSubmit = (e: any) => {
        e.preventDefault()
        setInput(inputValue)
        console.log("submit")
    }

    function capitalizeFirstLetter(text: string) {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const handleChangeInput = async (value: string) => {
        console.log("jhsbdfbskd")
        const searchValue = value.target.value;
        setInputValue(value.target.value);
        if (value.target.value.length > 0) {
            try {
                const response = await axios.get(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&refine=cou_name_en%3A%22${capitalizeFirstLetter(searchValue)}%22`);
                // console.log("response", response)
                const suggestions = response.data.list.map((item: any) => item.cou_name_en);
                // setSuggestionsValue(suggestions);
                console.log("suggestion box", suggestions)
            } catch (err) {
                console.log("err", err);
            }
        }
    }

    return (
        <form onSubmit={handleOnSubmit} className="max-w-md w-full mx-auto relative">
            <div className="relative">
                <input
                    type="search"
                    className="w-full p-3 rounded-full bg-slate-800 text-white"
                    placeholder="Type to search.."
                    value={inputValue}
                    onChange={(e) => handleChangeInput(e)}
                />
                <button className="absolute right-1 top-1/2 transform -translate-y-1/2 p-3 bg-slate-900 rounded-full" type="submit">
                    <CiSearch style={{ color: 'white', fontSize: '20px' }} />
                </button>
                {/* <div className='absolute top-15 p-2 bg-slate-800 text-white w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2'>
                    <div className='p-1 bg-slate-800 text-white w-full border border-white-400 rounded-md'>
                        <span>Text 1</span>
                    </div>
                </div> */}
            </div>
        </form>

    )
}

export default SearchBar; 