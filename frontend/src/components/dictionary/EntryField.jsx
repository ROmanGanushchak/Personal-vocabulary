import React, { useContext, useEffect, useState } from "react";
import { EntryListContext } from "./EntryList";
import copyEntryIcom from '@logos/copy-entry.svg';
import settingsEntryIcon from '@logos/entry-settings.svg';
import soundIcon from '@logos/sound-icon.svg';
import { Dropdown } from "react-bootstrap";
import ResponsiveText from "../ResponsiveText";

import '@styles/dictionary/entry-field.css';
import '@styles/common.css';
import useEntryFabric from "../../hooks/useEntryFabric";

/* TO DO
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
    const {dict, enteriesHook, isBluer, askToChooseDict, fetchAndPlayAudio} = useContext(EntryListContext);
    const {deleteEntry, updateEntry} = enteriesHook;
    const {addToDictionary} = useEntryFabric();
    const [isPressed, setIsPressed] = useState(false);

    async function getChosenDict(dict) {
        if (dict) {
            try {
                addToDictionary(entry, dict);
            } catch(e) {}
        }
    };

    useEffect(() => {
        if (isBluer)
            setIsPressed(false);
    }, [isBluer]);

    return (
        <div className="entry-conteiner" onClick={() => setIsPressed(!isPressed)}>
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
                        <p className="hide-small-screen">{entry.guesingScore[0]}/{entry.guesingScore[1]}</p>
                    </div>

                    <div className="row-end-align hide-small-screen">
                        <p>{entry.addingTime}</p>
                    </div>
                </div>
                
                <div className="translations_conteiner">
                    <p className={`${!isPressed && isBluer && 'text-blur'} top-text`}>{entry.translates?.[1] || ''}</p>
                    <ResponsiveText maxWidth={150} className={`${!isPressed && isBluer && 'text-blur'} main-text`} >{entry.translates[0]}</ResponsiveText>
                    <p className={`${!isPressed && isBluer && 'text-blur'} bottom-text`}>{entry?.notes || ''}</p>
                </div>
            </div>
        </div>
    );
};

export default EntryField;