import { useNavigate } from 'react-router-dom';
import settingsIcon from '@logos/settings-icon.svg';
import googleLogo from '@logos/google-logo.png';

import '@styles/dictionary/list/dict-list-element.css'

function DictListElement( {dictData, callSettings} ) {
    const navigate = useNavigate();
    function pressedFlashPacks() {

    }

    function pressedList() {
        navigate(`/dictionaries/${dictData.name}`);
    };

    return (
        <div className="dict-elem-conteiner">
            <div className="dict-elem-main-conteiner">
                <div style={{display: 'flex', flexDirection: 'row', gap: '10px'}}>
                    <img src={dictData.logo || googleLogo} alt="dict-logo" />
                    <div className="info-conteiner">
                        <h2 className="dict-name"> {dictData.name} </h2>
                        <div className="extra-indo">
                            <p className="dict-regular-text"> {dictData.wordsCount}entry </p>
                            <p className="dict-regular-text"> {dictData.dateCreated} </p>
                        </div>
                    </div>
                </div>
                <div className="extra-settings">
                    <button className='img-btn' onClick={() => callSettings(dictData)}>
                        <img src={settingsIcon} alt="settings" className='settings-icon'/>
                    </button>
                </div>
            </div>

            <div className="extra-conteiner">
                <div className="cust-btn blue-btn" onClick={pressedFlashPacks}> Flashcards </div>
                <div className="cust-btn white-btn" onClick={pressedList}> View list </div>
            </div>
        </div>
    );
};

export default DictListElement;