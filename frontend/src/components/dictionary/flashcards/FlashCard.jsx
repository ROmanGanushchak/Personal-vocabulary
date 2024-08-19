import { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "./FlashCards";

import "@styles/common.css";
import '@styles/dictionary/flashcards/cards.css';
import '@styles/dictionary/flashcards/card.css';
import useAudio from "../../../hooks/useAudio";
import soundIcon from '@logos/sound-icon.svg';

function FlashCard( { entry} ) {
    const {dict} = useContext(FlashCardContext);
    const [isRevealed, setIsRevealed] = useState(false);
    const fetchAndPlayAudio = useAudio();

    useEffect(() => {
        setIsRevealed(false);
    }, [entry]);

    return <div className="flash-card flash-card-body">
        <div className="flash-conteiner">
            <div className="word-conteiner">
                <button className="img-btn" onClick={() => fetchAndPlayAudio(entry.word, dict.lang)}>
                    <img src={soundIcon} alt="audio" width="30px"/></button>
                <p>{entry.word}</p>
            </div>

            <div onClick={() => setIsRevealed(true)}>
                <div className={`main-info ${!isRevealed && "hide"}`}>
                    <hr className="solid"/>
                    <p>Translates:</p>
                    {entry.translates.map((translate, index) => {
                        if (translate)
                            return <div key={index}>
                                <p className="translate">- {translate}</p>
                            </div>
                    })}

                    {entry.notes && <div >
                        <p>Note:</p> <p className="notes-text">- {entry.notes}</p>
                    </div>}
                        
                    <p>Quased score: {entry.guesingScore[0]}/{entry.guesingScore[1]}</p>
                </div>
            </div>
        </div>

        <div className={`card-bottom-text ${isRevealed && "nd"}`}>
            <p> To see translate press space button. </p>
        </div>
    </div>
};

export default FlashCard;