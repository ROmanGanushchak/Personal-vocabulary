import { useContext, useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import useApi from "../../../hooks/auth/useApi";
import DeleteVocabularyApproval from "./DeleteVocabularyApproval";
import DictionaryContext from "../../../context/useDictionaries";

import '@styles/dictionary/list/create-dict-modal.css';
import '@styles/dictionary/list/settings-dict-modal.css';
/** dict:
 *  name
    language
    dateCreated
    wordsCounr
    logo
 */
function SettingsDictModal( {dict, informFinish} ) { // dict - all dict data, type of dict from DictList.jsx
    const [name, setName] = useState(dict?.name || "Data werent loaded");
    const [isDefault, setIsDefault] = useState(dict?.isDefault || false);
    const [isDeleteActive, setIsDeleteActive] = useState(false);
    const [errorText, setErrorText] = useState('');
    const {updateDictionary, deleteDictionary} = useContext(DictionaryContext);

    useEffect(() => {
        setName(dict?.name);
        setIsDefault(dict?.isDefault);
    }, [dict]);

    async function trySubmit() {
        if (errorText)
            setErrorText('');

        try {
            await updateDictionary(dict, name, isDefault);
            informFinish();
        } catch(error) {
            if (error.response && error.response.data['detail']) 
                setErrorText(error.response.data['detail']);
            else 
                setErrorText("Unknown error");
        };
    };

    async function deleteDict() {
        try {
            await deleteDictionary(dict);
            informFinish();
        } catch(error) {
            if (error.response && error.response.data['detail'])
                setErrorText(error.response.data['detail']);
            else if (error.response)
                setErrorText(error.message);
            else
                setErrorText('Unknown error');
        }
    };
    
    return dict && <Modal
        show={String(Boolean(dict))}
        onHide={() => {setErrorText(''); informFinish();}}
        backdrop="static"
        aria-labelledby="contained-modal-title-vcenter"
        centered>
    <Modal.Header closeButton>
        <h3> Dictionary settings </h3>
    </Modal.Header>

    <Modal.Body>
        <div className="input-field-conteiner">
            <p className='field-name'>Name:</p>
            <input type="text" placeholder="Type the dict name" onChange={e => setName(e.target.value)} value={name}/>
        </div>

        <div className="settings-conteiner">
            <div className="lang-conteiner">
                <p className='field-name'>Language:</p>
                <div className='lang-field'><p>{dict?.lang}</p></div>
            </div>

            <div className="checkbox-conteiner">
                <p>isDefault:</p>
                <input type="checkbox" onClick={() => setIsDefault(!isDefault)} defaultChecked={isDefault} />
            </div>
        </div>

        <label className='error-text'> {errorText} </label>
        <DeleteVocabularyApproval isActive={isDeleteActive} setIsActive={setIsDeleteActive} dict={dict} approveDeletion={deleteDict}></DeleteVocabularyApproval>
    </Modal.Body>
    <Modal.Footer>
        <Button variant="danger  btn" onClick={() => setIsDeleteActive(true)}> Delete </Button>
        <Button variant='primary btn' onClick={() => trySubmit()}> Submit </Button>
    </Modal.Footer>
    </Modal>
};

export default SettingsDictModal;