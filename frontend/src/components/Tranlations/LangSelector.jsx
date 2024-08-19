import React, { useEffect, useState, useContext, useRef } from "react";
import { undefinedLang } from "./TranslateMenu";
import BtnDropdown from "../ButDropdown";
import { Dropdown } from "react-bootstrap";
import { TranslateMenuContext } from "./TranslateMenu";

import downArrowIcon from "@logos/down-arrow.svg";
import "@styles/translation/lang-selector.css";

const maxLanguagesChached = 3;
export const langs = [{name: 'English'}, {name: 'French'}, {name: 'Slovak'}, {name: 'Ukrainian'}, {name: 'German'}]

function LangSelector( {type, lang, changeLanguage, langsVariants=["English"], className=""} ) {
    const { detectedLang } = useContext(TranslateMenuContext);
    const [languagesVariants, setLanguagesVariants] = useState(langsVariants);
    const [activeLanguageIndex, setActivaLanguageIndex] = useState(0);
    const [lastAddedLangIndex, setLastAddedLangIndex] = useState(0);
    const langVariantsSlotes = useRef(maxLanguagesChached);

    useEffect(() => {
        const variantsData = localStorage.getItem(`langsVarians/${type ? "input" : "output"}`);
        if (variantsData !== null) {
            const variants = JSON.parse(variantsData);
            let arr = Array.from(variants[0]);
            if (arr.length > langVariantsSlotes.current) {
                arr = arr.slice(0, langVariantsSlotes.current);
            }

            setActivaLanguageIndex(parseInt(variants[1]));
            setLanguagesVariants(arr);
            changeLanguage(arr[parseInt(variants[1])]);
        }
    }, []);

    function updateLangView(language) { // is wierd remake
        let indexToReplace = lastAddedLangIndex;
        if (indexToReplace === 0 && langVariantsSlotes.current > 1 && languagesVariants[0] === undefinedLang) {
            indexToReplace = 1;
        }

        if (language === undefinedLang && type === true && langVariantsSlotes.current > 1) {
            const replacement = languagesVariants[0];
            languagesVariants[0] = undefinedLang;
            language = replacement;
        }

        const indexInArray = languagesVariants.indexOf(language);
        let nextActiveIndex = -1;
        if (indexInArray !== -1) {
            nextActiveIndex = indexInArray;
        } else if (languagesVariants.length === langVariantsSlotes.current) {
            setLastAddedLangIndex((indexToReplace + 1) % langVariantsSlotes.current);
            languagesVariants[indexToReplace] = language;
            nextActiveIndex = indexToReplace;
        } else {
            setLastAddedLangIndex(languagesVariants.length);
            languagesVariants.push(language);
            nextActiveIndex = languagesVariants.length-1;
        }

        setActivaLanguageIndex(nextActiveIndex);
        localStorage.setItem(`langsVarians/${type ? "input" : "output"}`, JSON.stringify([languagesVariants, nextActiveIndex]));
    };

    function chooseNewLanguage(language) {
        changeLanguage(language);
        updateLangView(language);
    };

    useEffect(() => {
        if (lang != languagesVariants[activeLanguageIndex]) 
            updateLangView(lang);
    }, [lang]);

    return <div className={`language-field ${className}`}> 
        <div className="languages">
            {languagesVariants.map((item, index) => {
                return (<button className={`language-variants ${activeLanguageIndex === index && "active"}`} 
                        onClick={e => chooseNewLanguage(e.target.textContent)} key={index}>
                    {(item != undefinedLang || !detectedLang) ? item : 
                        <div className="in-line">{detectedLang} <span style={{fontSize: '12px'}}>(detected)</span></div>}
                </button>)
            })}
        </div>
        <BtnDropdown className="img-btn" text={<img src={downArrowIcon} alt="langs" width="20px"/>}>
            {langs.map((lang, index) => {
                return <Dropdown.Item onClick={e => chooseNewLanguage(e.target.text)} key={index}>{lang.name}</Dropdown.Item>
            })}
        </BtnDropdown>
    </div>
};

export default LangSelector;