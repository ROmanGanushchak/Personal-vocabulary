import "@styles/common.css";
import "@styles/number-input-field.css"

function NumberInputField( {name, value, setValue, minValue=0, maxValue=100, height='20px', fontSize='15px'} ) {
    const opButSize = parseInt(height, 10) / 2;
    function changeValue(diff) {
        setValue(value => Math.max(Math.min(value + diff, maxValue), minValue));
    }

    function inputChange(newValueStr) {
        const newValue = parseInt(newValueStr);
        if (newValueStr === '' || (newValue >= minValue && newValue <= maxValue))
            setValue(newValue);
    }

    return (
    <div className="row-display number-input-cont" style={{height: height}}>
        <p style={{fontSize: fontSize}}>{name}{name ? ":" : ""}</p>
        <button className="img-btn" onClick={() => changeValue(-1)} style={{marginLeft: '5px'}} >-</button>
        <input type="text" onChange={e => inputChange(e.target.value)} value={value || ''} style={{fontSize: fontSize, width:'40px', height: height}} placeholder="N"/>
        <button className="img-btn" onClick={() => changeValue(1)}>+</button>
    </div>
    )
};

export default NumberInputField;