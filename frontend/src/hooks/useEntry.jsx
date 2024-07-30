import { useState, useEffect, useRef, useContext } from "react";
import useApi from "./auth/useApi";
import DictionaryContext from "../context/useDictionaries";

export function createEntry(word, translates, dictionary) {
    
};

function useEntry(dict) {
    const {changeSorting} = useContext(DictionaryContext);
    const [currentEntries, setCurrentEntries] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [search, setSearch] = useState("");
    const isLoaded = useRef(false);
    const [wordsPerPage, _setWordsPerPage] = useState(dict.wordsPerPage);
    const [sort, _setSort] = useState(dict.sort);
    const {api} = useApi();
    const lastSortType = useRef(dict.sort);

    function getEntryFromResponse(data) {
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

    async function getEntries(startIndex, count=wordsPerPage) {
        const entries = [];
        await api.post(`dictionary/getword/${dict.name}/0/`, {
            start: startIndex,
            count: count
        }).then(response => {
            const entriesData = response.data['words'];
            for (const data of entriesData) {
                entries.push(getEntryFromResponse(data));
            }
        }).catch(error => {
            return [];
        });

        return entries;
    };

    async function loadEntries(startIndex, count=wordsPerPage) {
        const entries = await getEntries(startIndex, count);
        if (entries)
            setCurrentEntries(entries);
    };

    function updateStartIndex(count=wordsPerPage) {
        const index = Math.max(Math.floor((dict.wordsCount-1) / count), 0) * count;
        setCurrentIndex(index);
        return index;
    };

    async function init() {
        const index = updateStartIndex();
        
        try {
            await loadEntries(index);
            isLoaded.current = true;
        } catch(error) {
            console.log("Error while loading entries\n");
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        if (!isLoaded.current && dict) {
            init();
        }
    }, []);

    useEffect(() => {
        async function makeSearch() {

        };

        makeSearch();
    }, [search]);

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
        console.log(`Set new sort -> ${newSortType}, ${sort}`);
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
            }
        });
    };

    function updateEntry(entry, newEntry) {

    };

    async function addToDictionary(entry, dictToAdd) {
        api.post('dictionary/copyentry/', {
            id: entry.id,
            name: dict.name,
            name_to_add: dictToAdd.name
        }).then(response => {
            dictToAdd.wordsCount++;
            return getEntryFromResponse(response.data)
        }).catch(error => {
            console.log("Server error while copping entry\n" + error);
            return error;
        });
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
        setWordsPerPage,
        goToNextPage,
        setSort,
        loadEntries, 
        deleteEntry, 
        updateEntry, 
        addToDictionary, 
        increaseGuesingNumber
    };
};

export default useEntry;