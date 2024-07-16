import { useEffect, useState } from "react";
import useApi from "../../hooks/auth/useApi";
import DictListElement from "./DictListElement";
import '@styles/dictionary/dict-list.css'
import CreateDictModal from './CreateDictModal';
import SettingsDictModal from "./SettingsDictModal";
import DeleteVocabularyApproval from "./DeleteVocabularyApproval";
import { Button } from "react-bootstrap";

export const WorkStates = {
    Default: 0,
    CreateDict: 1,
    DeleteDictApproval: 2
}

function DictList() {
    const { api } = useApi();
    const [dicts, setDicts] = useState([]);
    const [workState, setWorkState] = useState(WorkStates.Default);
    const [settingsDict, setSettingsDict] = useState(null);
    const dictsInRow = 3;

    useEffect(() => {
        api.get("dictionary/get/a/2/")
        .then(response => {
            const dictsResponse = response.data['dicts'];
            console.log(response);
            const dicts = [];
            for (const dict of dictsResponse) 
                dicts.push({
                    lang: dict['language'], 
                    dateCreated: dict['date_created'], 
                    name: dict['name'], 
                    isDefault: dict['is_default'],
                    wordsCount: dict['words_count']
                });
            setDicts(dicts);
        }).catch(error => {
            console.log(`In dictList error -> ${error}`);
        });
    }, []);

    function getRows() {
        const rows = [];
    
        for (let rowIndex = 0; rowIndex < dicts.length; rowIndex += dictsInRow) {
            const rowElements = [];
            for (let i = rowIndex; i < Math.min(rowIndex + dictsInRow, dicts.length); i++) {
                const dict = dicts[i];
                console.log(`${dict.name} -> ${dict.isDefault}`);
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

    function addNewDictionaty(name, lang, isDefault, dateCreated, wordsCount) {
        const newElem = {name: name, lang: lang, isDefault: isDefault, dateCreated: dateCreated, wordsCount: wordsCount};
        setDicts(arr =>  [...arr, newElem]);
    };

    function updateDictionary(oldDict, newDict) {
        setSettingsDict(null);
    }

    return (
        <div className="main-conteiner">
            <div className="title"> 
                <h2 className="dict-list-header"> My vocabulary </h2>
                <div className="">
                    <Button onClick={e => setWorkState(WorkStates.CreateDict)} variant="primary" className='add-btn'> Create new vocabulary </Button>
                </div>
            </div>
            {getRows()}

            <SettingsDictModal dict={settingsDict} submitChanges={updateDictionary}></SettingsDictModal>
            <CreateDictModal workState={workState} setWorkState={setWorkState} submitRezults={addNewDictionaty}/>
        </div>
    )
};

export default DictList;