import React from "react";
import WordPair from "./WordPair";
import '@styles/Words/wordpairlist.css'

export default function WordPairList( {wordPairList} ) {
    return (
        <div className="conteiner">
            <WordPair nativeWord="Word" learnedWord="Meaning" isHeader={true} />
            {wordPairList.map((words, index) => {
                return <WordPair nativeWord={words[0]} learnedWord={words[1]} key={index} />
            })}
        </div>
    )
}