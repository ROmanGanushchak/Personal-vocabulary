import { useState, useEffect, useRef } from "react";
import useApi from "./auth/useApi";

export function createEntry(word, translates, dictionary) {
    
};

function useEntry(dict) {
    const [currentEntries, setCurrentEntries] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const isLoaded = useRef(false);
    const wordsPerPage = 2;
    const {api} = useApi();

    function getEntryFromResponse(data) {
        try {
            return {
                word: data['native_word'],
                translates: [data['learned_word']],
                addingTime: data['adding_time'],
                guesingScore: [data['guessed_num'], data['guessing_attempts']],
                notes: "something",
                id: data['id']
            };
        } catch(error) {
            console.log(`Not all data were specified, ${error}`);
        };
    };

    async function loadEntries(startIndex) {
        const entries = [];

        await api.post(`dictionary/getword/${dict.name}/0/`, {
            start: startIndex,
            count: wordsPerPage
        }).then(response => {
            const entriesData = response.data['words'];
            for (const data of entriesData) {
                entries.push(getEntryFromResponse(data));
            }
        }).catch(error => {
            console.log("Cant load entries because of back error, ");
            console.log(error);
            return;
        });

        setCurrentEntries(entries);
    };

    async function updateStartIndex() {
        try {
            const response = await api.post(`dictionary/getlastindex/${dict.name}/`, {
                count: wordsPerPage
            });

            const index = response.data;
            setCurrentIndex(index);
            return index;
        } catch (error) {
            console.log("Cant load entries because of back error");
            console.log(error);
            return -1;
        }
    }

    async function init() {
        const index = await updateStartIndex();
        
        try {
            await loadEntries(index);
        } catch(error) {
            console.log("Error while loading entries\n");
            console.log(error);
            return;
        }
    };

    useEffect(() => {
        if (!isLoaded.current && dict) {
            init();
            isLoaded.current = false;
        }
    }, [dict]);

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

    return {
        currentEntries, 
        currentIndex, 
        wordsPerPage,
        loadEntries, 
        deleteEntry, 
        updateEntry, 
        addToDictionary, 
        increaseGuesingNumber
    };
};

export default useEntry;