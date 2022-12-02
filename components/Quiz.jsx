import { nanoid } from "nanoid";
import React from "react";
import { State } from "./App";

// Quiz component which render each question with the info gotten from the API
export default function Quiz(props) {
    // Destructuring data from the props
    const {input, click, quizStatus} = props;
    const {Finished} = State

    // Function that based in conditions render the color of the answer elements
    function renderColor(id) {
        let ultimateClassName;

        if (quizStatus !== Finished) {
            input.answersArray.forEach((element) => {
                if (id === element.id && element.isHeld) {
                    ultimateClassName = "selected";
                }
            })
        }

        // When the quiz is finished it renders based on the conditions and whether the answer 
        // is correct or not, the corresponding color.
        if (quizStatus === Finished) {
            input.answersArray.forEach((data) => {
                const isCorrect = data.id === id && data.script === input.correctAnswer;
                const isWrong =  data.id === id && data.isHeld && data.script !== input.correctAnswer;
                const isUnselected = data.id === id && !data.isHeld;

                if (isCorrect) {
                    return ultimateClassName= "correct--answer";
                }

                if (isWrong) {
                    return ultimateClassName = "wrong--answer"
                }

                if (isUnselected) {
                    return ultimateClassName = "unselected--answers"
                }
            })
        }
        return ultimateClassName;
    }

    // Function that  gets the answers render the color based on the properties 
    // and returns a array of answers for each question in the quiz.
    const questionBox = () => {
        let box = []; 
        for (let i = 0; i < input.answersArray.length; i++) {
            const element =  input.answersArray[i];
            const queryId = input.id;

            box.push(
                <div 
                    // The way to change the color and some others design patterns is using classes.
                    key= {nanoid()}
                    className={`question--option ${renderColor(element.id)}`}
                    onClick={() => click(element.id, queryId)}
                    >
                    {element.script}
                </div>)
        }
        return box;
    }

    // The component return a valid question with a set of answers that can change the color based on 
    // was clicked and also after the user has completed the quiz, Display the corrects and wrong answers 
    return ( 
        <div className="container--question">
            <h3 className="question">{input.question}</h3>
            <div className="container--list " >
                {questionBox()}
            </div>
        </div>
        
    )
}