import { langs } from "../../Tranlations/LangSelector";
import BtnDropdown from "../../ButDropdown";
import { Dropdown } from "react-bootstrap";

import downArrowIcon from "@logos/down-arrow.svg";
import '@styles/dictionary/list/informal-lang-selector.css';

function InformalLangSelector( {lang, setLang, placeHolder='Undefined'} ) {
    return (
        <div className="inform-selector-conteiner">
            <p> {lang || placeHolder} </p>
            <BtnDropdown className="img-btn" text={<img src={downArrowIcon} alt="langs" width="20px"/>}>
                {langs.map((lang, index) => {
                    return <Dropdown.Item onClick={e => setLang(e.target.text)} key={index}>{lang.name}</Dropdown.Item>
                })}
            </BtnDropdown>
        </div>
    )
};

export default InformalLangSelector;