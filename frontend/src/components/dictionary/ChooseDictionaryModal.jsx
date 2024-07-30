import { useContext } from "react";
import DictionaryContext from "../../context/useDictionaries";
import { ListGroup } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";

function ChooseDictionaryModal( {isActive, submitRezults, notInclude} ) {
    const {dicts} = useContext(DictionaryContext);

    function getDictionariesList() {
        const list = []
        let i=0;
        for (const dict of dicts) {
            if (dict.name !== notInclude.name)
                list.push(<ListGroup.Item onClick={() => submitRezults(dict)} key={i++}>
                    {dict.name}
                </ListGroup.Item>);
        }
    
        if (list.length !== 0)
            return list
        return <p> Their is no dictionary to choose, plz create a different dictionary first </p>;
    }

    return (isActive && <Modal
            show={String(isActive)}
            onHide={() => {submitRezults(null);}}
            backdrop="static"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
        <Modal.Header closeButton>
            <h3> Choose dictionary </h3>
        </Modal.Header>

        <Modal.Body>
            <ListGroup>
                {getDictionariesList()}
            </ListGroup>
        </Modal.Body>
    </Modal>
    )
};

export default ChooseDictionaryModal;