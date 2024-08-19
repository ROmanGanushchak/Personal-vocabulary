import React, { useEffect, useState, useRef, useContext } from "react";
import { TranslateMenuContext, undefinedLang } from "./TranslateMenu";
import useAudio from "../../hooks/useAudio";
import LangSelector from "./LangSelector";

import soundIcom from "@logos/sound-icon.svg";
import updateIcon from '@logos/update-icon.svg';
import clearIcon from "@logos/clear-icon.svg";
import saveIcon from '@logos/save-icon.svg';
import '@styles/translation/text-inout-field.css'

const fontSizeByLength = [[30, "45px"], [100, "35px"], [200, "30px"], [300, "25px"]]

export function scaleObgAnimation(btn, time, scale=null) {
    if (scale != null)
        btn.style.setProperty('--scale-to', scale);    
    // console.log("Activate animation");
    console.log(btn);
    btn.style.animation = `buttonGrow ${time}s forwards`;
    setTimeout(() => {
        btn.style.animation = "";
    }, time * 1000);
}

export function scaleBtnAnimation(e, time) {
    return scaleObgAnimation(e.currentTarget, time);
}

function TextInOutField( {type, text, setText, lang, changeLanguage, langsVariants=["English"]} ) { //type:  true - in, false - out 
    const { detectedLang, updateTranslation, save } = useContext(TranslateMenuContext);
    const [minTextAreaHeight] = useState(400);
    const fetchAndPlayAudio = useAudio();
    const rextAreaRef = useRef(null);

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
        <div>
            <div className="text-inout-conteiner">
                <LangSelector type={type} lang={lang} changeLanguage={changeLanguage} langsVariants={langsVariants}/>
                <textarea ref={rextAreaRef} name="" autoFocus={type} onChange={e => setText(e.target.value)} value={text} style={{height: `${minTextAreaHeight}px`}}></textarea>
                <div className="extra-tool-bar row-display">
                    <div className="row-b-d" style={{gap: "20px"}}>
                        <button className="img-btn" onClick={e => {
                            scaleBtnAnimation(e, 1);
                            fetchAndPlayAudio(text, (lang == "Undefined") ? null : lang)}}>
                                <img src={soundIcom} alt="" /></button>
                        <button className="img-btn" onClick={e => {setText(""); scaleBtnAnimation(e, 1)}}>
                            <img src={clearIcon} alt="clear" height="25px"/></button>
                    </div>
                    
                    {type && <button className="img-btn" onClick={e => {updateTranslation();scaleBtnAnimation(e, 1);}}>
                        <img src={updateIcon} alt="retranslate" height="25px" /></button>}
                    {!type&& <button className="img-btn" onClick={e => {save();scaleBtnAnimation(e, 1);}}>
                    <img src={saveIcon} alt="retranslate" height="25px" /></button>}
                </div>
            </div>
        </div>
    )
}

export default TextInOutField;