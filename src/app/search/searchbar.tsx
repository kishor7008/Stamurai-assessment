"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { CiSearch } from "react-icons/ci";

interface SearchBarProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
}

interface Suggestion {
    cou_name_en: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ input, setInput }) => {
    const [inputValue, setInputValue] = useState<string>("");
    const [suggestionValue, setSuggestionsValue] = useState<string[]>([]);
    const [showSuggestionBox, setShowSuggestionsBox] = useState<boolean>(false);

    const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setInput(inputValue);
        console.log("submit");
    }

    const capitalizeFirstLetter = (text: string): string => {
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    const handleChangeInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchValue = e.target.value;
        setInputValue(searchValue);
        if (searchValue.length > 0) {
            try {
                const response = await axios.get<{ list: Suggestion[] }>(`https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/geonames-all-cities-with-a-population-1000/records?limit=20&refine=cou_name_en%3A%22${capitalizeFirstLetter(searchValue)}%22`);
                const suggestions = response.data.list.map((item) => item.cou_name_en);
                setSuggestionsValue(suggestions);
                setShowSuggestionsBox(true);
                console.log("suggestion box", suggestions);
            } catch (err) {
                console.log("err", err);
            }
        } else {
            setShowSuggestionsBox(false);
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
                    onChange={handleChangeInput}
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
