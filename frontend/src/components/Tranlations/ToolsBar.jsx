import React, { useContext } from "react";
import { TranslateMenuContext } from "./TranslateMenu";
import '@styles/translation/tool-bar.css';
import updateIcon from '@logos/update-icon.svg';
import swapIcon from '@logos/swap.svg';
import saveIcon from '@logos/save-icon.svg'

function ToolBar() {
    const { input, setInput, output, setOutput, sourceLang, targetLang,
        setSourceLang, setTargetLang, makeTranslate } = useContext(TranslateMenuContext);

    function swap() {
        if (sourceLang !== 'Undefined') {
            const oldSourceLang = sourceLang;
            setSourceLang(targetLang);
            setTargetLang(oldSourceLang);
            setInput(output);
            setOutput("");
        }
    };

    function save() {
        console.log(`${input} -> ${output}`);
    };

    function update() {
        setOutput("");
        makeTranslate();
    };

    return (
        <div className="conteiner">
            <button className="img-btn" onClick={update}> <img src={updateIcon} alt="update"/> </button>
            <button className="img-btn" onClick={swap}> <img src={swapIcon} alt="" /> </button>
            <button className="img-btn" onClick={save}> <img src={saveIcon} alt="save" /> </button>
        </div>
    );
};

export default ToolBar;