import { createContext, useEffect, useState } from "react";
import useApi from "../hooks/auth/useApi";


const DictionaryContext = createContext({});

function createDinctionaryFromResponse(data) {
    try {
        const dict = {
            lang: data['language'], 
            dateCreated: data['date_created'], 
            name: data['name'], 
            isDefault: data['is_default'],
            wordsCount: data['words_count']
        }
        return dict;
    } catch(error) {
        throw new Error("Not all data were provoided to form dictionary");
    }
};

export function DictionaryContextProvider( {children} ) {
    const [dicts, setDicts] = useState([]);
    const {api} = useApi();

    useEffect(() => {
        api.get("dictionary/get/a/2/")
        .then(response => {
            const dictsResponse = response.data['dicts'];
            const dicts = [];
            for (const dict of dictsResponse) 
                dicts.push(createDinctionaryFromResponse(dict));
            setDicts(dicts);
        }).catch(error => {
            console.log(`In dictList error -> ${error}`);
        });
    }, []);

    async function addNewDictionaty(name, lang, isDefault, dateCreated, wordsCount) {
        const newElem = {name: name, lang: lang, isDefault: isDefault, dateCreated: dateCreated, wordsCount: wordsCount};
        setDicts(arr =>  [...arr, newElem]);
    };

    async function updateDictionary(oldDict, name, isDefault) {
        if (oldDict.name === name && oldDict.isDefault === isDefault)
            return;

        api.post(`dictionary/update/${oldDict?.name || name}/`, {
            name: name,
            is_default: isDefault
        }).then(response => {
            const newDict = createDinctionaryFromResponse(response.data);
            setDicts(dicts => dicts.map(item => (item === oldDict) ? newDict : item));
        });
    };

    async function deleteDictionary(dict) {
        api.post(`dictionary/delete/${dict?.name}/`)
        .then(() => {
            setDicts(dicts => dicts.filter(item => item !== dict));
        });
    };

    return (
        <DictionaryContext.Provider value={ {dicts, addNewDictionaty, updateDictionary, deleteDictionary} }> 
            {children} 
        </DictionaryContext.Provider>
    );
}

export default DictionaryContext;