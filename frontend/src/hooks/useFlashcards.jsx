import { useEffect, useState } from "react";
import { TimePriorities } from "../components/dictionary/flashcards/FlashCardSettings";
import { getEntryFromResponse } from "./useEntry";
import useApi from "./auth/useApi";

function useFlashCards() {
    const [flashCards, setFlashCards] = useState([]);
    const [index, setIndex] = useState(0);
    const [showingIndex, setShowingIndex] = useState(0);
    const {api} = useApi();

    async function init(lastWordsLimit, count, dictName, priority) {
        try {
            const response = await api.get(`flashcards/${dictName}/${count}/${lastWordsLimit}`);
            console.log(response);
            const entries = [];
            for (const entryData of response.data) {
                entries.push(getEntryFromResponse(entryData));
            }
            setFlashCards(entries);
        } catch (e) {
            console.log(e);
            return [];
        }
    };

    function goToNextFlashCard() {
        if (index + 1 >= flashCards.length)
            return null;
        setIndex(index+1);
        setShowingIndex(index+1);
        return flashCards[index+1];
    }

    function showNextFlashCard() {
        if (index + 1 >= flashCards.length)
            return null;
        setShowingIndex(index => index+1);
        return flashCards(showingIndex+1);
    }

    function showPrevFlashCard() {
        if (index - 1 < 0)
            return null;
        setShowingIndex(index => index-1);
        return flashCards(showingIndex-1);
    }

    function getCurrentFlashcard() {
        return flashCards[showingIndex];
    }

    return {
        index,
        showingIndex,
        flashCards,
        init,
        goToNextFlashCard,
        showNextFlashCard,
        showPrevFlashCard,
        getCurrentFlashcard
    }
};

export default useFlashCards;