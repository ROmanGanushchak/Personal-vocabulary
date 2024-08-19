import useApi from "./auth/useApi";
import { getEntryFromResponse } from "./useEntry";

function useEntryFabric() {
    const {api} = useApi();

    async function addToDictionaryRow(dictToAdd, word, translates, notes) {
        try {
            const response = await api.post(`dictionary/addword/${dictToAdd.name}/0/1/`, {
                word: word,
                translates: translates,
                note: notes
            });
            dictToAdd.wordsCount++;
            console.log("Response for adding word:");
            console.log(response);
            return getEntryFromResponse(response.data)
        } catch (e) {
            console.log(e);
            return null;
        }
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

    return {
        addToDictionaryRow,
        addToDictionary
    }
};

export const entryExample = {
    word: "word", 
    translates: ['translation', 'translation2'], 
    notes: "notes", 
    guesingScore: [0, 1], 
    addingTime: "10-07-2020", 
    id: 1
};

export default useEntryFabric;