import React, { useContext, useEffect, useState } from "react";
import '@styles/translation/translator-selector.css';
import { TranslateMenuContext } from "./TranslateMenu";
import googleLogo from '@logos/google-logo.png';
import deeplLogo from '@logos/deepl-logo.svg';
import azureLogo from '@logos/azure-logo.png';
import { googleLangs, deeplSourceLangs, deeplTargetLangs, azureSourceLangs, azureTargetLangs } from '@hooks/supportedLangs.js';

const translatorVariants = [
    {logo: googleLogo, name: "google",  sourceLangs: googleLangs,        targetLangs: googleLangs}, 
    {logo: deeplLogo,  name: "deepl",   sourceLangs: deeplSourceLangs,   targetLangs: deeplTargetLangs},
    {logo: azureLogo,  name: 'bing',   sourceLangs: azureSourceLangs,   targetLangs: azureTargetLangs}
]

function TranslatorSelector( {changeTranslator} ) {
    const {sourceLang, targetLang} = useContext(TranslateMenuContext);

    const [translators, setTranslators] = useState([]);
    const [currentTranslatorIndex, setCurrentTranslatorIndex] = useState(0);
    
    useEffect(() => {
        const translatorName = (currentTranslatorIndex !== -1 && translators.length > currentTranslatorIndex) ?
                                 translators[currentTranslatorIndex].name : "none";
        let newIndex = 0;
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

    function changeTranslatorInternally(e) {
        setCurrentTranslatorIndex(parseInt(e.target.name));
        changeTranslator(e.target.alt)
    }

    return (
        <div className="translator-variants-bar">
            {translators.map((translator, index) => {
                return (<img className={`logo ${index === currentTranslatorIndex && "active-translator"}`} src={translator.logo} name={index} alt={translator.name} key={index} onClick={changeTranslatorInternally}/>)
            })}
        </div>
    )
}

export default TranslatorSelector;