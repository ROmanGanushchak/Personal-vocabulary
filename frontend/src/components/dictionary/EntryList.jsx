import { createContext, useEffect, useRef, useState } from "react";
import useEntry from "../../hooks/useEntry";
import EntryField from "./EntryField";
import ChooseDictionaryModal from "./ChooseDictionaryModal";
import useAudio from "../../hooks/useAudio";
import { Button } from "react-bootstrap";
import googleLogo from '@logos/google-logo.png';
import searchImg from '@logos/search.svg'

import '@styles/dictionary/entry-list.css';
import '@styles/common.css';
import { useNavigate } from "react-router-dom";

export const EntryListContext = createContext({});

function EntryList( {dict} ) {
    const enteriesHook = useEntry(dict);
    const navigate = useNavigate();
    const [isBluer, setIsBleur] = useState(false);
    const {currentEntries, currentIndex, goToNextPage, wordsPerPage} = enteriesHook;
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
    };

    function searchTextChange(text) {

    };

    return <EntryListContext.Provider value={{dict, enteriesHook, isBluer, askToChooseDict, fetchAndPlayAudio}}>
        <div className="entry-list-main-conteiner">
            <div className="row-display">
                <div className="col-display">
                    <button onClick={() => navigate('/dictionaries')} className="go-back-btn"> {"<"} All lists</button>
                    <div className="row-display">
                        <img src={googleLogo} alt="logo" />
                        <div className="col-display" style={{paddingLeft: '10px'}}>
                            <p className="list-dict-name">{dict.name}</p>
                            <div className="dict-info-conteiner">
                                <p className="dict-info-text">{dict.wordsCount} entries</p>
                                <p className="dict-info-text">{dict.lang}</p>
                                <button className="st-btn">Merge</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="extra-options col-display">
                    <button onClick={() => navigate(`flashpacks`)} 
                    className="flash-pack-btn" style={{width: '130px'}}>Flashpacks</button>
                    <div className="words-per-page">
                        <p>Words count: {wordsPerPage}</p>
                        <div className="col-liniar">
                            <button className='text-btn'>+</button>
                            <button className='text-btn'>-</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="entry-list-conteiner">
                <div className="small-settings">
                    <div className="search">
                        <img src={searchImg} alt="" onChange={e => searchTextChange(e.target.value)}/>
                        <input type="text" placeholder="Search"/>
                    </div>
                    <div className="extra-small-settings">
                        <button className={`st-btn ${isBluer && "marked"}`} onClick={() => setIsBleur(bluer => !bluer)}>Bluer</button>
                        <button className="st-btn">Sort</button>
                        <button className="st-btn">Filter</button>
                    </div>
                </div>

                {currentEntries.map((entry, index) => {
                    return <EntryField entry={entry} key={index}></EntryField>
                })}

                <div className="entry-page-nav">
                    <Button variant={`light ${currentIndex===0 && "hide"}`} onClick={() => goToNextPage(-1)}>Prev</Button>
                    <div className="current-entries-indexs">
                        <p>Showing {currentIndex}-{currentIndex+currentEntries.length} of {dict.wordsCount} entries</p>
                    </div>
                    <Button variant={`light ${currentIndex+wordsPerPage >= dict.wordsCount && "hide"}`} onClick={() => goToNextPage(1)}>Next</Button>
                </div>
            </div>
        </div>
        <ChooseDictionaryModal isActive={isChoosingDict} submitRezults={returnDict} notInclude={dict}></ChooseDictionaryModal>
    </EntryListContext.Provider>
};

export default EntryList;