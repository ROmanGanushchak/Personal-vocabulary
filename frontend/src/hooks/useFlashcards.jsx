import { useEffect, useState, useRef } from "react";
import { TimePriorities } from "../components/dictionary/flashcards/FlashCardSettings";
import { getEntryFromResponse } from "./useEntry";
import useApi from "./auth/useApi";

export function shuffle(array) { 
    for (let i = array.length - 1; i > 0; i--) { 
        const j = Math.floor(Math.random() * (i + 1)); 
        [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
};

function useFlashCards() {
    const [flashCards, setFlashCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [showingIndex, setShowingIndex] = useState(0);
    const {api} = useApi();

    function init() {
        const _flashCardsData = localStorage.getItem("flashcards");
        const _flashCards = JSON.parse(_flashCardsData);
        if (_flashCards !== null) {
            setFlashCards(_flashCards);
            const index = parseInt(localStorage.getItem("flashcards/index"));
            setIndex(index);
            setShowingIndex(index);
            return true;
        }
        return false;
    };

    async function start(lastWordsLimit, count, dictName, priority) {
        try {
            const response = await api.get(`flashcards/${dictName}/${parseInt(count)}/${lastWordsLimit || 0}/`);
            const entries = [];
            for (const entryData of response.data) {
                entries.push(getEntryFromResponse(entryData));
            }
            const shuffledEntries = shuffle(entries);
            setFlashCards(shuffledEntries);
            setIndex(0);
            setShowingIndex(0);
            localStorage.setItem('flashcards', JSON.stringify(shuffledEntries));
            localStorage.setItem('flashcards/index', 0);
        } catch (e) {
            console.log(e);
            return [];
        }
    };

    function finish() {
        setIndex(flashCards.length);
        localStorage.setItem('flashcards', null);
        localStorage.setItem('flashcards/index', -1);
    };

    function goToNextFlashCard() {
        if (index + 1 >= flashCards.length) {
            return finish();
        }
        setIndex(index+1);
        setShowingIndex(index+1);
        localStorage.setItem('flashcards/index', index+1);
        return flashCards[index+1];
    };

    function showNextFlashCard() {
        if (showingIndex+1 > index)
            return goToNextFlashCard();
        setShowingIndex(index => index+1);
        if (showingIndex+1 !== flashCards.length)
            return flashCards[showingIndex+1];
        return null;
    };

    function showPrevFlashCard() {
        if (showingIndex-1 < 0)
            return null;
        setShowingIndex(index => index-1);
        return flashCards[showingIndex-1];
    };

    function getCurrentFlashcard() {
        return flashCards[showingIndex];
    };

    return {
        index,
        showingIndex,
        flashCards,
        init,
        start,
        finish,
        goToNextFlashCard,
        showNextFlashCard,
        showPrevFlashCard,
        getCurrentFlashcard
    };
};

export default useFlashCards;