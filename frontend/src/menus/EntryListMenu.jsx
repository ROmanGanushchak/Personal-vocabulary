import { useContext, useState, useEffect } from "react";
import EntryList from "../components/dictionary/EntryList";
import { useParams } from "react-router-dom";
import DictionaryContext from "../context/useDictionaries";
import { Spinner } from "react-bootstrap";

function EntryListMenu() {
    const { dictName } = useParams();
    const [dict, setDict] = useState(undefined);
    const {getDictByName} = useContext(DictionaryContext);

    useEffect(() => {
        async function init() {
            setDict(await getDictByName(dictName));
        };

        init();
    }, [dictName]);

    if (dict === undefined)
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    if (dict === null) 
        return <p>Dictionary with that name was not found</p>
    return (
        <div style={{width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
            <EntryList dict={dict}/>
        </div>
    )
};

export default EntryListMenu;