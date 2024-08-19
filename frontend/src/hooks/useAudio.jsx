import { useState, useEffect, useRef } from "react";
import useApi from "./auth/useApi";


function useAudio() {
    const [audioElement, setAudioElement] = useState(null);
    const hashedAudio = useRef({});
    const {api} = useApi();

    async function getTextToSpeach(text, language) {
        const response = await api.post("translate/getaudio/", {
            text: text,
            lang: language
        }, {responseType: 'blob'});

        return response.data;
    };

    async function fetchAndPlayAudio(text, language) {
        if (!text)
            return;

        let audioData = null;
        if ([text, language] in hashedAudio.current) {
            audioData = hashedAudio.current[[text, language]];
        } else {
            try {
                audioData = await getTextToSpeach(text, language);
            } catch(error) {
                console.log("Error while requesting audio");
                console.log(error);
                return;
            }
            hashedAudio.current[[text, language]] = audioData;
        }
        
        const blob = new Blob([audioData], { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        
        const newAudio = new Audio(url);
        newAudio.play();
        
        if (audioElement) {
            audioElement.pause();
            audioElement.currentTime = 0;
        }
        
        setAudioElement(newAudio);
    };

    return fetchAndPlayAudio;
};

export default useAudio;