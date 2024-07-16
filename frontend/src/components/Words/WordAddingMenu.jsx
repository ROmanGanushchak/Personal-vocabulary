import React from "react";
import WordPairList from "./WordPairList";
import "@styles/Words/word-adding-menu.css"

export default function WordAddingMenu() {
    const wordPairList = [["some1", "some2"], ["some2", "some3"], ["some3", "some4"], ["some4", "some5"], ["some5", "some6"]]

    return (
        <div className="conteiner">
            <WordPairList wordPairList={wordPairList}/>
            <div className="contros">
                <div className="adding">
                    <input type="text" className="learneword" />
                </div>
            </div>
        </div>
    )
}