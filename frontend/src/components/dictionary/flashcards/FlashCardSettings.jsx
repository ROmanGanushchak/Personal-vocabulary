import { useContext, useState } from "react";
import googleLogo from '@logos/google-logo.png';
import settingsIcon from '@logos/settings-icon.svg';
import quitIcon from "@logos/quit.svg";
import NumberInputField from "../../NumberInputField";
import { FlashCardContext } from "./FlashCards";
import { Button, CloseButton, ListGroup } from "react-bootstrap";

import "@styles/common.css";
import "@styles/dictionary/flashcards/settings.css";

export const TimePriorities = {
    Recent: 1,
    Older: 2,
    None: 3
};

function FlashCardSettings() {
    const {priority, lastWordsLimit, count, timeLimit, saveScore, startFlashCards,
        setPriority, setLastWordsLimit, setCount, setTimeLimit, setSaveScore
    } = useContext(FlashCardContext);

    const [showSettings, setShowSettings] = useState(true);

    function tryToStart() {
        if (wordsCount === 0)
            console.log(`Uncorrect words count`);
        else 
            pass
    }

    return <div className={`flashcards-settings-conteiner ${showSettings && 'no-padding-small'}`}>
        <div className={`base-info-conteiner ${showSettings && "hide-small-screen"}`} style={{width: '100%'}}>
            <div>
                <h2>Flashcards</h2>
            </div>

            <div className="full-width" style={{width: '80%'}}>
                <p> &emsp;In flashcards you are able to practice and check how
                    efficiently u learnt the words that u saved for yourself. 
                    Flashcards will be chosen form current vocabularry and will be 
                    priorotized based on the critirias in the settings such as 
                    recently added, least queased... First u will see the word and 
                    u need to figure out the translation then press tab to check 
                    wheter or not it was correct. After that press green or red 
                    button based on the result so next time system will suggest 
                    harder words. 
                </p>
            </div>

            <div className="down-part">
                <Button style={{width: '100px'}} onClick={() => startFlashCards()}>Start</Button>
                <button className="img-btn show-on-small" onClick={() => {setShowSettings(true)}}>
                    <img src={settingsIcon} alt="settings" width="30px" />
                </button>
            </div>
        </div>

        
        <div className={`settings ${!showSettings && "hide-small-screen"}`}>
            <div className="upper-settings">
                <CloseButton className="show-on-small settings-exit-btn" 
                    onClick={() => {setShowSettings(false)}}/>
                <h2>Settings</h2>
                <Button className="settings-save-btn">Save</Button>
            </div>

            <div className="main-settings">
                <div>
                    <p>The count of cards:</p>
                    <NumberInputField value={count} setValue={setCount} 
                            name="" height="25px" />
                </div>

                <div>
                    <p>Time limit for each card(in seconds):</p>
                    <NumberInputField value={timeLimit} setValue={setTimeLimit} 
                            name="" height="25px" />
                </div>
                
                <div>
                    <p> Max old words that will be added /
                        last index of the word that might be added:</p>
                    <NumberInputField value={lastWordsLimit} setValue={setLastWordsLimit} 
                        name="" height="25px" />
                </div>

                <div>
                    <p>Save the score to improve father cards suggetions:</p>
                    <button className={`st-btn ${saveScore && 'marked'}`} 
                                onClick={() => setSaveScore(v => !v)}>Save score</button>
                </div>
                    
                <ListGroup as="ul" style={{maxWidth: '450px'}}>
                    <ListGroup.Item as="li" variant="dark">Chose priority by adding time:</ListGroup.Item>
                    <ListGroup.Item as="li" 
                        variant={priority === TimePriorities.Recent ? "primary" : "light"}
                        onClick={() => setPriority(TimePriorities.Recent)}
                        style={{cursor: "pointer"}}>
                        Show more recent</ListGroup.Item>
                    <ListGroup.Item as="li" 
                        variant={priority === TimePriorities.None ? "primary" : "light"} 
                        onClick={() => setPriority(TimePriorities.None)}
                        style={{cursor: "pointer"}}>
                        No adding time difference</ListGroup.Item>
                    <ListGroup.Item as="li" 
                        variant={priority === TimePriorities.Older ? "primary" : "light"} 
                        onClick={() => setPriority(TimePriorities.Older)}
                        style={{cursor: "pointer"}}>
                        Show more older</ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    </div>
};

export default FlashCardSettings;