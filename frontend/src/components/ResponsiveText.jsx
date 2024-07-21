import { useEffect, useRef, useState } from "react";


function ResponsiveText( {children, defaultSize=20, maxWidth=100, minFintSize=10, className="", align='center'} ) {
    const [fontSize, setFontSize] = useState(defaultSize);
    const textRef = useRef(null);

    function adjustFontSize() {
        let newFontSize = defaultSize;
        
        textRef.current.style.fontSize = `${newFontSize}px`;
        
        while (textRef.current.scrollWidth > maxWidth && newFontSize > minFintSize) {
            newFontSize--;
            textRef.current.style.fontSize = `${newFontSize}px`;
        }
        setFontSize(newFontSize);
    };

    useEffect(() => {
        adjustFontSize();
    }, [children, defaultSize, maxWidth]);

    return (
        <div ref={textRef} style={{fontSize: `${fontSize}px`, whiteSpace: 'nowrap', alignItems: {align}}} className={className}>
            {children}
        </div>
    )
};

export default ResponsiveText;