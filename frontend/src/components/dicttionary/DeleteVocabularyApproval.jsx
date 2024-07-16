import { Modal } from "react-bootstrap";
import {Button} from "react-bootstrap";

function DeleteVocabularyApproval( {isActive, setIsActive, dict, approveDeletion} ) {
    return isActive && <Modal
        show={isActive}
        onHide={() => {setIsActive(false);}}
        backdrop="static"
        // aria-labelledby="contained-modal-title-vcenter"
        centered>
    <Modal.Header closeButton>
        <h3> Delete vocabulary </h3>
    </Modal.Header>

    <Modal.Body>
        <p> After the deletion of vocabulaty {dict?.name}, it wont be possible to restore it and all {dict?.wordsCount} 
            words will be lost. If you are certain press 'Approve delition' to delete it </p>
    </Modal.Body>
    <Modal.Footer>
        <Button variant='danger btn' onClick={() => approveDeletion()}> Approve delition </Button>
    </Modal.Footer>
    </Modal>
};

export default DeleteVocabularyApproval;