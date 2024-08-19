import useFlashCards from "../../../hooks/useFlashcards";
import { useNavigate } from "react-router-dom";
import { Button, ProgressBar } from "react-bootstrap";
import FlashCardSettings, {TimePriorities} from "./FlashCardSettings";
import FlashCard from "./FlashCard";
import { createContext, useState, useEffect } from "react";

import quitImg from '@logos/quit.svg';
import settingsIcom from "@logos/settings-icon.svg";

import "@styles/common.css";
import "@styles/dictionary/flashcards/card.css";
import "@styles/dictionary/flashcards/cards.css";

export const FlashCardContext = createContext({});

const WorkStates = {
    LoadSettigs: 1,
    FlashCards: 2,
};

function FlashCards( {dict} ) {
    const [priority, setPriority] = useState(TimePriorities.None);
    const [lastWordsLimit, setLastWordsLimit] = useState(undefined);
    const [count, setCount] = useState(10);
    const [timeLimit, setTimeLimit] = useState(30);
    const [saveScore, setSaveScore] = useState(true);

    const [workState, setWorkState] = useState(WorkStates.LoadSettigs);

    const navigate = useNavigate();
    const { 
        index,
        showingIndex,
        flashCards,
        init,
        start,
        showNextFlashCard,
        showPrevFlashCard,
        finish
    } = useFlashCards();

    useEffect(() => {
        const isLoaded = init();
        if (isLoaded) 
            setWorkState(WorkStates.FlashCards);
    }, []);

    async function startFlashCards() {
        try {
            await start(lastWordsLimit, count, dict.name, priority);
            setWorkState(WorkStates.FlashCards);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <FlashCardContext.Provider value={{
            dict, index, startFlashCards,
            priority, lastWordsLimit, count, timeLimit, saveScore,
            setPriority, setLastWordsLimit, setCount, setTimeLimit, setSaveScore
        }}>
            <div className="flash-card-main-conteier">
                <div className="upper-part-conteiner">
                    <div className="upper-part">
                        <div className="row-display" style={{gap: '20px'}}>
                            <img src={dict.logo} alt="dict logo" width="30px"/>
                            <p className="dict-name">{dict.name}</p>
                            <p className="dict-lang">{dict.lang}</p>
                        </div>

                        <button className="img-btn" onClick={() => {navigate(`/dictionaries/${dict.name}/`)}}>
                            <img src={quitImg} alt="Exit" width="25px"/>
                        </button>
                    </div>
                </div>

                <div className="progress-bar-conteiner">
                    <ProgressBar now={parseInt((index / flashCards.length)*100 * (workState === WorkStates.FlashCards))}/>
                </div>

                <div className="main-body">
                    <div>
                        {workState == WorkStates.LoadSettigs && 
                            <div className="flash-card">
                                <FlashCardSettings />
                            </div>
                        }

                        {workState == WorkStates.FlashCards && showingIndex !== flashCards.length &&
                            <FlashCard entry={flashCards[showingIndex]}/>
                        }

                        {workState == WorkStates.FlashCards && showingIndex === flashCards.length &&
                            <div className="flash-card-body flash-card flash-card-ending">
                                <h2>Congrats</h2>
                                <p>You gone trough all the flashcards</p>
                                <div>
                                    <button className="flash-pack-btn" onClick={() => startFlashCards()}>Start again</button>
                                    <button className="flash-pack-btn" onClick={() => setWorkState(WorkStates.LoadSettigs)}>Menu</button>
                                </div>
                            </div>
                        }

                        <div className="bottom-part-cards">
                            <div></div>
                            <div className={`row-display ${!(flashCards.length && workState == WorkStates.FlashCards) && "hide"}`} style={{width: "20%", gap: '20px'}}>
                                <button className="st-btn" onClick={() => showPrevFlashCard()}>Prev</button>
                                <p>{showingIndex+1}/{flashCards.length}</p>
                                <button className="st-btn" onClick={() => showNextFlashCard()}>Next</button>
                            </div>
                            <div>
                                {workState == WorkStates.FlashCards && 
                                <Button variant="danger" onClick={() => {
                                    finish();
                                    setWorkState(WorkStates.LoadSettigs);
                                }}>Finish</Button>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FlashCardContext.Provider>
    )
};

export default FlashCards;