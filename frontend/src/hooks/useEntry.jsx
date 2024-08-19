import { useState, useEffect, useRef, useContext } from "react";
import useApi from "./auth/useApi";
import DictionaryContext from "../context/useDictionaries";

export const SearchTypes = {
    word: 0,
    translates: 1,
    notes: 2,
    time: 3
}

export function getEntryFromResponse(data) {
    try {
        return {
            word: data['word'],
            translates: data['translates'],
            notes: data['notes'],
            guesingScore: [data['guessed_num'], data['guessing_attempts']],
            addingTime: data['adding_time'],
            id: data['id']
        };
    } catch(error) {
        console.log(`Not all data were specified, ${error}`);
        return null;
    };
};

function useEntry(dict) {
    const {changeSorting} = useContext(DictionaryContext);
    const [currentEntries, setCurrentEntries] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [search, _setSearch] = useState("");
    const [searchType, _setSearchType] = useState(SearchTypes.word);
    const [wordsPerPage, _setWordsPerPage] = useState(dict.wordsPerPage);
    const [sort, _setSort] = useState(dict.sort);
    const [wordsCount, _setWordsCount] = useState(dict.wordsCount);
    const {api} = useApi();

    async function getEntries(startIndex, count=wordsPerPage, search=search, _searchType=searchType) {
        const entries = [];
        let index = startIndex;
        let newWordsCount = dict.wordsCount;

        const data = {
            start: startIndex,
            count: count
        }
        if (search !== "") {
            data.search = search;
            data.searchType = _searchType;
        }

        await api.post(`dictionary/getword/${dict.name}/0/`, data)
        .then(response => {
            console.log("Got entries:");
            console.log(response);
            const entriesData = response.data['words'];
            for (const data of entriesData) {
                entries.push(getEntryFromResponse(data));
            }

            if ('start' in response.data)
                index = response.data['start'];
            if ('count' in response.data)
                newWordsCount = response.data['count'];
        }).catch(error => {
            return [];
        });
        
        return [entries, index, newWordsCount];
    };

    async function loadEntriesNoModification(startIndex, count=wordsPerPage) {
        console.log("request to load entries");
        const [entries, index, newCount] = await getEntries(startIndex, count, "", 0);
        if (entries) {
            if (index === startIndex)
                setCurrentEntries(entries);
            else
                setCurrentEntries([])
        }
    };

    async function loadEntries(startIndex, count=wordsPerPage, _search=search, _searchType=searchType) {
        const [entries, index, newWordsCount] = await getEntries(startIndex, count, _search, _searchType);
        if (entries) {
            setCurrentEntries(entries);
            if (index !== startIndex)
                setCurrentIndex(index);
            if (wordsCount !== newWordsCount)
                _setWordsCount(newWordsCount);
        }
    }

    function updateStartIndex(count=wordsPerPage) {
        const index = Math.max(Math.floor((wordsCount-1) / count), 0) * count;
        setCurrentIndex(index);
        return index;
    };

    async function init() {
        const index = updateStartIndex();
        
        try {
            await loadEntriesNoModification(index);
        } catch(error) {
            console.log("Error while loading entries\n");
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        console.log(dict.id);
        init();
    }, []);

    async function setSearch(searched) {
        _setSearch(searched);
        loadEntries(currentIndex, wordsPerPage, searched);
    };

    async function setSearchType(type) {
        _setSearchType(type);
        if (search) {
            loadEntries(currentIndex, wordsCount, search, type);
        }
    };

    async function setWordsPerPage(number) {
        if (number < 2 || number > 20)
            return;
        _setWordsPerPage(number);
        
        if (number < wordsPerPage) {
            if (currentEntries.length > number)
                setCurrentEntries(currentEntries.slice(0, number));
        } else if (number > wordsPerPage && currentIndex+wordsPerPage < dict.wordsCount) {
            const newElems = await getEntries(currentIndex+wordsPerPage, 
                    Math.min(dict.wordsCount-(currentIndex+wordsPerPage), number-wordsPerPage));
            setCurrentEntries(entries => [...entries, ...newElems]);
        }
    };

    async function setSort(newSortType) {
        if (sort === newSortType)
            return;
        
        await changeSorting(dict, newSortType);
        loadEntries(currentIndex);
        _setSort(newSortType);
    }

    async function deleteEntry(entry) {
        let replacment = null;
        try { 
            const replacmentData = await api.post(`dictionary/getword/${dict.name}/${0}/`, {
                start: currentIndex + wordsPerPage,
                count: 1
            });
            replacment = getEntryFromResponse(replacmentData.data['words'][0]);
        } catch(error) {}

        api.post(`dictionary/deleteentry/${dict.name}/${entry.id}/`)
        .then(reponse => {
            dict.wordsCount--;
            if (currentEntries.length === 1 && currentEntries[0] === entry) {
                init();
            } else {
                setCurrentEntries(entries => {
                    const updatedEntries = entries.filter(item => item !== entry);
                    if (replacment !== null) 
                        updatedEntries.push(replacment);
                    return updatedEntries;
                });
                _setWordsCount(c => c-1);
            }
        });
    };

    function updateEntry(entry, newEntry) {

    };

    async function increaseGuesingNumber(entry, rezult) {
        api.post(`dictionary/increaseGuesing/${dict.name}/${entry.id}/${rezult}/`)
        .then(response => {
            entry.guesingScore[0] += rezult;
            entry.guesingScore[1]++;
        })
    };

    function goToNextPage(move) {
        const newIndex = currentIndex + move*wordsPerPage;
        const newIndexWithBounds = Math.min(Math.max(newIndex, 0), Math.floor((dict.wordsCount-1)/wordsPerPage)*wordsPerPage);
        setCurrentIndex(newIndexWithBounds);
        loadEntries(newIndexWithBounds);
    }

    return {
        currentEntries, 
        currentIndex, 
        wordsPerPage,
        wordsCount,
        search,
        searchType,
        setSearchType,
        setSearch,
        setWordsPerPage,
        goToNextPage,
        setSort,
        loadEntries, 
        deleteEntry, 
        updateEntry, 
        increaseGuesingNumber
    };
};

export default useEntry;