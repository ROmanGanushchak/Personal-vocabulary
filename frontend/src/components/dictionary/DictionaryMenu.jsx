import { createContext, useEffect, useRef, useState } from "react";
import useEntry from "../../hooks/useEntry";
import EntryField from "./EntryField";
import ChooseDictionaryModal from "./ChooseDictionaryModal";
import useAudio from "../../hooks/useAudio";

export const DictionaryMenuContext = createContext({});

function DictionaryMenu( {dict} ) {
    const enteriesHook = useEntry(dict);
    const [isBluer, setIsBleur] = useState(false);
    const {currentEntries} = enteriesHook;
    const [isChoosingDict, setIsChoosingDict] = useState(false);
    const chosenDictProvideFunc = useRef(null);
    const fetchAndPlayAudio = useAudio();

    function askToChooseDict(provideRezultFunc) {
        setIsChoosingDict(true);
        chosenDictProvideFunc.current = provideRezultFunc;
    };

    function returnDict(dict) {
        setIsChoosingDict(false);
        if (chosenDictProvideFunc.current) 
            chosenDictProvideFunc.current(dict);
    }

    return <DictionaryMenuContext.Provider value={{dict, enteriesHook, isBluer, askToChooseDict, fetchAndPlayAudio}}>
        {currentEntries.map((entry, index) => {
            return <EntryField entry={entry} key={index}></EntryField>
        })}
        <ChooseDictionaryModal isActive={isChoosingDict} submitRezults={returnDict} notInclude={dict}></ChooseDictionaryModal>
    </DictionaryMenuContext.Provider>
};

export default DictionaryMenu;