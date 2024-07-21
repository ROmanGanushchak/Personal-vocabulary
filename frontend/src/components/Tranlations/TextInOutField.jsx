import React, { useEffect, useState, useRef, useContext } from "react";
import '@styles/translation/text-inout-field.css'
import LangSelector from "./LangSelector";
import { TranslateMenuContext, undefinedLang } from "./TranslateMenu";

const fontSizeByLength = [[30, "45px"], [100, "35px"], [200, "30px"], [300, "25px"]]
const maxLanguagesChached = 3;

function TextInOutField( {type, text, setText, lang, changeLanguage, langsVariants=["English"]} ) { //type:  true - in, false - out 
    const { detectedLang } = useContext(TranslateMenuContext);
    const [minTextAreaHeight] = useState(250);
    const [languagesVariants, setLanguagesVariants] = useState(langsVariants);
    const [activeLanguageIndex, setActivaLanguageIndex] = useState(0);
    const [lastAddedLangIndex, setLastAddedLangIndex] = useState(0);
    const rextAreaRef = useRef(null);

    function updateLangView(language) {
        const indexInArray = languagesVariants.indexOf(language);
        if (indexInArray !== -1) {
            setActivaLanguageIndex(indexInArray);
        } else if (languagesVariants.length === maxLanguagesChached) {
            setLastAddedLangIndex((lastAddedLangIndex + 1) % maxLanguagesChached);
            languagesVariants[lastAddedLangIndex] = language;
            setActivaLanguageIndex(lastAddedLangIndex);
        } else {
            setLastAddedLangIndex(languagesVariants.length);
            languagesVariants.push(language);
            setActivaLanguageIndex(languagesVariants.length-1);
        }
    }

    const chooseNewLanguage = (language) => {
        changeLanguage(language);
        updateLangView(language);
    };

    useEffect(() => {
        if (lang != languagesVariants[activeLanguageIndex]) 
            updateLangView(lang);
    }, [lang]);

    useEffect(() => {
        const length = text.length;

        if (length <= fontSizeByLength[fontSizeByLength.length-1][0]) {
            for (const pair of fontSizeByLength) {
                if (length <= pair[0]) {
                    if (rextAreaRef.current.style.fontSize !== pair[1]) 
                        rextAreaRef.current.style.fontSize = pair[1];
                    break;
                }
            }
        } 
        
        rextAreaRef.current.style.height = 'auto';
        const newHeight = Math.max(rextAreaRef.current.scrollHeight, minTextAreaHeight) + 'px';
        rextAreaRef.current.style.height = newHeight;
        rextAreaRef.current.offsetHeight;

        if (rextAreaRef.current.scrollHeight < rextAreaRef.current.clientHeight) 
            rextAreaRef.current.style.height = rextAreaRef.current.scrollHeight + 'px';
    }, [text])
    
    return (
        <div className="">
            <div className="text-inout-conteiner">
                <div className="language-field"> 
                    <div className="languages">
                        {languagesVariants.map((item, index) => {
                            return (<button className={`language-variants ${activeLanguageIndex === index && "active"}`} 
                                    onClick={e => chooseNewLanguage(e.target.textContent)} key={index}>
                                {(activeLanguageIndex === index && item === undefinedLang && detectedLang) ? 
                                    <div className="in-line">{detectedLang} <span style={{fontSize: '12px'}}>(detected)</span></div> 
                                    : item
                                }
                            </button>)
                        })}
                    </div>
                    <LangSelector onLangChosen={chooseNewLanguage}/>
                </div>
                <textarea ref={rextAreaRef} name="" autoFocus={type} onChange={e => setText(e.target.value)} value={text} style={{height: `${minTextAreaHeight}px`}}></textarea>
                <div className="extra-tool-bar">

                </div>
            </div>
        </div>
    )
}

export default TextInOutField;