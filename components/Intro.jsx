import React from "react"

export default function Intro(props) {
    return (
        <div className="container--intro">
            <h1 className="container--title">Quizzical</h1>
            <p className="container--description">
                Click start and test your knowledged.
            </p>
            <button 
                className="container--button" 
                onClick={props.handleClick}
                >Start quiz
            </button>
        </div>
    )
}