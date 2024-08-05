import { useState, useRef } from "react";
import useApi from "./auth/useApi";
import googleLogo from '@logos/google-logo.png';

function useDictionary(dict) {
    const [lang, setLang] = useState(dict.lang);
    const [name, setName] = useState(dict.name);
    const [isDefault, setIsDefault] = useState(dict.isDefault);
    const [wordsCount, setWordsCount] = useState(dict.wordsCount);
    const [wordsPerPage, setWordsPerPage] = useState(dict.wordsPerPage);
    const [sort, setSort] = useState(dict.sort);

    const dateCreated = useRef(dict.dateCreated);
    const {api} = useApi();

    async function changeSorting(newSortingType) {
        if (sort === newSortingType)
            return;
        
        await api.post(`dictionary/update/${name}/`, {
            sort_type: newSortingType
        });
        setSort(newSortingType);
    };

    async function update(_name, _isDefault) {
        if (name === _name && isDefault === _isDefault)
            return;

        api.post(`dictionary/update/${name || _name}/`, {
            name: _name,
            is_default: _isDefault
        }).then(response => {
            setName(_name);
            setIsDefault(_isDefault);
        });
    };

    return {
        lang, name, isDefault, wordsCount, wordsPerPage, dateCreated, sort, 
        setLang, setIsDefault, setName, setWordsCount, setWordsPerPage, setSort, 
        changeSorting, update
    }
};

export function createDictionaryFromResponse(data) {
    try {
        return {
            lang: data['language'], 
            dateCreated: data['date_created'], 
            name: data['name'], 
            isDefault: data['is_default'],
            wordsCount: data['words_count'],
            wordsPerPage:  data['words_per_page'],
            sort: data['sort_type'],
            logo: googleLogo,
        }
    } catch(error) {
        throw new Error(`Not all data were provoided to form dictionary\n${error}`);
    }
};

export default useDictionary;