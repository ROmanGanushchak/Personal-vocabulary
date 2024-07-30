import { useContext, useEffect, useState } from "react";
import useApi from "../../../hooks/auth/useApi";
import DictListElement from "./DictListElement";
import CreateDictModal from './CreateDictModal';
import SettingsDictModal from "./SettingsDictModal";
import { Button } from "react-bootstrap";
import DictionaryContext from "../../../context/useDictionaries";

import '@styles/dictionary/list/dict-list.css'

export const WorkStates = {
    Default: 0,
    CreateDict: 1,
    DeleteDictApproval: 2
}

function DictList() {
    const {dicts} = useContext(DictionaryContext);
    const [workState, setWorkState] = useState(WorkStates.Default);
    const [settingsDict, setSettingsDict] = useState(null);
    const dictsInRow = 3;

    function getRows() {
        const rows = [];
    
        for (let rowIndex = 0; rowIndex < dicts.length; rowIndex += dictsInRow) {
            const rowElements = [];
            for (let i = rowIndex; i < Math.min(rowIndex + dictsInRow, dicts.length); i++) {
                const dict = dicts[i];
                rowElements.push(
                    <DictListElement
                        dictData={dict}
                        callSettings={setSettingsDict}
                        key={i}
                    />
                );
            }
        
            rows.push(
                <div className="list-conteiner-row" key={rowIndex} 
                    style={{zIndex: `${dicts.length - rowIndex}`}}>
                    {rowElements}
                </div>
            );
        }
    
        return <div className="list-conteiner">
            {rows}
        </div>;
    };

    return (
        <div className="main-conteiner">
            <div className="title"> 
                <h2 className="dict-list-header"> My vocabulary </h2>
                <div className="">
                    <Button onClick={e => setWorkState(WorkStates.CreateDict)} variant="primary" className='add-btn'> Create new vocabulary </Button>
                </div>
            </div>
            {getRows()}

            <SettingsDictModal dict={settingsDict} informFinish={() => setSettingsDict(null)}></SettingsDictModal>
            <CreateDictModal workState={workState} setWorkState={setWorkState}/>
        </div>
    )
};

export default DictList;