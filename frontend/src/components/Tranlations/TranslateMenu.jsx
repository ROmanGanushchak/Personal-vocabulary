import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import TextInOutField from './TextInOutField'
import TranslatorSelector from "./TranslatorSelector";
import useApi from "../../hooks/auth/useApi";
import ChooseDictionariesModal from "../dictionary/ChooseDictionariesModal";
import useEntryFabric from "../../hooks/useEntryFabric";
import DictionaryContext from "../../context/useDictionaries";
import { scaleObgAnimation } from "./TextInOutField";

import bookSaveIcon from "@logos/book-saved.svg";
import swapIcon from "@logos/swap.svg";
import '@styles/translation/translate-menu.css';

export const TranslateMenuContext = createContext({})
export const undefinedLang = "Undefined";

function TranslateMenu() {
    const [input, _setInput] = useState('');
    const [output, _setOutput] = useState('');
    const [sourceLang, setSourceLang] = useState('Undefined');
    const [targetLang, setTargetLang] = useState('English');
    const [isLoading, setIsLoading] = useState(false);
    const [detectedLang, setDetectedLang] = useState(null);
    const [isChoosingDictActice, setIsChoosingDictActice] = useState(false);

    const isLoadingPrev = useRef(false);
    const translator = useRef(localStorage.getItem("translator") || 'google');
    const dictsToSave = useRef([]);
    const timer = useRef(null);
    const submitedInputText = useRef("");

    const swapBtn = useRef(null);

    const { addToDictionaryRow } = useEntryFabric();
    const { getDictByID } = useContext(DictionaryContext); 
    const { api } = useApi();

    useEffect(() => {
        async function init() {
            const dictsToSaveIds = JSON.parse(localStorage.getItem("dictsToSave"));
            const newDicts = [];
            if (dictsToSaveIds) {
                for (const id of dictsToSaveIds) {
                    const dict = await getDictByID(id);
                    if (dict) 
                        newDicts.push(dict);
                }
                
                dictsToSave.current = newDicts;
            } else dictsToSave.current = [];
        };
        init();
    }, []);

    useEffect(() => {
        if (isLoading === true && isLoadingPrev.current === false)
            _setOutput(output + '...');
        isLoadingPrev.current = isLoading;
    }, [isLoading]);

    async function makeTranslate() {
        if ((!submitedInputText.current && !input) || translator.current == null)
            return;

        if (!submitedInputText.current) 
            submitedInputText.current = input;
        
        if (!isLoading)
            setIsLoading(true);
        
        api.post("translate/", {
            'translator': translator.current, 
            'sourceLang': (sourceLang !== 'Undefined') ? sourceLang : "none", 
            'targetLang': targetLang, 
            'text': submitedInputText.current
        }).then(response => {
            setIsLoading(false);
            _setOutput(response.data['translated']);
            setDetectedLang(response.data['lang'] ? response.data['lang'] : null);
        }).catch(error => {
            console.log("In local catch");
            console.log(error);
        });
    };

    function swap() {
        console.log("In swap func");
        let oldSourceLang = sourceLang;
        if (oldSourceLang === 'Undefined') {
            if (detectedLang != null)
                oldSourceLang = detectedLang;
            else
                return;
        }
        setSourceLang(targetLang);
        setTargetLang(oldSourceLang);
        _setInput(output);
        if (translator.current == null)
            _setOutput(input);
        else 
            _setOutput("");
        scaleObgAnimation(swapBtn.current, 1, 1.1);
    };

    function updateTranslation() {
        _setOutput("");
        makeTranslate();
    };

    function save() {
        if (!input || !output)
            return;
        
        console.log(dictsToSave.current);
        for (const dict of dictsToSave.current) {
            if (dict.lang === sourceLang || dict.lang === detectedLang) {
                addToDictionaryRow(dict, input, [output], "");
            }
        }

        console.log(`save: ${input} -> ${output}`);
    };

    function setInput(text) {
        if (translator.current != null) {
            submitedInputText.current = text;
            if (timer.current !== null)
                clearTimeout(timer.current);
            if (text.length > 1) {
                timer.current = setTimeout(makeTranslate, 800);
                setIsLoading(true);
            }
            if (text.length == 0)
                _setOutput('');
            if (text.length <= 2) 
                setDetectedLang(null);
        }

        _setInput(text);
    };

    function setOutput(text) {
        
    };

    function changeTranslator(name) {
        translator.current = name;
        if (isLoading)
            setIsLoading(false);
        if (detectedLang)
            setDetectedLang(null);
        localStorage.setItem("translator", name);
        makeTranslate();
        console.log("After trans change the new value in local storage is: " + localStorage.getItem("translator"), "for called name: " + name);
    };

    useEffect(() => {
        makeTranslate();
    }, [sourceLang, targetLang]);

    return (
        <TranslateMenuContext.Provider value = {{ sourceLang, targetLang, translator, input, output, setInput, setOutput, _setOutput, setSourceLang, setTargetLang, makeTranslate, detectedLang, swap, updateTranslation, save }}>
            <div className="base-conteiner">
                <div className="extra-conteiner">
                    
                </div>
                <div className="row-b-d" style={{alignItems: "baseline"}}>
                    <div className="inputs-conteiner">
                        <TextInOutField type={true} text={input} setText={setInput} lang={sourceLang} changeLanguage={setSourceLang} langsVariants={[sourceLang]}/>
                        <TextInOutField type={false} text={output} setText={_setOutput} lang={targetLang} changeLanguage={setTargetLang}  langsVariants={[targetLang]}/>
                    </div>
                    <div className="extra-tools-bar">
                        <button className="img-btn" onClick={swap} ref={swapBtn}>
                            <img src={swapIcon} alt="swap" /></button>
                        <button className="img-btn" onClick={() => setIsChoosingDictActice(true)}>
                            <img src={bookSaveIcon} alt="save" width="35px"/></button>
                        <hr width="100%" style={{margin: "0 0", padding: "0 0"}}></hr>
                        <TranslatorSelector className="translator-seloctor"
                            changeTranslator={changeTranslator} sourceLanguage="en" defaultTranslator={translator}/>
                    </div>
                </div>

                <div className="list-to-add">
                    <p>add manual fields for extra translations</p>
                    <p>separete out field</p>
                    <p>saving prefered settings</p>
                </div>
            </div>

            <ChooseDictionariesModal
                    isActive={isChoosingDictActice}
                    lang={sourceLang}
                    _dicts={dictsToSave}
                    submitRezults={(newDicts) => {
                        dictsToSave.current = newDicts; 
                        setIsChoosingDictActice(false);
                        const dictIds = [];
                        for (const dict of newDicts)
                            dictIds.push(dict.id);
                        localStorage.setItem("dictsToSave", JSON.stringify(dictIds));
                    }}>    
            </ChooseDictionariesModal>
        </TranslateMenuContext.Provider>
    )
}

export default TranslateMenu;