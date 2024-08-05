import useFlashCards from "../../../hooks/useFlashcards";
import googleLogo from '@logos/google-logo.png';
import { useNavigate } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";
import quitImg from '@logos/quit.svg';
import FlashCardSettings, {TimePriorities} from "./FlashCardSettings";

import "@styles/common.css";
import "@styles/dictionary/flashcards/cards.css";
import { createContext, useState } from "react";

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
        goToNextFlashCard,
        showNextFlashCard,
        showPrevFlashCard,
        getCurrentFlashcard
    } = useFlashCards();

    async function startFlashCards() {
        await init(lastWordsLimit, count, dict.name, priority);
    };

    function getFlashCard(entry) {
        return <div className="flash-card">
            
        </div>   
    }

    return (
        <FlashCardContext.Provider value={{
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
                    <ProgressBar  now={parseInt((index / flashCards.length) * 100)}/>
                </div>

                <div className="main-body">
                    {workState == WorkStates.LoadSettigs && 
                        <div className="flash-card">
                            <FlashCardSettings dict={dict}/>
                        </div>
                    }

                    {workState == WorkStates.FlashCards &&
                        <div className=""></div>
                    }
                </div>
            </div>
        </FlashCardContext.Provider>
    )
};

export default FlashCards;