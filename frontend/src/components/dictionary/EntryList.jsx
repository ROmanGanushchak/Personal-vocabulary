import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import useEntry, {SearchTypes} from "../../hooks/useEntry";
import { entryExample } from "../../hooks/useEntryFabric";
import EntryField from "./EntryField";
import ChooseDictionaryModal from "./ChooseDictionaryModal";
import useAudio from "../../hooks/useAudio";
import { Button, Dropdown } from "react-bootstrap";
import googleLogo from '@logos/google-logo.png';
import searchImg from '@logos/search.svg'
import ChooseDictToMerge from "./ChooseDictToMerge";

import '@styles/dictionary/entry-list.css';
import '@styles/common.css';
import { useNavigate } from "react-router-dom";
import DictionaryContext from "../../context/useDictionaries";
import BtnDropdown from "../ButDropdown";

export const EntryListContext = createContext({});

function EntryList( {dict} ) {
    const {sortingChoices, changeSorting, sortingChoicesKeys} = useContext(DictionaryContext);
    const enteriesHook = useEntry(dict);
    const {
        currentEntries, currentIndex, 
        goToNextPage, wordsPerPage, 
        setWordsPerPage, setSort, 
        setSearch, wordsCount,
        setSearchType} = enteriesHook;
    const navigate = useNavigate();
    const [isBluer, setIsBleur] = useState(false);
    const [isChoosingDict, setIsChoosingDict] = useState(false);
    const chosenDictProvideFunc = useRef(null);
    const fetchAndPlayAudio = useAudio();
    const searchLoadTimer = useRef(null);

    const [mergeBtnIsActive, setMergeBtnIsActive] = useState(false);
    const mergeBtnRef = useRef(null);

    function askToChooseDict(provideRezultFunc) {
        setIsChoosingDict(true);
        chosenDictProvideFunc.current = provideRezultFunc;
    };

    function returnDict(dict) {
        setIsChoosingDict(false);
        if (chosenDictProvideFunc.current) 
            chosenDictProvideFunc.current(dict);
    };

    function askSearch(searched) {
        if (searchLoadTimer.current !== null)
            clearTimeout(searchLoadTimer.current);
        searchLoadTimer.current = setTimeout(setSearch, 400, searched);
    }

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
                                <button className="st-btn" ref={mergeBtnRef} onClick={() => setMergeBtnIsActive(value => !value)}>Merge</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="extra-options col-display-r">
                    <button onClick={() => navigate(`flashcards`)} 
                    className="flash-pack-btn" style={{width: '130px'}}>Flashcards</button>
                    <div className="row-display" style={{gap: '5px'}}>
                        <p className="word-per-page-header">Words count: </p>
                        <div className="words-per-page">
                            <button onClick={() => setWordsPerPage(wordsPerPage-1)} className='text-btn' >-</button>
                            <p>{wordsPerPage}</p>
                            <button onClick={() => setWordsPerPage(wordsPerPage+1)} className='text-btn'>+</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="entry-list-conteiner">
                <div className="small-settings">
                    <div className="search">
                        <BtnDropdown text={<img src={searchImg} alt="" className="search-icon"/>} className="img-btn" value="default">
                            <Dropdown.Item onClick={() => setSearchType(SearchTypes.word)}> 
                                Word
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSearchType(SearchTypes.translates)}> 
                                Translates
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSearchType(SearchTypes.notes)}> 
                                Notes
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => setSearchType(SearchTypes.time)}> 
                                AddingTime
                            </Dropdown.Item>
                        </BtnDropdown>
                        <input type="text" placeholder="Search" onChange={e => askSearch(e.target.value)}/>
                    </div>
                    <div className="extra-small-settings">
                        <button className={`st-btn ${isBluer && "marked"}`} onClick={() => setIsBleur(bluer => !bluer)}>Bluer</button>

                        <BtnDropdown text="Sort" className="st-btn">
                            {sortingChoicesKeys.map(name => {
                                const id = sortingChoices.current[name];
                                return (
                                    <Dropdown.Item 
                                        onClick={e => {setSort(id)}}
                                        value={id} 
                                        key={id} 
                                        className={`${id === dict.sort && "marked-sort-elem"}`}>
                                        {name}
                                    </Dropdown.Item>
                                );
                            })}
                        </BtnDropdown>
                    </div>
                </div>

                {currentEntries.map((entry, index) => {
                    return <EntryField entry={entry} key={index}></EntryField>
                })}

                <div className="entry-page-nav">
                    <Button variant="light" className={`${currentIndex===0 && "hide"}`} onClick={() => goToNextPage(-1)}>Prev</Button>
                    <div className="current-entries-indexs">
                        <p>Showing {currentIndex}-{Math.min(currentIndex+currentEntries.length, dict.wordsCount)} of {wordsCount} entries</p>
                    </div>
                    <Button variant="light" className={`${currentIndex+wordsPerPage >= dict.wordsCount && "hide"}`} onClick={() => goToNextPage(1)}>Next</Button>
                </div>

                <div className="hide"> {/* to make minimum width, if posible remove */}
                    <EntryField entry={entryExample} />
                </div>
            </div>
        </div>
        <ChooseDictionaryModal isActive={isChoosingDict} submitRezults={returnDict} notInclude={dict}></ChooseDictionaryModal>
        <ChooseDictToMerge isActive={mergeBtnIsActive}
                                    setIsActive={setMergeBtnIsActive}
                                    target={mergeBtnRef} />
    </EntryListContext.Provider>
};

export default EntryList;