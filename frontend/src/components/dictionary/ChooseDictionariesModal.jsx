import { useContext, useEffect, useRef } from "react";
import DictionaryContext from "../../context/useDictionaries";
import { ListGroup } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";

import "@styles/dictionary/choose-dict-to-merge.css";

function ChooseDictionariesModal( {isActive, submitRezults, lang, _dicts} ) {
    const {dicts} = useContext(DictionaryContext);
    const newDicts = useRef(new Map());
    const wasActive = useRef(false);

    function init() {
        wasActive.current = true;
        newDicts.current.clear();
        for (const dict of _dicts.current) {
            newDicts.current.set(dict.id, dict);
        }
    };

    function getDictionariesList() {
        const list = []
        let i=0;
        for (const dict of dicts) {
            list.push(
            <ListGroup.Item key={i++}>
                <div className="row-display" style={{width: "100%"}}>
                    <div className="row-b-d" style={{gap: "20px"}}>
                        <span className="dict-title-p">{dict.name}</span>
                        <span className="dict-lang">{dict.lang}</span>
                        <span className="dict-entries">{dict.wordsCount} entries</span>
                    </div>
                    <input type="checkbox" style={{width: "20px", height: "20px"}} 
                        defaultChecked={newDicts.current.has(dict.id)}
                        onClick={() => {
                            if (newDicts.current.has(dict.id))
                                newDicts.current.delete(dict.id);
                            else 
                                newDicts.current.set(dict.id, dict);
                        }}/>
                </div>
            </ListGroup.Item>);
        }
    
        if (list.length !== 0)
            return list
        return <p> No dictionary found </p>;
    };

    return (isActive && <Modal
            show={String(isActive)}
            onHide={() => {wasActive.current = false; submitRezults(_dicts.current);}}
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
        {wasActive.current === false && init()}
        <Modal.Header closeButton>
            <h3> Choose dictionaries </h3>
        </Modal.Header>

        <Modal.Body>
            <ListGroup>
                {getDictionariesList()}
            </ListGroup>
        </Modal.Body>

        <Modal.Footer className="no-padding">
            <Button onClick={() => {
                wasActive.current = false;
                submitRezults(Array.from(newDicts.current.values()) || [])
            }}>Submit</Button>
        </Modal.Footer>
    </Modal>
    )
};

export default ChooseDictionariesModal;