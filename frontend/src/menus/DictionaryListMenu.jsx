import DictList from "../components/dictionary/dictionaryList/DictList"

export default function DictionaryListMenu() {
    return (
        <div style={{width: '100%', display: "flex", justifyContent: 'center', alignItems: 'center', marginTop: '10px'}}>
            <div style={{width: '700px'}}>
                <DictList/>
            </div>
        </div>
    )
};