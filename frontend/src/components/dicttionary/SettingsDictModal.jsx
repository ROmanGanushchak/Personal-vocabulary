import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import useApi from "../../hooks/auth/useApi";
import DeleteVocabularyApproval from "./DeleteVocabularyApproval";

import '@styles/dictionary/create-dict-modal.css';
import '@styles/dictionary/settings-dict-modal.css';
/** dict:
 *  name
    language
    dateCreated
    wordsCounr
    logo
 */
function SettingsDictModal( {dict, submitChanges} ) { // dict - all dict data, type of dict from DictList.jsx
    const [name, setName] = useState(dict?.name || "Data werent loaded");
    const [isDefault, setIsDefault] = useState(dict?.isDefault || false);
    const [isDeleteActive, setIsDeleteActive] = useState(false);
    const [errorText, setErrorText] = useState('');
    const { api } = useApi();

    useEffect(() => {
        setName(dict?.name);
        setIsDefault(dict?.isDefault);
    }, [dict]);

    function trySubmit() {
        if (errorText)
            setErrorText('');

        if (dict.name === name && dict.isDefault === isDefault)
            submitChanges(dict, dict);
        else {
            api.post(`dictionary/update/${dict?.name || name}/`, {
                name: name,
                is_default: isDefault
            }).then(response => {
                console.log("In response -> " + response)
                let newDict = null;
                Object.assign(dict, newDict);
                submitChanges(dict, newDict);
            }).catch(error => {
                console.log("In erorr -> " + error);
                if (error.response && error.response.data['detail']) 
                    setErrorText(error.response.data['detail']);
            });
        }
    };

    function deleteDict() {
        console.log("Sending request to remove dict");
        api.post(`dictionary/delete/${dict?.name}/`)
        .then(() => {
            console.log("Dictionary was removed")
        }).catch(error => {
            if (error.response && error.response.data['detail'])
                setErrorText(error.response.data['detail']);
            else if (error.response)
                setErrorText(error.message);
            else
                setErrorText('Unknown error');
        }); 
        submitChanges(dict, dict);
    };
    
    return dict && <Modal
        show={String(Boolean(dict))}
        onHide={() => {setErrorText(''); submitChanges(dict, dict);}}
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