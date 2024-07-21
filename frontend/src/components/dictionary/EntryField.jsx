import React, { useContext, useState } from "react";
import { DictionaryMenuContext } from "./DictionaryMenu";
import copyEntryIcom from '@logos/copy-entry.svg';
import settingsEntryIcon from '@logos/entry-settings.svg';
import soundIcon from '@logos/sound-icon.svg';
import { Dropdown } from "react-bootstrap";
import ResponsiveText from "../ResponsiveText";

import '@styles/dictionary/entry-field.css';
import '@styles/common.css';

/* TO DO
notes
multiple translate variants
changes
*/

const CustomDropdownToggle = React.forwardRef(({ children, onClick }, ref) => (
    <button
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="img-btn set-btn"
    >
      {children}
    </button>
));

function EntryField( { entry } ) {
    const {dict, enteriesHook, isBluer, askToChooseDict, fetchAndPlayAudio} = useContext(DictionaryMenuContext);
    const {deleteEntry, updateEntry, addToDictionary} = enteriesHook;

    async function getChosenDict(dict) {
        if (dict) {
            try {
                addToDictionary(entry, dict);
            } catch(e) {}
        }
    };

    return (
        <div className="entry-conteiner">
            <div className="left-part">
                <button className="img-btn snd-btn"><img src={soundIcon} alt="voice" onClick={() => {
                    fetchAndPlayAudio(entry.word, dict.lang);
                }}/></button>
                <ResponsiveText maxWidth={120} className='left-part-text'>{entry.word}</ResponsiveText>
            </div>

            <div className="row-end-align">
                <div className="right-part">
                    <div className="row-end-align">
                        <Dropdown drop='start'>
                            <Dropdown.Toggle as={CustomDropdownToggle}>
                                <img src={settingsEntryIcon} alt="settings" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => askToChooseDict(getChosenDict)}> Add to different dictionary </Dropdown.Item>
                                <Dropdown.Item> Change </Dropdown.Item>
                                <Dropdown.Item onClick={() => deleteEntry(entry)}> Delete </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                        <p>{entry.guesingScore[0]}/{entry.guesingScore[1]}</p>
                    </div>

                    <div className="row-end-align">
                        <p>{entry.addingTime}</p>
                    </div>
                </div>
                
                <div className="translations_conteiner">
                    <p className="top-text">extra trans</p>
                    <ResponsiveText maxWidth={150} className={`${isBluer && 'text-blur'} main-text`} >{entry.translates[0]}</ResponsiveText>
                    <p className="bottom-text">note</p>
                </div>
            </div>
        </div>
    );
};

export default EntryField;