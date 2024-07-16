import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

function LangSelector( {onLangChosen, variant="success"} ) {
    const langs = [{name: 'English'}, {name: 'French'}, {name: 'Slovak'}, {name: 'Ukrainian'}, {name: 'German'}]

    return (
        <Dropdown>
            <Dropdown.Toggle variant={variant} id="dropdown-basic"></Dropdown.Toggle>
            <Dropdown.Menu>
                {langs.map((lang, index) => {
                    return <Dropdown.Item onClick={e => onLangChosen(e.target.text)} key={index}>{lang.name}</Dropdown.Item>
                })}
            </Dropdown.Menu>
        </Dropdown>
    )
};

export default LangSelector;