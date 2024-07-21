import React, { createContext, useEffect, useRef, useState } from "react";
import TextInOutField from './TextInOutField'
import TranslatorSelector from "./TranslatorSelector";
import '@styles/translation/translate-menu.css'
import useApi from "../../hooks/auth/useApi";
import ToolBar from "./ToolsBar";

export const TranslateMenuContext = createContext({})
export const undefinedLang = "Undefined";

function TranslateMenu() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [sourceLang, setSourceLang] = useState('Undefined');
    const [targetLang, setTargetLang] = useState('English');
    const [isLoading, setIsLoading] = useState(false);
    const [detectedLang, setDetectedLang] = useState(null);

    const isLoadingPrev = useRef(false);
    const translator = useRef('google');
    const { api } = useApi();

    const timer = useRef(null);
    let submitedInputText = "";

    useEffect(() => {
        if (isLoading === true && isLoadingPrev.current === false)
            setOutput(output + '...');
        isLoadingPrev.current = isLoading;
    }, [isLoading])

    const makeTranslate = async () => {
        if (!submitedInputText && !input)
            return;

        if (!submitedInputText) 
            submitedInputText = input;
        
        if (!isLoading)
            setIsLoading(true);
        
        api.post("translate/", {
            'translator': translator.current, 
            'sourceLang': (sourceLang !== 'Undefined') ? sourceLang : "none", 
            'targetLang': targetLang, 
            'text': submitedInputText
        }).then(response => {
            setIsLoading(false);
            setOutput(response.data['translated']);
            setDetectedLang(response.data['lang'] ? response.data['lang'] : null);
        }).catch(error => {
            console.log("In local catch");
            console.log(error);
        });
    };

    function setInputText(text) {
        setIsLoading(true);
        submitedInputText = text;
        if (timer.current !== null)
            clearTimeout(timer.current);
        if (text.length > 1)
            timer.current = setTimeout(makeTranslate, 800);
        if (text.length == 0)
            setOutput('');

        setInput(text);
        if (text.length <= 2) 
            setDetectedLang(null);
    };

    function changeTranslator(name) {
        translator.current = name;
        makeTranslate();
    };

    useEffect(() => {
        makeTranslate();
    }, [sourceLang, targetLang]);

    return (
        <TranslateMenuContext.Provider value = {{ sourceLang, targetLang, translator, input, output, setInput, setOutput, setSourceLang, setTargetLang, makeTranslate, detectedLang }}>
            <div className="base-conteiner">
                <div className="extra-conteiner">
                    <ToolBar></ToolBar>
                    <TranslatorSelector changeTranslator={changeTranslator} sourceLanguage="en"/>
                </div>
                <div className="inputs-conteiner">
                    <TextInOutField type={true} text={input} setText={setInputText} lang={sourceLang} changeLanguage={setSourceLang} langsVariants={[sourceLang]}/>
                    <TextInOutField type={false} text={output} setText={setOutput} lang={targetLang} changeLanguage={setTargetLang}  langsVariants={[targetLang]}/>
                </div>

                <div className="list-to-add">
                    <p> Make normal lists of langs </p>
                    <p> Add google text to speech </p>

                    <p> Add nav bar for dicts </p>
                    <p> Saving words to dicts </p>
                    <p> Dict view </p>
                    <p> Blure translations if not pointed </p>
                    <p> Add all words from one list to the other </p>
                    
                    
                    <p style={{fontWeight: 'bold'}}> Uneccerly: </p>
                    <p> Api to check spell correctness </p>
                </div>
            </div>
        </TranslateMenuContext.Provider>
    )
}

export default TranslateMenu;