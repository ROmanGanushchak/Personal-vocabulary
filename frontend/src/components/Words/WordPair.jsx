import React, { memo } from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '@styles/Words/wordpair.css'

export default memo(function WordPair( {nativeWord, learnedWord, isHeader=false} ) {
    const extra_col_style = isHeader && "word-header"

    return (
        <Row className={`words-container ${isHeader && "word-conteiner-header"}`}>
            <Col className={`word right-border ${extra_col_style}`}>{nativeWord}</Col>
            <Col className={`word ${extra_col_style}`}>{learnedWord}</Col>
        </Row>
    )
})