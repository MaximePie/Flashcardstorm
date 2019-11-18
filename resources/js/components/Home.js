import React from 'react';
import axios from "axios";
export default function Home() {

  const [questions, updateQuestions] = React.useState([{}]);
  const [answer, setAnswer] = React.useState("");

  React.useEffect(() => {
    updateQuestionsBag()
  }, [])

  return (
      <div className="container">
          <div className="row justify-content-center">
              <div className="col-md-8">
                <div className="card">
                  Bonjour et bienvenue sur FlashcardStorm
                  <div className="questions">
                    {questions.length && (
                      <p>{questions[0].wording}</p> // TODO - Create Question Card Component
                    )}
                  </div>
                  <input type="text" onChange={e => setAnswer(e.target.value)}/>
                </div>
              </div>
          </div>
          <button className="btn btn-primary" onClick={submitAnswer}>SUBMIT</button>
      </div>
  );

  // TODO - Create import from Excel feature, the program can take a csv file with 2 columns : Question,Answer 

  function submitAnswer() {
    if (answer === questions[0].answer) {
      alert("success")
      // TODO - Send success info

      // TODO - Fetch a new question and remove current question

      // TODO - Display the score sent by the Backoffice
    }
  }

  function updateQuestionsBag() {
    axios.get('/api/question').then(response => {
      updateQuestions(response.data)
    })
  }
}

