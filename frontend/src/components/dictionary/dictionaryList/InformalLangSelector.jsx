import LangSelector from "../../Tranlations/LangSelector";
import '@styles/dictionary/list/informal-lang-selector.css';

function InformalLangSelector( {lang, setLang, placeHolder='Undefined'} ) {
    return (
        <div className="inform-selector-conteiner">
            <p> {lang || placeHolder} </p>
            <LangSelector onLangChosen={setLang} variant="primary">{lang}</LangSelector>
        </div>
    )
};

export default InformalLangSelector;