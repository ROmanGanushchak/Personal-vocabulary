import { Overlay, Popover, Button } from "react-bootstrap";
import { useContext, useState } from "react";
import { EntryListContext } from "./EntryList";

import '@styles/dictionary/choose-dict-to-merge.css';
import DictionaryContext from "../../context/useDictionaries";

function ChooseDictToMerge( {target, isActive, setIsActive} ) {
    const {askToChooseDict} = useContext(EntryListContext);
    const [dictToMerge, setDict] = useState(null);
    const [type, setType] = useState(0);
    const {dict} = useContext(EntryListContext);
    const {mergeDictionaries} = useContext(DictionaryContext);

    function dictionaryChosen(dict) {
        setDict(dict);
        setIsActive(true);
    };

    return (
        isActive && <Overlay
            show={String(isActive)}
            placement="bottom"
            target={target.current}
        >
            <Popover >
                <Popover.Header as="h3">Dictionary merging</Popover.Header>
                <Popover.Body >
                    <div className="col-display" style={{gap: '10px'}}>
                        <p style={{fontSize: "15px"}}>
                            Choose dictionary, from whitch all words will be taken and 
                            copied to this dict. 
                        </p>

                        <div className="">
                            <p>Chosen dict: {dictToMerge?.name || "None"}</p>
                            <Button onClick={() => {
                                setIsActive(false);
                                askToChooseDict(dictionaryChosen);
                            }} variant="primary">Choose dictionary</Button>
                        </div>

                        <p>Choose type of mergering:</p>
                        <div className="" onClick={e => {
                            (e.target.value > 0 && e.target.value < 3) && setType(e.target.value)
                        }}>
                            <div className="radio-cont">
                                <input type="radio" value={0} name='types' defaultChecked={true}/>
                                <p>Ignore copyes</p>
                            </div>

                            <div className="radio-cont">
                                <input type="radio" value={1} name='types'/>
                                <p>Replace current with words with new</p>
                            </div>

                            <div className="radio-cont">
                                <input type="radio" value={2} name='types'/>
                                <p>Keep both versions</p>
                            </div>
                        </div>
                    </div>
                </Popover.Body>
                <div className="bottom-part">
                    <Button onClick={() => {
                        if (dictToMerge !== null) {
                            mergeDictionaries(dictToMerge, dict, type);
                            setIsActive(false);
                        }
                    }}>Merge</Button>
                </div>
            </Popover>
        </Overlay>
    );
};

export default ChooseDictToMerge;