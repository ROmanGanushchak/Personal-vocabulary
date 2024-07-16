import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import { useState } from 'react';
import InformalLangSelector from './InformalLangSelector';
import useApi from '../../hooks/auth/useApi';
import { WorkStates } from './DictList';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@styles/dictionary/create-dict-modal.css';

function CreateDictModal( {workState, setWorkState, submitRezults} ) {
    const [lang, setLang] = useState(null);
    const [name, setName] = useState('');
    const [isDefault, setIsDefault] = useState(false);
    const [errorText, setErrorText] = useState('');
    const {api} = useApi();

    function trySubmit() {
        if (!lang)
            setErrorText("Language has to be specified");
        else if (!name)
            setErrorText("Name has to be specified");
        else {
            api.post(`dictionary/create/${name}/${lang}/${0 + isDefault}/`)
            .then(response => {
                if (errorText)
                    setErrorText('');
                setWorkState(WorkStates.Default)
                submitRezults(name, lang, isDefault, response.data['date_created'], response.data['words_count']);
            }).catch(error => {
                console.log(`In CreateDictModal error ${error}`);
            });
        }
    };

    return workState === WorkStates.CreateDict && <Modal
                show={String(workState === WorkStates.CreateDict)}
                onHide={() => {setWorkState(WorkStates.Default); setErrorText('');}}
                backdrop="static"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
        <Modal.Header closeButton>
            <h3> Create new dictionary </h3>
        </Modal.Header>

        <Modal.Body>
            <div className="input-field-conteiner">
                <p>Name:</p>
                <input type="text" placeholder="Type the dict name" onChange={e => setName(e.target.value)}/>
            </div>

            <div className="lang-settings-conteiner">
                <div className="language-selector-conteiner">
                    <p>Language:</p>
                    <InformalLangSelector lang={lang} setLang={setLang}></InformalLangSelector>
                </div>

                <div className="checkbox-field-conteiner">
                    <p>IsDefault:</p>
                    <input type="checkbox" onClick={() => setIsDefault(!isDefault)} />
                </div>
            </div>

            <label className='error-text'> {errorText} </label>
        </Modal.Body>
        <Modal.Footer>
            <Button variant='primary btn' onClick={() => trySubmit()}> Submit </Button>
        </Modal.Footer>
    </Modal>
};

export default CreateDictModal;