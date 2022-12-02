import React from "react";
import {nanoid} from "nanoid";
import Intro from "./Intro";
import Quiz from "./Quiz";

// Path that is been using to call the quiz Api.
const API = "https://opentdb.com/api.php?amount=5";
const DOUBLE_QUOT = '"';
const SIMPLE_QUOT = "'";

// I defined a set of variables to use around the program.
export const State = {Initial: 0, Started: 1, Finished: 2};

// Destructuring the State object.
const {Initial, Started, Finished} = State;

// App component which is part of the dynamic part of the page. 
export default function App() {
    // Using hooks to handle the dynamics part of the app.
    
    // Start quiz has as goal stores and listens when the user clicks the start button.
    const [startQuiz, setStartQuiz] = React.useState(Initial);

    // Question has as main goal to store the info from the Api and parse that information.
    const [questions, setQuestions] = React.useState(Initial);

    // Valid hook has as main goal checks if all the quiz options are valid to be summit.
    const [quizStatus, setQuizStatus] = React.useState(Initial);

    // Reboot hook has as main goal restart all of the game features.
    const [reboot, setReboot] = React.useState(Initial);

    // Change the state of the quiz hook 
    function handleClick() {
        setStartQuiz(Started);
    }

    // This function switches the state of the element answer that was clicked.
    // Returns new object with the property isHeld changed.
    function switchState(id, element) {
       const content = element.map((data) => {
            let props = { ...data, isHeld: false};

            if (data.id === id) {
                props = {
                    ...data,
                    isHeld: !data.isHeld
                }
            }
            return props;
        });
        return content;
    }

    // It changes the state of the answer element if the answer was clicked,
    // to the opposite state that the element had
    function toggleState(id, queryId) {
        if (quizStatus === Finished) return 0;

        setQuestions((prev) => {
            return prev.map((element) => {
                const isMatch = element.id === queryId;
                const replies = element.answersArray;
                const newAnswersArray = isMatch ? switchState(id, replies) : replies;
                return {
                    ...element,
                    answersArray: newAnswersArray
                }
            })
        })
    }

    // It parses the encode string that comes from the api, because of some
    // of the elements could be encoded, the function returns a string with the data decoded
    function decodeData(data) {
        const doubleQuot = /&quot;/g;
        const simpleQuot = /&#039;/g;
        const eAccent = /&eacute;/g;
        
        return data
            .replace(doubleQuot, DOUBLE_QUOT)
            .replace(simpleQuot, SIMPLE_QUOT)
            .replace(eAccent, '̈́é');
    }

    // It receives the data which is used to defined some answers properties and 
    // others properties are defined with default values
    const answersProperties = (data) => {
        return {
            isHeld: false,
            script: decodeData(data),
            id: nanoid()
        }
    }

    // This function return a random array with all the possibles answers
    function answersPropsConstructor(correct, incorrect) {
        const answers = incorrect;
        const random = Math.floor(Math.random() * incorrect.length);
        answers.splice(random, 0, correct);
        return answers.map((data) => answersProperties(data));
    }

    // This function takes the data from the object obtain from the API and 
    // translate the info into a object with the main data.
    const filterData = (data) => {
        return {
            id: nanoid(),
            correctAnswer: decodeData(data.correct_answer),
            answersArray: answersPropsConstructor(data.correct_answer, data.incorrect_answers),
            type: data.type,
            question: decodeData(data.question)
        }
    }

    // It returns an array which contains the essential data for the app.
    const parseData = (data) => {
        return data.results.map((data) => filterData(data));
    }

    // It receives a url to fetch data from an API and turn that info into 
    // useful data for the app 
    const useData = (url) => {
        const dataFetch = async () => {
            const data = await (
                await fetch(url)
            ).json();
            setQuestions(() => parseData(data))
        };
        dataFetch();
    }

    // This hook main function is to call the API once the app start and
    // then when the app is restarted
    React.useEffect(() => {
        return setQuestions(() => useData(API))
    }, [reboot])

    // This function returns an array that contains the quiz component 
    // with the required properties.
    function renderQuestions() {
        return questions.map((data) => (
            <Quiz 
                key={data.id}
                input={data}
                click={toggleState}
                quizStatus={quizStatus}
            />
        ));
    }

    // It is responsible for checking whether all the questions has a
    // selected answer or not
    function allChecked() {
        let filled = Finished

        questions.forEach((element) => {
            let checker = Initial;

            element.answersArray.forEach((data) => {
                if (data.isHeld) return checker = Finished;
            })

            if (!checker) return filled = Started;
        })
        return filled;
    }

    // This function traverses all the selected answers and return the number of which of them were correct.
    function assesResults() {
        let result = 0;

        questions.forEach((elements) => {
            const correct = elements.correctAnswer;
            elements.answersArray.forEach((input) => {
                if (input.isHeld && input.script === correct) {
                    result++;
                }
            })
        })
        return result;
    }

    // This function return the message to the user with the Quiz results.
    const quizResults = () => {
        const score = assesResults();
        const total = questions.length;

        if (score === 1) return `You scored ${score}/${total} correct answer`;

        return `You scored ${score}/${total} correct answers`;
    };

    // This function is triggering when the user clicks the checker button and
    // if the quiz is completed it triggers the quizResult function.
    const checkAnswers = () => {
        const complete = allChecked();
        setQuizStatus(complete);
        if (complete === Finished) return quizResults();
    }

    // This function reset the game.
    const reset = () => {
        setQuizStatus(Initial);
        setReboot((prev) => !prev);
    }

    // It shows the start button while the user doesn't click it.
    if (!startQuiz) return  <Intro handleClick={handleClick}/>;

    // Once the quiz start it always render a quiz section
    return (
        <main>
            {/* Conditional ternary display the quiz when the fetch function is ready, else if show a loading message */}
            {(questions) ? 
                <div className="questions--container">
                    <div>
                        
                        {
                        /* It call the function after the fetch function is ready. The function 
                         * returns an array of the Quiz component ready to be display.
                         */
                        }

                        {renderQuestions()}
                    </div>
                    
                    <div className="container--buttons">
                        
                        { 
                            (quizStatus !== Finished) && (
                                <div className="button--box">
                                    <button onClick={checkAnswers} className="container--button">Check answers</button>
                                </div>
                            )
                        }

                        {
                            quizStatus !== Initial && ( quizStatus === Finished 
                                ?
                                <div className="button--box container--stats--restart">
                                    <div className="container--stats"> {quizResults()} </div>
                                    <button onClick={reset} className="container--button">Play again</button> 
                                </div> 
                                :
                                <div className="container--error--message">Please, complete the quiz!</div>
                            )
                        }

                    </div>
                </div>
                :
                <div className="container--intro">
                    Loading...
                </div>
            }
        </main>
    )
}