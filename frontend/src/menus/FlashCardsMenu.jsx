import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import DictionaryContext from "../context/useDictionaries";
import FlashCards from "../components/dictionary/flashcards/FlashCards";

function FlashCardsMenu() {
    const {dictName} = useParams();
    const [dict, setDict] = useState(undefined);
    const {getDictByName} = useContext(DictionaryContext);

    useEffect(() => {
        async function init() {
            setDict(await getDictByName(dictName));
        };

        init();
    }, [dictName]);

    if (dict === undefined)
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    if (dict === null) 
        return <p>Dictionary with that name was not found</p>
    return (
        <div style={{width: '100vw', height: '100vh', display: "flex", justifyContent: 'center', alignItems: 'center'}}>
            <FlashCards dict={dict}/>
        </div>
    )
};

export default FlashCardsMenu;