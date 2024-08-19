import React, { useContext, useEffect, useState } from "react";
import { TranslateMenuContext } from "./TranslateMenu";
import { googleLangs, deeplSourceLangs, deeplTargetLangs, azureSourceLangs, azureTargetLangs, noneTranslator } from '@hooks/supportedLangs.js';

import googleLogo from '@logos/google-logo.png';
import deeplLogo from '@logos/deepl-logo.svg';
import azureLogo from '@logos/azure-logo.png';
import noneLogo from "@logos/cancel.png";

import '@styles/translation/translator-selector.css';

const translatorVariants = [
    {logo: googleLogo,  name: "google", sourceLangs: googleLangs,       targetLangs: googleLangs}, 
    {logo: deeplLogo,   name: "deepl",  sourceLangs: deeplSourceLangs,  targetLangs: deeplTargetLangs},
    {logo: azureLogo,   name: 'bing',   sourceLangs: azureSourceLangs,  targetLangs: azureTargetLangs},
    {logo: noneLogo,    name: null,     sourceLangs: noneTranslator,    targetLangs: noneTranslator}
]

function TranslatorSelector( {changeTranslator, defaultTranslator, className} ) {
    const {sourceLang, targetLang} = useContext(TranslateMenuContext);
    const [translators, setTranslators] = useState([]);
    const [currentTranslatorIndex, setCurrentTranslatorIndex] = useState(() => getTranslatorIdByName(defaultTranslator.current));

    function getTranslatorIdByName(name) {
        let rezult = 0;
        for (let i=0; i<translatorVariants.length; i++) {
            if (translatorVariants[i].name === name) {
                rezult = i;
                break;
            }
        }
        return rezult;
    };
    
    useEffect(() => {
        const translatorName = (currentTranslatorIndex !== -1 && translators.length > currentTranslatorIndex) ?
                                 translators[currentTranslatorIndex].name : "none";
        let newIndex = currentTranslatorIndex;
        const possibleTranslators = [];
        for (const translator of translatorVariants) {
            if (translator.sourceLangs.has(sourceLang) && translator.targetLangs.has(targetLang)) {
                if (translator.name == translatorName && setCurrentTranslatorIndex)
                    newIndex = possibleTranslators.length;
                possibleTranslators.push(translator);
            }
        }

        if (possibleTranslators.length == 0)
            newIndex = -1;
        if (setCurrentTranslatorIndex) 
            setCurrentTranslatorIndex(newIndex);
        setTranslators(possibleTranslators);
    }, [sourceLang, targetLang]);

    function changeTranslatorInternally(index) {
        setCurrentTranslatorIndex(index);
        changeTranslator(translatorVariants[index].name);
    };

    return (
        <div className={`translator-variants-bar ${className}`}>
            {translators.map((translator, index) => {
                return (<button className="img-btn" key={index}>
                    <img className={`logo ${index === currentTranslatorIndex && "active-translator"}`} 
                    src={translator.logo} name={index} style={{width: "35px", height: "35px"}}
                    alt={translator.name} onClick={() => changeTranslatorInternally(index)}/>
                </button> )
                })
            }
        </div>
    )
}

export default TranslatorSelector;