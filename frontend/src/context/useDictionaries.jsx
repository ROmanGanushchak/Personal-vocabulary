import { createContext, useEffect, useState, useRef } from "react";
import useApi from "../hooks/auth/useApi";
import { createDictionaryFromResponse } from "../hooks/useDIctionary";

const DictionaryContext = createContext({});

export function DictionaryContextProvider( {children} ) {
    const [dicts, setDicts] = useState([useState({name: '', id: 'some'})]);
    const {api} = useApi();
    const wasLoaded= useRef(false);
    const isLoaded = useRef(false);
    const initAwaitFuncs = useRef([]);
    const sortingChoices = useRef({"Time": 1, "TimeReverse": 2, "LeastQuesed": 3, "LeastSpelled": 4});
    const sortingChoicesKeys = Object.keys(sortingChoices.current);

    async function init() {
        api.get("dictionary/get/a/2/")
        .then(response => {
            const dictsResponse = response.data['dicts'];
            const dicts = [];
            for (const dict of dictsResponse) 
                dicts.push(createDictionaryFromResponse(dict));
            setDicts(dicts);
            wasLoaded.current = true;
        }).catch(error => {
            console.log(`In useDictionaries error -> ${error}`);
        });
    };

    async function waitInit() {
        if (isLoaded.current)
            return;
        
        return new Promise(resolve => {
            initAwaitFuncs.current.push(() => resolve());
        });
    };

    useEffect(() => {
        if (!isLoaded.current)
            init();
    }, []);

    useEffect(() => {
        if (wasLoaded.current && !isLoaded.current) {
            isLoaded.current = true;
            for (const func of initAwaitFuncs.current) {
                func();
            }
            initAwaitFuncs.current = [];
        }
    }, [dicts]);

    async function addNewDictionary(dict) {
        setDicts(arr =>  [...arr, dict]);
    }

    async function addNewDictionaty(name, lang, isDefault, dateCreated, wordsCount) {
        const newElem = {name: name, lang: lang, isDefault: isDefault, dateCreated: dateCreated, wordsCount: wordsCount};
        setDicts(arr =>  [...arr, newElem]);
    };

    async function deleteDictionary(dict) {
        api.post(`dictionary/delete/${dict?.name}/`)
        .then(() => {
            setDicts(dicts => dicts.filter(item => item !== dict));
        });
    };

    async function getDictByName(dictName) {
        await waitInit();
        let dict = dicts.find(item => item.name === dictName);
        
        if (dict === undefined) {
            try {
                const response = await api.get(`dictionary/get/${dictName}/0/`);
                dict = createDictionaryFromResponse(response.data['dictionary']);
                addNewDictionary(dict);
            } catch (error) {
                return null;
            }
        }
        return dict;
    };

    async function changeSorting(dict, newSortingType) {
        if (dict.sort === newSortingType)
            return;
        
        await api.post(`dictionary/update/${dict.name}/`, {
            sort_type: newSortingType
        });

        dict.sort = newSortingType;
        setDicts(dicts => dicts.map(_dict => _dict));
    };

    async function updateDictionary(dict, _name, _isDefault) {
        if (dict.name === _name && dict.isDefault === _isDefault)
            return;

        api.post(`dictionary/update/${dict.name || _name}/`, {
            name: _name,
            is_default: _isDefault
        }).then(response => {
            const newDict = createDictionaryFromResponse(response);
            setDicts(dicts => dicts.map(_dict => _dict !== dict ? _dict : newDict));
        });
    };

    async function mergeDictionaries(sourceDict, dict, type) {
        const response = await api.post("dictionary/mergetdicts/", {
            source: sourceDict.name,
            to: dict.name,
            type: type
        });

        return response;
    };

    return (
        <DictionaryContext.Provider value={ {dicts, sortingChoices, sortingChoicesKeys, updateDictionary, changeSorting, addNewDictionaty, deleteDictionary, getDictByName, mergeDictionaries} }> 
            {children} 
        </DictionaryContext.Provider>
    );
}

export default DictionaryContext;