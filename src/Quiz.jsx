import React, { useEffect, useState } from "react";

function Quiz() {
  const [question, setQuestion] = useState([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(5);
  const [message, setMessage] = useState("");

  async function fetchData() {
    let response = await fetch(
      "https://opentdb.com/api.php?amount=10&type=multiple"
    );
    let results = await response.json();
    if (results.response_code === 0) {
      setQuestion(results.results);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);
  function correctAnswer(check) {
    if (check) {
      setScore(score + 1);
      setMessage("Correct! 🎉");
    } else {
      setMessage(`Wrong, The correct answer was "${question[index].correct_answer}"`);
    }

    if (index < 9) {
      setIndex(index + 1);
      setTime(5); // Reset timer for the next question
    } else {
      setIndex(0);
      setScore(0);
    }
  }

  useEffect(() => {
    if (question.length === 0) return;
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime === 0) {
          
          setIndex(index + 1);
          return 5; 
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [index, question]);

  return (
    <>
      <div className="quiz-container">
        <h1>Quiz App</h1>
        {index <= 9 ? (
          <div className="question-container">
            {question.length === 0 ? (
              <div className="loader"></div>
            ) : (
              <div>
                <h2>Question {index + 1}</h2>
                <p
                  className="ques"
                  dangerouslySetInnerHTML={{ __html: question[index].question }}
                ></p>
                <ol>
                  {question[index].incorrect_answers.map((option, i) => (
                    <li key={i}>
                      <button onClick={() => correctAnswer(false)}>{option}</button>
                    </li>
                  ))}
                  <li>
                    <button onClick={() => correctAnswer(true)}>{question[index].correct_answer}</button>
                  </li>
                </ol>
                <p className="timer">Time left: <span>{time}</span> sec</p>
                <p className="message">{message}</p>
                <button className="skip" onClick={() => setIndex(index + 1)}>Skip Question</button>
              </div>
            )}
          </div>
        ) : (
          <div className="result-container">
            <h3>Quiz is Over</h3>
            <p>Your Score is <span>{score} / 10</span></p>
          </div>
        )}
      </div>
    </>
  );
}

export default Quiz;
